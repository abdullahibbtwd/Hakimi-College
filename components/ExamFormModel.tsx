"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { toast } from "sonner";

interface ExamFormModelProps {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit" | "delete";
  data?: any;
}

export default function ExamFormModel({ isOpen, onClose, type, data }: ExamFormModelProps) {
  const [formData, setFormData] = useState({
    courseId: "",
    teacherId: "",
    invigilatorId: "",
    examHall: "",
    date: "",
    startTime: "",
    endTime: "",
    semester: "Semester 1",
    programId: "",
    levelId: "",
  });

  const addExam = useMutation(api.exams.addExamTimetable);
  const updateExam = useMutation(api.exams.updateExamTimetable);
  const deleteExam = useMutation(api.exams.deleteExamTimetable);

  // Fetch data for dropdowns
  const courses = useQuery(api.courses.getCourses);
  const teachers = useQuery(api.teachers.getTeachers);
  const programs = useQuery(api.program.getAllProgram);
  const levels = useQuery(api.level.getLevels);

  useEffect(() => {
    if (type === "edit" && data) {
      setFormData({
        courseId: data.courseId || "",
        teacherId: data.teacherId || "",
        invigilatorId: data.invigilatorId || "",
        examHall: data.examHall || "",
        date: data.date || "",
        startTime: data.startTime || "",
        endTime: data.endTime || "",
        semester: data.semester || "Semester 1",
        programId: data.programId || "",
        levelId: data.levelId || "",
      });
    }
  }, [type, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === "add") {
        await addExam(formData);
        toast.success("Exam timetable added successfully");
      } else if (type === "edit") {
        await updateExam({ id: data._id, ...formData });
        toast.success("Exam timetable updated successfully");
      } else if (type === "delete") {
        await deleteExam({ id: data._id });
        toast.success("Exam timetable deleted successfully");
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (type === "delete") {
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogContent>
          <DialogTitle>Delete Exam Timetable</DialogTitle>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this exam timetable?
          </Typography>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <DialogTitle>
          {type === "add" ? "Add Exam Timetable" : "Edit Exam Timetable"}
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Course</InputLabel>
              <Select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                label="Course"
                required
              >
                {courses?.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Teacher</InputLabel>
              <Select
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                label="Teacher"
                required
              >
                {teachers?.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Invigilator</InputLabel>
              <Select
                value={formData.invigilatorId}
                onChange={(e) => setFormData({ ...formData, invigilatorId: e.target.value })}
                label="Invigilator"
              >
                {teachers?.map((teacher) => (
                  <MenuItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Exam Hall"
              value={formData.examHall}
              onChange={(e) => setFormData({ ...formData, examHall: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Semester</InputLabel>
              <Select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                label="Semester"
                required
              >
                <MenuItem value="Semester 1">Semester 1</MenuItem>
                <MenuItem value="Semester 2">Semester 2</MenuItem>
                <MenuItem value="Semester 3">Semester 3</MenuItem>
                <MenuItem value="Semester 4">Semester 4</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Program</InputLabel>
              <Select
                value={formData.programId}
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                label="Program"
                required
              >
                {programs?.map((program) => (
                  <MenuItem key={program._id} value={program._id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={formData.levelId}
                onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                label="Level"
                required
              >
                {levels?.map((level) => (
                  <MenuItem key={level._id} value={level._id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {type === "add" ? "Add Exam" : "Update Exam"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
} 