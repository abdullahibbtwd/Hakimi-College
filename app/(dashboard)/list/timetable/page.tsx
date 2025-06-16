"use client"
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import FormModel from "@/components/FormModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCallback, useState } from "react";

type Timetable = {
  _id: string;
  departmentId: string;
  programId: string;
  department: string;
  program: string;
  level: string;
  semester: string;
  schedule: Array<{
    day: string;
    slots: Array<{
      startTime: string;
      endTime: string;
      courseId: string;
      classroom?: string;
    }>;
  }>;
};

const columns = [
  {
    header: "Department",
    accessor: "department",
  },
  {
    header: "Program",
    accessor: "program",
  },
  {
    header: "Level",
    accessor: "level",
  },
  {
    header: "Semester",
    accessor: "semester",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TimetablePage = () => {
  const timetables = useQuery(api.timetables.getTimetables) || [];
  const departments = useQuery(api.departments.getDepartments) || [];
  const programs = useQuery(api.program.getAllProgram) || [];
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  
  // Filter timetables based on selection
  const filteredTimetables = timetables.map(t => {
      const department = departments.find(d => d._id === t.departmentId);
      const program = programs.find(p => p._id === t.programId);
      
      return {
        _id: t._id,
        departmentId: t.departmentId,
        programId: t.programId,
        department: department?.name || "Unknown",
        program: program?.name || "Unknown",
        level: t.level,
        semester: t.semester,
        schedule: t.schedule || []
      };
    })
    .filter(t => 
      (!selectedDepartment || t.departmentId === selectedDepartment) &&
      (!selectedProgram || t.programId === selectedProgram)
    );

  const totalPages = Math.ceil(filteredTimetables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTimeTables = filteredTimetables.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderRow = (item: Timetable) => {
    console.log("Rendering timetable row:", item);
    return (
      <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]">
        <td className="font-semibold p-4 px-1 items-center">{item.department}</td>
        <td className="p-4 px-1 items-center">{item.program}</td>
        <td className="p-4 px-1 items-center">{item.level}</td>
        <td className="p-4 px-1 items-center">{item.semester}</td>
        <td>
          <div className="flex gap-2 items-center">
            <FormModel 
              table="timetable" 
              type="edit" 
              data={item}
            />      
            <FormModel 
              table="timetable" 
              type="delete" 
              id={item._id} 
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col bg-white p-4 m-4 mt-0 flex-1">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block font-semibold text-gray-700">
          Timetables
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-2">
          <div className="flex gap-2">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="border rounded p-2 text-sm"
              disabled={!selectedDepartment}
            >
              <option value="">All Programs</option>
              {programs
                .filter(p => p.departmentId === selectedDepartment)
                .map(prog => (
                  <option key={prog._id} value={prog._id}>
                    {prog.name}
                  </option>
                ))}
            </select>
          </div>
          
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <FormModel table="timetable" type="plus" />
          </div>
        </div>
      </div>
      
      {/* Timetable List */}
      <div>
        <Table 
          columns={columns} 
          renderRow={renderRow} 
          data={currentTimeTables} 
        />
      </div>
      
      {/* Pagination */}
      <div>
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
    </div>
  );
};

export default TimetablePage;