"use client"

import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Box, Select, MenuItem, FormControl, InputLabel, Typography, SelectChangeEvent, Grid } from '@mui/material';
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

const TeacherCalendar = () => {
    const [view, setView] = useState<View>(Views.WORK_WEEK);
    const [semester, setSemester] = useState("Semester 1");
    const [selectedProgram, setSelectedProgram] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [events, setEvents] = useState<TimetableEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const teacher = useQuery(api.teachers.getCurrentTeacher);
    const timetablesQuery = useQuery(api.timetables.getTimetables);
    const coursesQuery = useQuery(api.courses.getCourses);
    const programsQuery = useQuery(api.program.getPrograms);
    const levelsQuery = useQuery(api.level.getLevels);

    useEffect(() => {
        setIsLoading(true);

        if (!teacher || !timetablesQuery || !coursesQuery) {
            setIsLoading(false);
            return;
        }

        const timetables = timetablesQuery || [];
        const courses = coursesQuery || [];
        
        // Filter timetables based on teacher's assigned courses and selected program/level
        const relevantTimetables = timetables.filter(timetable => {
            // Check if any of the timetable slots contain courses assigned to this teacher
            const hasTeacherCourses = timetable.schedule.some(day => 
                day.slots.some(slot => {
                    const course = courses.find(c => c._id === slot.courseId);
                    return teacher.courseIds.includes(slot.courseId) && 
                           (!selectedProgram || course?.programId === selectedProgram) &&
                           (!selectedLevel || course?.levelId === selectedLevel);
                })
            );
            
            return hasTeacherCourses && timetable.semester === semester;
        });

        const calendarEvents = relevantTimetables.flatMap(timetable => 
            timetable.schedule.flatMap(day => {
                // Only process weekdays (Monday to Friday)
                if (!['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day.day)) {
                    return [];
                }

                return day.slots
                    .filter(slot => {
                        const course = courses.find(c => c._id === slot.courseId);
                        return teacher.courseIds.includes(slot.courseId) && 
                               (!selectedProgram || course?.programId === selectedProgram) &&
                               (!selectedLevel || course?.levelId === selectedLevel);
                    })
                    .map(slot => {
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

                        return {
                            id: `${timetable._id}-${day.day}-${slot.startTime}`,
                            title: course.code, // Only show course code
                            start,
                            end,
                            resource: slot.classroom || 'No Room'
                        };
                    });
            })
        ).filter((event): event is TimetableEvent => event !== null);

        setEvents(calendarEvents);
        setIsLoading(false);
    }, [timetablesQuery, coursesQuery, semester, teacher, selectedProgram, selectedLevel]);

    const handleOnChangeView = (selectedView: View) => {
        setView(selectedView);
    };

    const handleSemesterChange = (event: SelectChangeEvent) => {
        setSemester(event.target.value);
    };

    const handleProgramChange = (event: SelectChangeEvent) => {
        setSelectedProgram(event.target.value);
    };

    const handleLevelChange = (event: SelectChangeEvent) => {
        setSelectedLevel(event.target.value);
    };

    if (!teacher) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading teacher information...</Typography>
            </Box>
        );
    }

    const renderFilters = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <Box>
                <Typography variant="h5">My Schedule</Typography>
                <Typography variant="body2" color="text.secondary">
                    {teacher.name}
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
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
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Program</InputLabel>
                        <Select
                            value={selectedProgram}
                            onChange={handleProgramChange}
                            label="Program"
                        >
                            <MenuItem value="">All Programs</MenuItem>
                            {programsQuery?.map((program) => (
                                <MenuItem key={program._id} value={program._id}>
                                    {program.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                        <InputLabel>Level</InputLabel>
                        <Select
                            value={selectedLevel}
                            onChange={handleLevelChange}
                            label="Level"
                        >
                            <MenuItem value="">All Levels</MenuItem>
                            {levelsQuery?.map((level) => (
                                <MenuItem key={level._id} value={level._id}>
                                    {level.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderFilters()}
            
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography>Loading timetable...</Typography>
                </Box>
            ) : events.length === 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100%', 
                    flexDirection: 'column', 
                    gap: 2,
                    p: 4
                }}>
                    <Typography variant="h6">No timetable found</Typography>
                    <Typography variant="body2" color="text.secondary">
                        You don't have any classes scheduled for the selected filters.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Current semester: {semester}
                    </Typography>
                </Box>
            ) : (
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
                />
            )}
        </Box>
    );
};

export default TeacherCalendar; 