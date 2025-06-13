"use client"
import Image from 'next/image';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Mon',
    present: 60,
    absent: 46,
   
  },
  {
    name: 'Tue',
    present: 30,
    absent: 70,
   
  },
  {
    name: 'Wed',
    present: 90,
    absent: 14,
    
  },
  {
    name: 'Thur',
    present: 80,
    absent: 23,
   
  },
  {
    name: 'Fri',
    present: 95,
    absent: 10,
   
  },

];

const Attendace = () => {
  return (
    <div className=' bg-white rounded-lg p-4 h-full'>
        
        {/* Title */}
        <div className='flex justify-between items-center '>
       <h1 className='text-lg font-semibold'>Attendance</h1>
         <Image src="/moreDark.png" alt='' width={20} height={20}/>
        </div>
        <ResponsiveContainer width="100%" height="90%">
        <BarChart
          width={500}
          height={300}
          data={data}
         barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
          <XAxis dataKey="name"  axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <YAxis axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
          <Tooltip contentStyle={{borderRadius:"10px",borderColor:"lightgray"}}/>
          <Legend  align='left' verticalAlign='top' wrapperStyle={{paddingTop:"15px",paddingBottom:"30px"}}/>
          <Bar radius={[10,10,0,0]} legendType='circle' dataKey="present" fill="#FAE27C"  />
          <Bar radius={[10,10,0,0]} dataKey="absent" legendType='circle' fill="#C3EBFA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Attendace