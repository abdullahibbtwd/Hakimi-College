"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/pagination";
import Table from "@/components/Table";
import { parentsData, role, studentsData, teachersData } from "@/lib/data";
import FormModel from "@/components/FormModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Parent = {
  id: number;
  name: string;
  students: string[];
  phone: string;
  email?: string;
  class: string;
  address: string;
};

const columns = [
  {
    header: "info",
    accessor: "info",
  },
  {
    header: "Student Name",
    accessor: "students",
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

const ParentPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const parents = useQuery(api.parents.getParents) || [];
  const userData = useQuery(api.users.getCurrentUser);

  // Filter parents based on user role
  const filteredParents = parents.filter(parent => {
    if (!userData) return false;
    
    // Admin can see all parents
    if (userData.role === "admin") return true;
    
    // Teacher can see parents of students in their classes
    if (userData.role === "teacher") {
      // TODO: Implement teacher's parent filtering
      return true;
    }
    
    // Student can only see their own parents
    if (userData.role === "student") {
      // TODO: Implement student's parent filtering
      return true;
    }
    
    return false;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentParents = filteredParents.slice(startIndex, endIndex);

  // Use useCallback to memoize the page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const renderRow = (item: Parent) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-[12px] odd:bg-[#FEFCEB] hover:bg-[#F1F0FF]">
      <td className="flex  items-center gap-4 p-4">
      
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <h3 className="text-xs text-gray-500">{item?.email}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.students.join(",")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex gap-2 items-center">
        {role === "admin" && <> 
           <FormModel table="parent" type="edit" data={item}/>      
        
             <FormModel table="parent" type="delete" id={item.id}/>
         
            </>
            
             
             }
        </div>
      </td>
    </tr>
  );
  return (
    <div className="flex flex-col bg-white p-4 m-4 mt-0 flex-1">
      {/*Top  */}
      <div className="flex justify-between items-center">
        <h1 className="hidden md:block font-semibold text-gray-700">
          {userData?.role === "admin" ? "All Parents" : 
           userData?.role === "teacher" ? "Student Parents" : 
           "My Parents"}
        </h1>
        <div className="flex flex-col md:flex-row  w-full md:w-auto items-center gap-2">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {userData?.role === "admin" && (
              <FormModel table="parent" type="plus" />
            )}
          </div>
            {
              role === "admin" && (
                <FormModel table="parent" type="plus"/>
            //      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C]">
            //   <Image src="/plus.png" alt="" width={14} height={14} />
            // </button>
              )
            }
           
          </div>
        </div>
      </div>
      {/*list  */}
      <div className="">
        <Table columns={columns} renderRow={renderRow} data={parentsData}/>
      </div>
      {/*Bottom  */}
      <div className="">
        <Pagination />
      </div>
    </div>
  );
};

export default ParentPage;
