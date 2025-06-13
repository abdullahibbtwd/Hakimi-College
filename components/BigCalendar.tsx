/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Box, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent } from '@mui/material';
import { Id } from "@/convex/_generated/dataModel";

const localizer = momentLocalizer(moment)

// Custom styles for the calendar
const calendarStyles = {
    event: {
        backgroundColor: '#FAE27C',
        border: 'none',
        borderRadius: '4px',
        padding: '4px 8px',
        margin: '2px 0',
        color: '#000',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    }
};

interface TimetableEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: string;
}

interface Timetable {
  _id: string;
  programId: string;
  level: string;
  semester: string;
  schedule: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      courseId: Id<"courses">;
      classroom?: string;
    }>;
  }>;
}

interface Course {
  _id: Id<"courses">;
  name: string;
  code: string;
}

interface Student {
  _id: string;
  programId: string;
  level: "level1" | "level2" | "graduate";
  programName?: string;
}

const BigCalendar = () => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const [semester, setSemester] = useState("Semester 1");
    const [events, setEvents] = useState<TimetableEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const userData = useQuery(api.users.getCurrentUser);
    const teacher = useQuery(api.teachers.getCurrentTeacher);
    const student = useQuery(api.students.getCurrentStudent) as Student | null;
    const timetablesQuery = useQuery(api.timetables.getTimetables);
    const coursesQuery = useQuery(api.courses.getCourses);

    useEffect(() => {
        setIsLoading(true);

        if (!userData || !timetablesQuery || !coursesQuery) {
            setIsLoading(false);
            return;
        }

        const timetables = timetablesQuery as Timetable[] || [];
        const courses = coursesQuery as Course[] || [];
        
        let relevantTimetables: Timetable[] = [];
        
        if (userData.role === "teacher" && teacher) {
            // Filter timetables for teachers based on their assigned courses
            relevantTimetables = timetables.filter(timetable => {
                const hasTeacherCourses = timetable.schedule.some(day => 
                    day.slots.some(slot => teacher.courseIds.includes(slot.courseId))
                );
                return hasTeacherCourses && timetable.semester === semester;
            });
        } else if (userData.role === "student" && student) {
          
          
            relevantTimetables = timetables.filter(timetable => {
                // Convert student level to timetable level format
                const timetableLevel = `Level ${student.level.replace('level', '')}`;
                const matches = timetable.programId === student.programId &&
                    timetable.level === timetableLevel &&
                    timetable.semester === semester;
             
                return matches;
            });
           
        }

        const calendarEvents = relevantTimetables.flatMap(timetable => 
            timetable.schedule.flatMap(day => {
                // Only process weekdays (Monday to Friday)
                if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day.day)) {
                    return [];
                }

                return day.slots.map(slot => {
                    const course = courses.find(c => c._id === slot.courseId);
                    if (!course) {
                        console.log('Course not found for ID:', slot.courseId);
                        return null;
                    }

                    // Convert day name to date
                    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                        .indexOf(day.day);
                    
                    const now = new Date();
                    const currentDay = now.getDay();
                    const diff = dayIndex - currentDay;
                    const eventDate = new Date(now);
                    eventDate.setDate(now.getDate() + diff);

                    const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
                    const [endHours, endMinutes] = slot.endTime.split(':').map(Number);

                    const start = new Date(eventDate);
                    start.setHours(startHours, startMinutes, 0);

                    const end = new Date(eventDate);
                    end.setHours(endHours, endMinutes, 0);

                    const event = {
                        id: `${timetable._id}-${day.day}-${slot.startTime}`,
                        title: course.code,
                        start,
                        end,
                        resource: slot.classroom || 'No Room'
                    };
                    
                    return event;
                });
            })
        ).filter((event): event is TimetableEvent => event !== null);

       
        setEvents(calendarEvents);
        setIsLoading(false);
    }, [timetablesQuery, coursesQuery, semester, teacher, student, userData]);

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    };

    const handleSemesterChange = (event: SelectChangeEvent) => {
        setSemester(event.target.value);
    };

    if (!userData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading user information...</Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading timetable...</Typography>
            </Box>
        );
    }

    if (events.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h6">No timetable found</Typography>
                <Typography variant="body2" color="text.secondary">
                    You don&apos;t have any classes scheduled for this semester.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Current semester: {semester}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Box>
                    <Typography variant="h5">Schedule ({userData.role === "teacher" ? teacher?.departmentId : student?.programName})</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {userData.role === "teacher" ? teacher?.name : student?.programName}
                    </Typography>
                </Box>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Semester</InputLabel>
                    <Select
                        value={semester}
                        onChange={handleSemesterChange}
                        label="Semester"
                    >
                        <MenuItem value="Semester 1">Semester 1</MenuItem>
                        <MenuItem value="Semester 2">Semester 2</MenuItem>
                        <MenuItem value="Semester 3">Semester 3</MenuItem>
                        <MenuItem value="Semester 4">Semester 4</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={["work_week", "day"]}
                view={view}
                style={{ height: "100%" }}
                onView={handleOnChangeView}
                min={new Date(2024, 0, 1, 8, 0, 0)} // 8 AM
                max={new Date(2024, 0, 1, 17, 0, 0)} // 5 PM
                components={{
                    event: ({ event }) => (
                        <Box sx={{ 
                            p: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="body2" sx={{ 
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                lineHeight: 1.2
                            }}>
                                {event.title}
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                fontSize: '0.75rem',
                                opacity: 0.8
                            }}>
                                Room: {event.resource}
                            </Typography>
                        </Box>
                    )
                }}
                eventPropGetter={(event) => ({
                    style: calendarStyles.event
                })}
                formats={{
                    eventTimeRangeFormat: () => '' // Remove time from the top of events
                }}
            />
        </Box>
    );
};

export default BigCalendar; 