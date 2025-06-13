import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    
        <div className="h-screen flex">
            {/* left */}
            <div className="w-[14%] p-3 md:w-[8%] lg:w-[16%] xl:w-[14%] ">
                <Link href='/' className="flex justify-center items-center gap-2 lg:justify-start">
                    <Image src="/jicohsat.png" width={32} height={32} alt="logo" className=""/>
                    <span className="hidden lg:block font-bold">JICOHSAT TWD</span>
                </Link>
                <Menu/>
            </div>
            {/* right */}
                <div className="w-[86%] md:w[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F7F7] overflow-scroll flex flex-col">
                    <Navbar/>
                    {children}
                </div>
            </div>
      
    );
  }
  