import Announcement from "@/components/Announcement"
import BigCalendar from "@/components/BigCalender"

const ParentPage = () => {
  return (
    <div className='flex-1 p-4 flex gap-4 flex-col xl:flex-row'>
      {/* left */}
      <div className="w-full xl:w-2/3">
      <div className="h-full bg-white p-4 rounded-md">
        <h1 className="font-semibold text-x text-gray-800">
          Schedule (Abdul)
        </h1>
        <BigCalendar />
      </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">

      <Announcement/>
      </div>
    </div>
  )
}

export default ParentPage