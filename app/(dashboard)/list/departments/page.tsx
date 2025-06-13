"use client";
import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import FormModel from "@/components/FormModel";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useCallback } from "react";
import CourseManagementModal from "@/components/CourseManagementModal";

const columns = [
  { header: "Department Name", accessor: "name" },
  { header: "Level 1 Students", accessor: "level1Count" },
  { header: "Level 2 Students", accessor: "level2Count" },
  { header: "Total Graduates", accessor: "totalGraduates" },
  { header: "Total Students (All Levels)", accessor: "total", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const DepartmentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<Id<"departments"> | null>(null);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
  
  const departments = useQuery(api.departments.getDepartments) || [];
  const userData = useQuery(api.users.getCurrentUser);

  // Filter departments based on user role
  const filteredDepartments = departments.filter(department => {
    if (!userData) return false;
    
    // Admin can see all departments
    if (userData.role === "admin") return true;
    
    // Teacher can see departments they teach in
    if (userData.role === "teacher") {
      // TODO: Implement teacher's department filtering
      return true;
    }
    
    // Student can see their department
    if (userData.role === "student") {
      // TODO: Implement student's department filtering
      return true;
    }
    
    return false;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDepartments = filteredDepartments.slice(startIndex, endIndex);

  // Use useCallback to memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Mutations for departments
  const addDepartment = useMutation(api.departments.addDepartment);
  const editDepartment = useMutation(api.departments.editDepartment);
  const deleteDepartment = useMutation(api.departments.deleteDepartment);
  const promoteAllToLevel2 = useMutation(api.departments.promoteAllToLevel2);

  // State for Course Management Modal
  const [role] = useState<"admin" | "user">("admin");

  const handleOpenCourseModal = (departmentId: Id<"departments">, departmentName: string) => {
    setSelectedDepartmentId(departmentId);
    setSelectedDepartmentName(departmentName);
    setIsCourseModalOpen(true);
  };

  const handleCloseCourseModal = () => {
    setIsCourseModalOpen(false);
    setSelectedDepartmentId(null);
    setSelectedDepartmentName("");
  };

  const handleAddDepartment = async (name: string) => {
    await addDepartment({ name });
  };

  const handleEditDepartment = async (id: Id<"departments">, newName: string) => {
    await editDepartment({ departmentId: id, newName });
  };

  const handleDeleteDepartment = async (id: Id<"departments">) => {
    await deleteDepartment({ departmentId: id });
  };

  const handlePromoteAllToLevel2 = async (departmentId: Id<"departments">) => {
    await promoteAllToLevel2({ departmentId });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRow = (item: any) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]">
      <td className="font-semibold p-4 px-1">{item.name}</td>
      <td className="p-4 px-1">{item.level1Count}</td>
      <td className="p-4 px-1">{item.level2Count}</td>
      <td className="p-4 px-1">{item.totalGraduates}</td>
      <td className="hidden md:table-cell p-4 px-1">
        {item.level1Count + item.level2Count + item.totalGraduates} {/* Total students including graduates */}
      </td>
      <td>
        <div className="flex gap-2 items-center">
          {role === "admin" && (
            <>
              {/* Promote All to Level 2 button for departments */}
              {item.level1Count > 0 && (
                <button
                  onClick={() => handlePromoteAllToLevel2(item._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                >
                  Promote Level 1s
                </button>
              )}

              {/* Manage Courses button */}
              <button
                onClick={() => handleOpenCourseModal(item._id, item.name)}
                className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition-colors"
              >
                Manage Programs
              </button>

              <FormModel
                table="department"
                type="edit"
                data={item}
                onEdit={handleEditDepartment}
              />
              <FormModel
                table="department"
                type="delete"
                id={item._id}
                onDelete={handleDeleteDepartment}
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col bg-white p-4 m-4 mt-0 flex-1 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="hidden md:block font-semibold text-gray-700 text-xl">
          {userData?.role === "admin" ? "All Departments" : 
           userData?.role === "teacher" ? "My Departments" : 
           "Departments"}
        </h1>
        <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-2">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-yellow-400 transition-colors">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] hover:bg-yellow-400 transition-colors">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {userData?.role === "admin" && (
              <FormModel
                table="department"
                type="plus"
                onAdd={handleAddDepartment}
              />
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          renderRow={renderRow}
          data={currentDepartments}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {isCourseModalOpen && selectedDepartmentId && (
        <CourseManagementModal
          departmentId={selectedDepartmentId}
          departmentName={selectedDepartmentName}
          onClose={handleCloseCourseModal}
        />
      )}
    </div>
  );
};

export default DepartmentsPage;
