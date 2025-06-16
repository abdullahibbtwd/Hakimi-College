// "use client"
// import Image from 'next/image';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: 'Mon',
//     present: 60,
//     absent: 46,
   
//   },
//   {
//     name: 'Tue',
//     present: 30,
//     absent: 70,
   
//   },
//   {
//     name: 'Wed',
//     present: 90,
//     absent: 14,
    
//   },
//   {
//     name: 'Thur',
//     present: 80,
//     absent: 23,
   
//   },
//   {
//     name: 'Fri',
//     present: 95,
//     absent: 10,
   
//   },

// ];

// const Attendace = () => {
//   return (
//     <div className=' bg-white rounded-lg p-4 h-full'>
        
//         {/* Title */}
//         <div className='flex justify-between items-center '>
//        <h1 className='text-lg font-semibold'>Attendance</h1>
//          <Image src="/moreDark.png" alt='' width={20} height={20}/>
//         </div>
//         <ResponsiveContainer width="100%" height="90%">
//         <BarChart
//           width={500}
//           height={300}
//           data={data}
//          barSize={10}
//         >
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
//           <XAxis dataKey="name"  axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
//           <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
//           <Tooltip contentStyle={{borderRadius:"10px",borderColor:"lightgray"}}/>
//           <Legend  align='left' verticalAlign='top' wrapperStyle={{paddingTop:"15px",paddingBottom:"30px"}}/>
//           <Bar radius={[10,10,0,0]} legendType='circle' dataKey="present" fill="#FAE27C"  />
//           <Bar radius={[10,10,0,0]} dataKey="absent" legendType='circle' fill="#C3EBFA" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default Attendace

"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgramsChart = () => {
  // Fetch programs data from Convex
  const programs = useQuery(api.program.getAllProgram) || [];

  // Transform data for chart
  const chartData = programs.map(program => ({
    name: program.name,
    level1: program.level1Count,
    level2: program.level2Count,
    graduate: program.graduateCount,
    total: program.level1Count + program.level2Count + program.graduateCount
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-sm text-gray-600">
            Total: <span className="font-semibold">{payload[0].payload.total}</span>
          </p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: <span className="font-semibold">{entry.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white rounded-lg p-4 h-full'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-lg font-semibold'>Program Enrollment</h1>
        <Image src="/moreDark.png" alt='Options' width={20} height={20}/>
      </div>
      
      {programs.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          No program data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid horizontal={true} vertical={false} stroke="#eee" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6b7280', fontSize: 8 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              align="right"
              height={40}
              iconSize={10}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-gray-600 capitalize">{value}</span>
              )}
            />
            <Bar 
              dataKey="level1" 
              stackId="a" 
              name="Level 1" 
              fill="#FAE27C" 
              barSize={20} 
              radius={[0, 4, 4, 0]} 
            />
            <Bar 
              dataKey="level2" 
              stackId="a" 
              name="Level 2" 
              fill="#C3EBFA" 
              barSize={20} 
              radius={[0, 4, 4, 0]} 
            />
            <Bar 
              dataKey="graduate" 
              stackId="a" 
              name="Graduate" 
              fill="#A3D9B0" 
              barSize={20} 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default ProgramsChart;