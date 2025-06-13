import React from 'react'
import { motion } from "framer-motion";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';



const SlideLeft = (delay:number) =>{
    return{
        initial:{
            opacity:0,
            x:50
        },
        animate:{
            opacity:1,
            x:0,
            transition:{
                duration:0.3,
                delay:delay,
                ease:"easeInOut",
            }
        }
    }
}

const Courses = () => {
   const programs = useQuery(api.program.getAllProgram) || [];
  
  return (
    <div> 
       <section className="bg-white px-10" >
      <div className="container md:pl-10 pb-14 pt-16">
        <motion.h1
            initial={{opacity:0,x:20}}
            whileInView={{opacity:1,x:0}}
            transition={{duration:0.3,delay:0.2}}
        className="text-4xl font-bold text-left pb-10">Our Programs</motion.h1>
        <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-6 gap-8">
          {programs.map((course) => (
            <motion.div 
            key={course._id}
            variants={SlideLeft(0.4)}
            initial="initial"
            whileInView={"animate"}
            //viewport={{once:true}}
            className="bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 cursor-pointer hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl">
              {/* <div className="text-2xl mb-3">{courses.icon}</div> */}
              <h1 className="text-lg font-semibold text-center px-3">
                {course.name}
              </h1>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
  )
}

export default Courses