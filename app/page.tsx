"use client"
import Banner from "@/components/Banner/Banner";
import Campus from "@/components/Campus/Campus";
import Contact from "@/components/Contact/Contact";
import Courses from "@/components/Courses/Courses";
import Facilities from "@/components/Facilities/Facilities";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";

export default function Home() {
  return (
    <div className="flex w-full justify-center">
       <div className="min-h-screen max-w-[1266px] gap-16 w-full ">
    <Hero/>
    <Courses/>
    <Banner/>
    <Facilities/>
    <Campus/>
    <Contact/>
    <Footer/>
    </div>
    </div>
   
  );
}
