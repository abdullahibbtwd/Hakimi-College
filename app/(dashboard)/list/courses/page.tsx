"use client"
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import FormModel from "@/components/FormModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useCallback } from "react";

type Course = {
  _id: string;
  name: string;
  code: string;
  creditUnit: number;
  semester: string;
  isGeneral: boolean;
  programs: string[];
  teachers: string[];
};

const columns = [
  {
    header: "Course Name",
    accessor: "name",
  },
  {
    header: "Code",
    accessor: "code",
    className: "hidden md:table-cell",
  },
  {
    header: "Credit Unit",
    accessor: "creditUnit",
    className: "hidden md:table-cell",
  },
  {
    header: "Semester",
    accessor: "semester",
  },
  {
    header: "Programs",
    accessor: "programs",
    className: "hidden md:table-cell",
  },
  {
    header: "Teachers",
    accessor: "teachers",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CoursesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const courses = useQuery(api.courses.getCourses) || [];
  const programs = useQuery(api.program.getAllProgram) || [];
  const teachers = useQuery(api.teachers.getTeachers) || [];
  const userData = useQuery(api.users.getCurrentUser);
  const currentStudent = useQuery(api.students.getCurrentStudent);
  
  // Filter courses based on user role
  const filteredCourses = courses.filter(course => {
    if (!userData) return false;
    
    // Admin can see all courses
    if (userData.role === "admin") return true;
    
    // Teacher can only see their assigned courses
    if (userData.role === "teacher") {
      const teacher = teachers.find(t => t.email === userData.email);
      return teacher && course.teacherIds.includes(teacher._id);
    }
    
    // Student can see courses related to their program and general courses
    if (userData.role === "student" && currentStudent) {
      return course.isGeneral || course.programIds.includes(currentStudent.programId);
    }
    
    return false;
  });
  
  // Map courses with program names and teacher names
  const coursesWithDetails = filteredCourses.map(course => {
    const coursePrograms = course.programIds
      .map(id => programs.find(p => p._id === id)?.name || "")
      .filter(name => name);
      
    const courseTeachers = course.teacherIds
      .map(id => teachers.find(t => t._id === id)?.name || "")
      .filter(name => name);
      
    return {
      ...course,
      programs: course.isGeneral ? ["All Programs"] : coursePrograms,
      teachers: courseTeachers,
    };
  });

  // Calculate pagination
  const totalPages = Math.ceil(coursesWithDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = coursesWithDetails.slice(startIndex, endIndex);

  // Use useCallback to memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderRow = (item: Course) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]">
      <td className="font-semibold p-4 px-1 items-center">{item.name}</td>
      <td className="hidden md:table-cell p-4 px-1 items-center">{item.code}</td>
      <td className="hidden md:table-cell p-4 px-1 items-center">{item.creditUnit}</td>
      <td className="p-4 px-1 items-center">{item.semester}</td>
      <td className="hidden md:table-cell p-4 px-1 items-center">{item.programs.join(", ")}</td>
      <td className="hidden md:table-cell p-4 px-1 items-center">{item.teachers.join(", ")}</td>
      <td>
        <div className="flex gap-2 items-center">
          {userData?.role === "admin" && (
            <>
              <FormModel table="course" type="edit" data={item} />      
              <FormModel table="course" type="delete" id={item._id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col bg-white p-4 m-4 mt-0 flex-1">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block font-semibold text-gray-700">
          {userData?.role === "admin" ? "All Courses" : 
           userData?.role === "teacher" ? "My Courses" : 
           "Available Courses"}
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-2">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {userData?.role === "admin" && (
              <FormModel table="course" type="plus" />
            )}
          </div>
        </div>
      </div>
      
      {/* Course List */}
      <div>
        <Table 
          columns={columns} 
          renderRow={renderRow} 
          data={currentCourses} 
        />
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div>
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CoursesPage;