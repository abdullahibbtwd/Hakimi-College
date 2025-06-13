"use client"
import Image from 'next/image';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Total',
    count:106,
    fill: 'white',
  },
  {
    name: 'Boys',
   count:53,
    fill: '#FAE27C',
  },
 
  {
    name: 'Girls',
   count:53,
    fill: "#C3EBFA",
  },
 
];



const CountChart = () => {
  return (
    <div className=' bg-white rounded-xl p-4 w-full h-full'>
        {/* TITTLE */}
        <div className="flex justify-between items-center">
            <h1 className='text-lg font-semibold'>Student</h1>
            <Image src="/moreDark.png" alt="" width={20} height={20}/>
        </div>
        {/* Chart */}
        <div className="w-full h-[75%] relative">
        <ResponsiveContainer >
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
            background
            dataKey="count"
          />
        
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src="/maleFemale.png" 
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' 
      alt='' width={50} height={50} />
        </div>
        {/* BOTTOM */}
        <div className="flex justify-center gap-16 ">
            <div className='flex flex-col gap-0.1'>
                <div className='w-5 h-5 bg-[#C3EBFA] rounded-full '/>
                    <h1 className='font-bold'>1,234</h1>
                    <h2 className='text-xs'>Boys (55%)</h2>
            </div>
            <div className='flex flex-col gap-0.1'>
                <div className='w-5 h-5 bg-[#FAE27C]  rounded-full '/>
                    <h1 className='font-bold'>1,000</h1>
                    <h2 className='text-xs'>Girls (45%)</h2>
            </div>
        </div>
    </div>
  )
}

export default CountChart