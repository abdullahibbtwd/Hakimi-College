"use client"
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect } from "react"; // Import React to use React.FormEvent
import { toast } from "sonner";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Box,
  Grid,
  Typography,
  CircularProgress, // For loading indicator
  Paper,
} from '@mui/material';
const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading</h1>
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading</h1>
});

interface FormModelProps {
  table:    "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
    | "department"
    | "studentAssignment"
    | "course"
    | "timetable"
    | "program"; 
  type: "plus" | "edit" | "delete";
  data?: any;
  id?: any; 
  onAdd?: (name: string, departmentId?: Id<"departments">) => void; 
  onEdit?: (id: any, updateData: any) => void; 
  onDelete?: (id: any) => void;
 
  departmentId?: Id<"departments">; 
}

const FormModel = ({
  table,
  type,
  data,
  id,
  onAdd,
  onEdit,
  onDelete,
  departmentId, 
}: FormModelProps) => {
  const size = type === "plus" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "plus" ? "bg-[#FAE27C]" :
    type === "edit" ? "bg-[#C3EBFA]" :
    "bg-[#CFCEFF]";
  
  const [open, setOpen] = useState(false);
  
  const [formName, setFormName] = useState(data?.name || "");
  const [level1Count, setLevel1Count] = useState(data?.level1Count || 0);
  const [level2Count, setLevel2Count] = useState(data?.level2Count || 0);
  const [graduateCount, setGraduateCount] = useState(data?.graduateCount || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
 const [assignmentFormData, setAssignmentFormData] = useState({
    department: "",
    program: "",
    level: "",
    studentId: ""
  });
  
  const departments = useQuery(api.departments.getDepartments) || [];
  const program = useQuery(api.program.getAllProgram) || [];
  

  const updateStudentAssignment = useMutation(api.students.updateStudentAssignment);
  // Reset form states when modal opens/data changes
  React.useEffect(() => {
    if (open) {
      setFormName(data?.name || "");
      setLevel1Count(data?.level1Count || 0);
      setLevel2Count(data?.level2Count || 0);
      setGraduateCount(data?.graduateCount || 0);
    }
  if (table === "studentAssignment" && data) {
        setAssignmentFormData({
          department: data.departmentId || "",
          program: data.programId || "",
          level: data.level || "",
          studentId: data._id || ""
        });
      }
    
  }, [open, data, table]);
  const [courseForm, setCourseForm] = useState({
    name: data?.name || "",
    code: data?.code || "",
    creditUnit: data?.creditUnit || 1,
    semester: data?.semester || "Semester 1",
    isGeneral: data?.isGeneral || false,
    programIds: data?.programIds || [],
    teacherIds: data?.teacherIds || [],
  });

  // Handle course form submission
  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (type === "plus") {
        await addCourse({
          ...courseForm,
          programIds: courseForm.isGeneral ? [] : courseForm.programIds,
        });
      } else if (type === "edit" && id) {
        await updateCourse({
          id: id as Id<"courses">,
          ...courseForm,
          programIds: courseForm.isGeneral ? [] : courseForm.programIds,
        });
      }
      toast.success(`Course ${type === "plus" ? "created" : "updated"} successfully!`);
      setOpen(false);
    } catch (error) {
      toast.error(`Failed to ${type === "plus" ? "create" : "update"} course`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define mutations
  const addCourse = useMutation(api.courses.addCourse);
  const updateCourse = useMutation(api.courses.updateCourse);

  // Render course form
  const renderCourseForm = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Take full viewport height
        py: 4, // Padding top/bottom
      }}
    >
      <Box
        component="form"
        onSubmit={handleCourseSubmit}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3, // MUI default for spacing
          width: '100%',
          maxWidth: 700, // Max width for the form on larger screens
          bgcolor: 'background.paper', // Uses theme background color
          borderRadius: 2, // MUI default border radius
          boxShadow: 3, // MUI default shadow
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {type === "plus" ? "Add New Course" : "Edit Course"}
        </Typography>

        <Grid container spacing={3}> {/* MUI Grid for responsive layout */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Course Name"
              variant="outlined"
              fullWidth
              value={courseForm.name}
              onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Course Code"
              variant="outlined"
              fullWidth
              value={courseForm.code}
              onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Credit Unit"
              type="number"
              variant="outlined"
              fullWidth
              inputProps={{ min: 1, max: 10 }}
              value={courseForm.creditUnit}
              onChange={(e) => setCourseForm({ ...courseForm, creditUnit: parseInt(e.target.value) || 1 })}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel>Semester</InputLabel>
              <Select
                value={courseForm.semester}
                onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value as string })}
                label="Semester"
              >
                <MenuItem value="Semester 1">Semester 1 (Level 1)</MenuItem>
                <MenuItem value="Semester 2">Semester 2 (Level 1)</MenuItem>
                <MenuItem value="Semester 3">Semester 3 (Level 2)</MenuItem>
                <MenuItem value="Semester 4">Semester 4 (Level 2)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          


          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={courseForm.isGeneral}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      isGeneral: e.target.checked,
                      programIds: e.target.checked ? [] : courseForm.programIds, // Clear programs if general
                    })
                  }
                />
              }
              label="General Subject (for all programs)"
            />
          </Grid>

          {!courseForm.isGeneral && (
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Programs</InputLabel>
                <Select
                  multiple
                  value={courseForm.programIds}
                  onChange={(e) => {
                    const selected = e.target.value as string[];
                    setCourseForm({ ...courseForm, programIds: selected });
                  }}
                  label="Select Programs"
                  renderValue={(selected) => (selected as string[]).map(id => program?.find(p => p._id === id)?.name || id).join(', ')}
                  required={!courseForm.isGeneral}
                >
                  {program?.map((programItem) => ( // Renamed program to programItem to avoid conflict with the array name
                    <MenuItem key={programItem._id} value={programItem._id}>
                      {programItem.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Hold Ctrl/Cmd to select multiple programs</FormHelperText>
              </FormControl>
            </Grid>
          )}

          {/* <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Assign Teachers</InputLabel>
              <Select
                multiple
                value={courseForm.teacherIds}
                onChange={(e) => {
                  const selected = e.target.value as string[];
                  setCourseForm({ ...courseForm, teacherIds: selected });
                }}
                label="Assign Teachers"
                renderValue={(selected) => (selected as string[]).map(id => teachers.find(t => t._id === id)?.fullName || id).join(', ')}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.fullName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Hold Ctrl/Cmd to select multiple teachers</FormHelperText>
            </FormControl>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )} */}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
              sx={{ mt: 2 }} // Margin top
            >
              {isSubmitting
                ? <CircularProgress size={24} color="inherit" />
                : type === "plus" ? "Add Course" : "Update Course"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (table === "department") {
      if (type === "plus" && onAdd) {
        onAdd(formName);
      } else if (type === "edit" && onEdit && data?._id) {
        onEdit(data._id, formName); // For department edit, only name is updated via newName string
      }
    } else if (table === "program") {
      if (type === "plus" && onAdd && departmentId) {
        onAdd(formName, departmentId); // Add course needs departmentId
      } else if (type === "edit" && onEdit && data?._id) {
        onEdit(data._id, { // Course edit can update name and counts
          name: formName,
          level1Count: level1Count,
          level2Count: level2Count,
          graduateCount: graduateCount,
        });
      }
    }
    setOpen(false);
  };
    const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateStudentAssignment({
        studentId: assignmentFormData.studentId as Id<"students">,
        departmentId: assignmentFormData.department as Id<"departments">,
        programId: assignmentFormData.program as Id<"program">,
        level: assignmentFormData.level as "level1" | "level2" | "graduate"
      });
      
      toast.success("Student assignment updated successfully!");
      setTimeout(() => setOpen(false), 1500);
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error(`Failed to update assignment`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add timetable mutations
  const addTimetable = useMutation(api.timetables.addTimetable);
  const updateTimetable = useMutation(api.timetables.updateTimetable);
  const deleteTimetable = useMutation(api.timetables.deleteTimetable);
  const courses = useQuery(api.courses.getCourses) || [];
  //const teachers = useQuery(api.teachers.getTeachers) || [];
  // Add timetable state
  const [timetableForm, setTimetableForm] = useState({
    departmentId: data?.departmentId || "",
    programId: data?.programId || "",
    level: data?.level || "Level 1",
    semester: data?.semester || "Semester 1",
    schedule: data?.schedule || [
      { day: "Monday", slots: [] },
      { day: "Tuesday", slots: [] },
      { day: "Wednesday", slots: [] },
      { day: "Thursday", slots: [] },
      { day: "Friday", slots: [] },
    ],
  });

  // Update form when data changes
  useEffect(() => {
    if (data && table === "timetable") {
      console.log("Updating timetable form with data:", data);
      setTimetableForm({
        departmentId: data.departmentId || "",
        programId: data.programId || "",
        level: data.level || "Level 1",
        semester: data.semester || "Semester 1",
        schedule: data.schedule || [
          { day: "Monday", slots: [] },
          { day: "Tuesday", slots: [] },
          { day: "Wednesday", slots: [] },
          { day: "Thursday", slots: [] },
          { day: "Friday", slots: [] },
        ],
      });
    }
  }, [data, table]);

  // Add slot to a day
  const addSlot = (dayIndex: number) => {
    const newSchedule = [...timetableForm.schedule];
    newSchedule[dayIndex].slots.push({
      startTime: "08:00",
      endTime: "09:00",
      courseId: "",
      classroom: "",
    });
    setTimetableForm({ ...timetableForm, schedule: newSchedule });
  };

  // Remove slot from a day
  const removeSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...timetableForm.schedule];
    newSchedule[dayIndex].slots.splice(slotIndex, 1);
    setTimetableForm({ ...timetableForm, schedule: newSchedule });
  };

  // Update slot data
  const updateSlot = (
    dayIndex: number,
    slotIndex: number,
    field: string,
    value: string
  ) => {
    const newSchedule = [...timetableForm.schedule];
    const updatedSlot = {
      ...newSchedule[dayIndex].slots[slotIndex],
      [field]: value,
    };
    
    // If courseId is cleared, also clear teacherId
    if (field === "courseId" && !value) {
      delete updatedSlot.teacherId;
    }
    
    newSchedule[dayIndex].slots[slotIndex] = updatedSlot;
    setTimetableForm({ ...timetableForm, schedule: newSchedule });
  };

  // Handle timetable form submission
  const handleTimetableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Starting timetable operation:", type);
      console.log("Timetable ID:", id);
      console.log("Form data:", JSON.stringify(timetableForm, null, 2));
      
      // Validate required fields
      if (!timetableForm.departmentId || !timetableForm.programId) {
        throw new Error("Department and Program are required");
      }

      // Validate schedule
      if (!timetableForm.schedule || timetableForm.schedule.length === 0) {
        throw new Error("Schedule is required");
      }

      // Validate slots
      for (const day of timetableForm.schedule) {
        for (const slot of day.slots) {
          if (!slot.courseId) {
            throw new Error(`Course is required for ${day.day}`);
          }
          if (!slot.startTime || !slot.endTime) {
            throw new Error(`Time is required for ${day.day}`);
          }
        }
      }

      // Prepare the data
      const timetableData = {
        departmentId: timetableForm.departmentId as Id<"departments">,
        programId: timetableForm.programId as Id<"program">,
        level: timetableForm.level,
        semester: timetableForm.semester,
        schedule: timetableForm.schedule.map(day => ({
          day: day.day,
          slots: day.slots.map(slot => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
            courseId: slot.courseId as Id<"courses">,
            classroom: slot.classroom || undefined,
          })),
        })),
      };

      console.log("Prepared timetable data:", JSON.stringify(timetableData, null, 2));
      
      if (type === "plus") {
        console.log("Creating new timetable...");
        const result = await addTimetable(timetableData);
        console.log("Timetable created successfully:", result);
        toast.success("Timetable created successfully!");
      } else if (type === "edit" && id) {
        console.log("Updating timetable with ID:", id);
        const updateData = {
          id: id as Id<"timetables">,
          ...timetableData
        };
        console.log("Update data:", JSON.stringify(updateData, null, 2));
        const result = await updateTimetable(updateData);
        console.log("Timetable updated successfully:", result);
        toast.success("Timetable updated successfully!");
      } else if (type === "delete" && id) {
        console.log("Deleting timetable with ID:", id);
        const result = await deleteTimetable({ id: id as Id<"timetables"> });
        console.log("Timetable deleted successfully:", result);
        toast.success("Timetable deleted successfully!");
      }
      setOpen(false);
    } catch (error: any) {
      console.error("Error in timetable operation:", error);
      const errorMessage = error?.message || `Failed to ${type} timetable`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render timetable form
  const renderTimetableForm = () => (
    <Box
      sx={{
        p: 4,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        {type === "plus" ? "Create New Timetable" : "Edit Timetable"}
      </Typography>
      
      <Box component="form" onSubmit={handleTimetableSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid component="div" item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={timetableForm.departmentId}
                onChange={(e) => {
                  setTimetableForm({
                    ...timetableForm,
                    departmentId: e.target.value,
                    programId: "",
                  });
                }}
                required
                disabled={type === "edit"}
                label="Department"
              >
                <MenuItem value="">Select Department</MenuItem>
                {departments.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid component="div" item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Program</InputLabel>
              <Select
                value={timetableForm.programId}
                onChange={(e) => setTimetableForm({ ...timetableForm, programId: e.target.value })}
                required
                disabled={type === "edit" || !timetableForm.departmentId}
                label="Program"
              >
                <MenuItem value="">Select Program</MenuItem>
                {program
                  .filter(p => p.departmentId === timetableForm.departmentId)
                  .map(prog => (
                    <MenuItem key={prog._id} value={prog._id}>
                      {prog.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid component="div" item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={timetableForm.level}
                onChange={(e) => setTimetableForm({ ...timetableForm, level: e.target.value })}
                required
                disabled={type === "edit"}
                label="Level"
              >
                <MenuItem value="Level 1">Level 1</MenuItem>
                <MenuItem value="Level 2">Level 2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid component="div" item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={timetableForm.semester}
                onChange={(e) => setTimetableForm({ ...timetableForm, semester: e.target.value })}
                required
                disabled={type === "edit"}
                label="Semester"
              >
                <MenuItem value="Semester 1">Semester 1</MenuItem>
                <MenuItem value="Semester 2">Semester 2</MenuItem>
                <MenuItem value="Semester 3">Semester 3</MenuItem>
                <MenuItem value="Semester 4">Semester 4</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Weekly Schedule
          </Typography>
          
          {timetableForm.schedule.map((daySchedule, dayIndex) => (
            <Box key={dayIndex} sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1">{daySchedule.day}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => addSlot(dayIndex)}
                  startIcon={<Image src="/plus.png" alt="Add" width={16} height={16} />}
                >
                  Add Slot
                </Button>
              </Box>
              
              {daySchedule.slots.length > 0 ? (
                <Grid container spacing={2}>
                  {daySchedule.slots.map((slot, slotIndex) => (
                    <Grid component="div" item xs={12} key={slotIndex}>
                      <Paper sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid component="div" item xs={12} sm={2}>
                            <TextField
                              label="Start Time"
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateSlot(dayIndex, slotIndex, "startTime", e.target.value)}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          
                          <Grid component="div" item xs={12} sm={2}>
                            <TextField
                              label="End Time"
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateSlot(dayIndex, slotIndex, "endTime", e.target.value)}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          
                          <Grid component="div" item xs={12} sm={4}>
                            <FormControl fullWidth>
                              <InputLabel>Course</InputLabel>
                              <Select
                                value={slot.courseId}
                                onChange={(e) => updateSlot(dayIndex, slotIndex, "courseId", e.target.value)}
                                label="Course"
                                required
                              >
                                <MenuItem value="">Select Course</MenuItem>
                                {courses
                                  .filter(course => {
                                    return course.isGeneral || 
                                           (course.programIds && course.programIds.includes(timetableForm.programId));
                                  })
                                  .map(course => (
                                    <MenuItem key={course._id} value={course._id}>
                                      {course.name} ({course.code})
                                      {course.isGeneral && " (General)"}
                                    </MenuItem>
                                  ))}
                              </Select>
                              <FormHelperText>
                                {timetableForm.programId 
                                  ? "Showing courses for selected program and general courses"
                                  : "Please select a program first"}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          
                          <Grid component="div" item xs={12} sm={3}>
                            <TextField
                              label="Room"
                              value={slot.classroom || ""}
                              onChange={(e) => updateSlot(dayIndex, slotIndex, "classroom", e.target.value)}
                              placeholder="Room #"
                              fullWidth
                            />
                          </Grid>
                          
                          <Grid component="div" item xs={12} sm={1}>
                            <Button
                              color="error"
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              sx={{ minWidth: 'auto' }}
                            >
                              <Image src="/delete.png" alt="Remove" width={16} height={16} />
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No time slots added
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting 
              ? "Saving..." 
              : type === "plus" ? "Create Timetable" : "Update Timetable"}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  const renderFormContent = () => {
    if (type === "delete" && id) {
      return (
        <div className="p-4 flex flex-col gap-4">
          <span>All data will be lost. Are you sure you want to delete this {table}?</span>
          <button
            className="bg-red-800 text-white py-2 px-4 w-max self-center rounded-md border-none hover:bg-red-700 transition-colors"
            onClick={() => {
              onDelete?.(id);
              setOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      );
    }
    if (table === "studentAssignment") {
      return (
        <form onSubmit={handleAssignmentSubmit} className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">
            {type === "plus" ? "Assign Student" : "Update Student Assignment"}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={assignmentFormData.department}
                onChange={(e) => {
                  setAssignmentFormData({
                    ...assignmentFormData,
                    department: e.target.value,
                    program: "" // Reset course when department changes
                  });
                }}
                className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                value={assignmentFormData.program}
                onChange={(e) => setAssignmentFormData({
                  ...assignmentFormData, 
                  program: e.target.value
                })}
                className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!assignmentFormData.department}
                required
              >
                <option value="">Select Program</option>
                {program
                  .filter(c => c.departmentId === assignmentFormData.department)
                  .map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))
                }
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={assignmentFormData.level}
                onChange={(e) => setAssignmentFormData({
                  ...assignmentFormData, 
                  level: e.target.value
                })}
                className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Level</option>
                <option value="level1">Level 1</option>
                <option value="level2">Level 2</option>
                <option value="graduate">Graduate</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded self-start hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Assignment"}
          </button>
          
          {isSubmitting && (
            <p className="text-blue-500 text-sm">Updating student assignment...</p>
          )}
        </form>
      );
    }

    if (table === "department") {
      return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">{type === "plus" ? "Add New Department" : "Edit Department"}</h2>
          <label className="block">
            Department Name:
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="border rounded p-2 w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded self-start hover:bg-blue-600 transition-colors"
          >
            {type === "plus" ? "Add Department" : "Update Department"}
          </button>
        </form>
      );
    }

    if (table === "program") {
      return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-semibold mb-2">{type === "plus" ? "Add New Course" : "Edit Course"}</h2>
          <label className="block">
            Program Name:
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              className="border rounded p-2 w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            Level 1 Students:
            <input
              type="number"
              value={level1Count}
              onChange={(e) => setLevel1Count(parseInt(e.target.value))}
              className="border rounded p-2 w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            Level 2 Students:
            <input
              type="number"
              value={level2Count}
              onChange={(e) => setLevel2Count(parseInt(e.target.value))}
              className="border rounded p-2 w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <label className="block">
            Graduates:
            <input
              type="number"
              value={graduateCount}
              onChange={(e) => setGraduateCount(parseInt(e.target.value))}
              className="border rounded p-2 w-full mt-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded self-start hover:bg-blue-600 transition-colors"
          >
            {type === "plus" ? "Add Program" : "Update Program"}
          </button>
        </form>
      );
    }
    
    if (table === "timetable") {
      return renderTimetableForm();
    }
    
    // Fallback for other specific forms (Teacher, Student, etc.)
    if (table === "teacher") {
      return <TeacherForm type={type} data={data} />;
    }
    if (table === "student") {
      return <StudentForm type={type} data={data} />;
    }

    return "Form not found for this table type.";
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`${size} flex items-center justify-center rounded-full ${bgColor} shadow-md transition-all duration-200 ease-in-out transform hover:scale-105`}
      >
        <Image 
          src={`/${type === "plus" ? "plus" : type === "edit" ? "edit" : "delete"}.png`} 
          alt={type} 
          width={16} 
          height={16} 
        />
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 relative w-full max-w-md md:max-w-lg lg:max-w-xl rounded-lg shadow-xl animate-fade-in-down">
           
             {table === "course" ? renderCourseForm() : renderFormContent()}
            <button
              className="absolute top-4 right-4 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Close" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModel;
