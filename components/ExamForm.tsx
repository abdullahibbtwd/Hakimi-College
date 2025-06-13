"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExamFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit";
  data?: any;
}

export default function ExamForm({ isOpen, onClose, type, data }: ExamFormProps) {
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

  // Fetch data for dropdowns
  const courses = useQuery(api.courses.getCourses);
  const teachers = useQuery(api.teachers.getTeachers);
  const programs = useQuery(api.program.getPrograms);
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
      } else {
        await updateExam({ id: data._id, ...formData });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "add" ? "Add Exam Timetable" : "Edit Exam Timetable"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses?.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teacher" className="text-right">
                Teacher
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) =>
                  setFormData({ ...formData, teacherId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invigilator" className="text-right">
                Invigilator
              </Label>
              <Select
                value={formData.invigilatorId}
                onValueChange={(value) =>
                  setFormData({ ...formData, invigilatorId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select invigilator" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examHall" className="text-right">
                Exam Hall
              </Label>
              <Input
                id="examHall"
                value={formData.examHall}
                onChange={(e) =>
                  setFormData({ ...formData, examHall: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Select
                value={formData.semester}
                onValueChange={(value) =>
                  setFormData({ ...formData, semester: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semester 1">Semester 1</SelectItem>
                  <SelectItem value="Semester 2">Semester 2</SelectItem>
                  <SelectItem value="Semester 3">Semester 3</SelectItem>
                  <SelectItem value="Semester 4">Semester 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program" className="text-right">
                Program
              </Label>
              <Select
                value={formData.programId}
                onValueChange={(value) =>
                  setFormData({ ...formData, programId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program) => (
                    <SelectItem key={program._id} value={program._id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="level" className="text-right">
                Level
              </Label>
              <Select
                value={formData.levelId}
                onValueChange={(value) =>
                  setFormData({ ...formData, levelId: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels?.map((level) => (
                    <SelectItem key={level._id} value={level._id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">
              {type === "add" ? "Add Exam" : "Update Exam"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 