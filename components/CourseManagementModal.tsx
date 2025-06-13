// components/CourseManagementModal.tsx
"use client";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import FormModel from "./FormModel";
import Table from "./Table"; // Assuming you have a Table component

interface CourseManagementModalProps {
  departmentId: Id<"departments">;
  departmentName: string;
  onClose: () => void;
}

const CourseManagementModal: React.FC<CourseManagementModalProps> = ({
  departmentId,
  departmentName,
  onClose,
}) => {
  const program = useQuery(api.program.getProgramByDepartment, { departmentId }) || [];

  // Mutations for courses
  const addProgram = useMutation(api.program.addProgram);
  const editProgram = useMutation(api.program.editProgram);
  const deleteProgram = useMutation(api.program.deleteProgram);
  // Using updateCourseCounts for individual student promotions within a course for more flexibility
  const updateProgramCounts = useMutation(api.program.updateProgramCounts);

  const handleAddProgram = async (name: string) => {
    if (departmentId) {
      await addProgram({ departmentId, name });
    }
  };

  // The updateData here can contain name, level1Count, etc.
  const handleEditProgram = async (id: Id<"program">, updateData: { name?: string, level1Count?: number, level2Count?: number, graduateCount?: number }) => {
    await editProgram({ programId: id, ...updateData });
  };

  const handleDeleteProgram = async (id: Id<"program">) => {
    await deleteProgram({ programId: id });
  };

  // Promote Level 1 students to Level 2 for a specific course
  const handlePromoteLevel1ToLevel2 = async (programId: Id<"program">, currentLevel1: number) => {
    await updateProgramCounts({
        programId,
        level1Delta: -currentLevel1, // Subtract all current Level 1 students
        level2Delta: currentLevel1,  // Add them to Level 2
    });
  };

  // Promote Level 2 students to Graduates for a specific course
  const handlePromoteLevel2ToGraduates = async (programId: Id<"program">, currentLevel2: number) => {
    await updateProgramCounts({
        programId,
        level2Delta: -currentLevel2, // Subtract all current Level 2 students
        graduateDelta: currentLevel2, // Add them to Graduates
    });
  };


  const courseColumns = [
    { header: "Program Name", accessor: "name" },
    { header: "Level 1 Students", accessor: "level1Count" },
    { header: "Level 2 Students", accessor: "level2Count" },
    { header: "Graduates", accessor: "graduateCount" },
    { header: "Actions", accessor: "action" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProgramRow = (item: any) => (
    <tr key={item._id} className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]">
      <td className="font-semibold p-4 px-1">{item.name}</td>
      <td className="p-4 px-1">{item.level1Count}</td>
      <td className="p-4 px-1">{item.level2Count}</td>
      <td className="p-4 px-1">{item.graduateCount}</td>
      <td>
        <div className="flex flex-wrap gap-2 items-center">
          {item.level1Count > 0 && (
            <button
              onClick={() => handlePromoteLevel1ToLevel2(item._id, item.level1Count)}
              className="bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600 transition-colors"
            >
              L1 to L2
            </button>
          )}
          {item.level2Count > 0 && (
            <button
              onClick={() => handlePromoteLevel2ToGraduates(item._id, item.level2Count)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 transition-colors"
            >
              L2 to Graduates
            </button>
          )}
          <FormModel
            table="program"
            type="edit"
            data={item}
            onEdit={handleEditProgram}
            departmentId={departmentId}
          />
          <FormModel
            table="program"
            type="delete"
            id={item._id}
            onDelete={handleDeleteProgram}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 relative w-full max-w-2xl lg:max-w-4xl rounded-lg shadow-xl animate-fade-in-down">
        <h2 className="text-xl font-bold mb-4">Manage Program for {departmentName} Department</h2>

        <div className="flex justify-end mb-4">
          <FormModel
            table="program"
            type="plus"
            onAdd={handleAddProgram}
            departmentId={departmentId}
          />
        </div>

        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          {program.length > 0 ? (
            <Table
              columns={courseColumns}
              renderRow={renderProgramRow}
              data={program}
            />
          ) : (
            <p className="text-center text-gray-500 py-8">No Program found for this department. Add one!</p>
          )}
        </div>

        <button
          className="absolute top-4 right-4 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
        >
          <Image src="/close.png" alt="Close" width={14} height={14} />
        </button>
      </div>
    </div>
  );
};

export default CourseManagementModal;
