"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import FormModel from "@/components/FormModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

// Define student type with Convex fields
type Student = {
  _id: Id<"students">;
  studentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
  departmentId?: Id<"departments">;
  programId?: Id<"program">;
  level?: "level1" | "level2" | "graduate";
  departmentName?: string;
  programName?: string;
};

const columns = [
  {
    header: "info",
    accessor: "info",
  },
  {
    header: "Student ID",
    accessor: "studentId",
    className: "hidden md:table-cell",
  },
  {
    header: "Department",
    accessor: "department",
    className: "hidden md:table-cell",
  },
  {
    header: "Program",
    accessor: "course",
    className: "hidden md:table-cell",
  },
  {
    header: "Level",
    accessor: "level",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const students = useQuery(api.students.getAdmittedStudentsWithDetails) || [];
  const departments = useQuery(api.departments.getDepartments) || [];
  const programs = useQuery(api.program.getAllProgram) || [];
  const userData = useQuery(api.users.getCurrentUser);

  // Filter students based on user role
  const filteredStudents = students.filter(student => {
    if (!userData) return false;
    
    // Admin can see all students
    if (userData.role === "admin") return true;
    
    // Teacher can only see students in their courses
    if (userData.role === "teacher") {
      // TODO: Implement teacher's student filtering
      return true;
    }
    
    // Student can only see themselves
    if (userData.role === "student") {
      return student.email === userData.email;
    }
    
    return false;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Use useCallback to memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderRow = (item: Student) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.firstName} {item.lastName}
          </h3>
          <h3 className="text-xs text-gray-500">{item.class}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.studentId}</td>
      <td className="hidden md:table-cell">
        {item.departmentName || "Unassigned"}
      </td>
      <td className="hidden md:table-cell">
        {item.programName || "Unassigned"}
      </td>
      <td className="hidden md:table-cell capitalize">
        {item.level || "Unassigned"}
      </td>
      <td>
        <div className="flex gap-2 items-center">
          <FormModel
            table="studentAssignment"
            type="edit"
            data={{
              ...item,
              id: item._id,
              department: item.departmentId,
              program: item.programId,
              currentLevel: item.level,
            }}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col bg-white p-4 m-4 mt-0 flex-1">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block font-semibold text-gray-700">
          {userData?.role === "admin" ? "All Students" : 
           userData?.role === "teacher" ? "My Students" : 
           "Student Profile"}
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
              <FormModel table="student" type="plus" />
            )}
          </div>
        </div>
      </div>
      
      {/* Student List */}
      <div>
        <Table 
          columns={columns} 
          renderRow={renderRow} 
          data={currentStudents} 
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

export default StudentPage;
