"use client"
import Announcement from "@/components/Announcement"
import Attendace from "@/components/Attendace"
import CountChart from "@/components/CountChart"
import EventCalender from "@/components/EventCalender"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

const AdminPage = () => {
 const teacherStats = useQuery(api.admindashboard.getTeacherStats);
 const studentStats = useQuery(api.admindashboard.getStudentStats);
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      {/* Left */}
      <div className="w-full lg:w-2/3 flex flex-col gap-2 ">
        {/* Usercard */}
        <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="student" stats={studentStats ? studentStats.total : 0}/>
        <UserCard type="teacher"  stats={teacherStats ? teacherStats.total : 0} />
        </div>
        {/* Middle chart */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* radial */}
          <div className="w-full lg:w-1/3 h-[370px]">
            <CountChart/>
          </div>
          {/* Bar chart */}
          <div className="w-full lg:w-2/3 h-[370px]">
            <Attendace/>
          </div>
        </div>
        {/* bottom chart */}
         <div className="w-full h-[400px]">
  <FinanceChart/>
        </div>
      </div>
      {/* Right */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
      <EventCalender/>
      <Announcement/>
      </div>
      </div>
  )
}

export default AdminPage