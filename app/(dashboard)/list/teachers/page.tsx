"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { role } from "@/lib/data";
import FormModel from "@/components/FormModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Teacher = {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  img: string;
  phone: string;
  courseIds: string[];
  address: string;
};

const columns = [
  {
    header: "info",
    accessor: "info",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Courses",
    accessor: "courses",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TeachersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const teachers = useQuery(api.teachers.getTeachers) || [];
  const userData = useQuery(api.users.getCurrentUser);

  // Filter teachers based on user role
  const filteredTeachers = teachers.filter(teacher => {
    if (!userData) return false;
    
    // Admin can see all teachers
    if (userData.role === "admin") return true;
    
    // Teacher can only see themselves
    if (userData.role === "teacher") {
      return teacher.email === userData.email;
    }
    
    // Student can see all teachers
    if (userData.role === "student") return true;
    
    return false;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  // Use useCallback to memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const courses = useQuery(api.courses.getCourses) || [];

  const getCourseNames = (courseIds: string[]) => {
    return courseIds
      .map(id => courses.find(course => course._id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  const renderRow = (item: Teacher) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img || "/default-avatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <h3 className="text-xs text-gray-500">{item.email}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">{getCourseNames(item.courseIds)}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex gap-2 items-center">
          {userData?.role === "admin" && (
            <>
              <FormModel table="teacher" type="edit" data={item} />
              <FormModel table="teacher" type="delete" id={item._id} />
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
          {userData?.role === "admin" ? "All Teachers" : 
           userData?.role === "teacher" ? "My Profile" : 
           "Teachers"}
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
              <FormModel table="teacher" type="plus" />
            )}
          </div>
        </div>
      </div>
      
      {/* Teacher List */}
      <div>
        <Table 
          columns={columns} 
          renderRow={renderRow} 
          data={currentTeachers} 
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

export default TeachersPage;
