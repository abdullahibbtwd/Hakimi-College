"use client"

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalender = () => {
    const router = useRouter();
    const [value, onChange] = useState<Value>(new Date());
    const events = useQuery(api.events.get);

    // Get events for the selected date
    const selectedDate = value instanceof Date ? value.toISOString().split('T')[0] : '';
    const eventsForSelectedDate = events?.filter(event => event.date === selectedDate) || [];

    // Get all dates that have events
    const eventDates = events?.map(event => {
        const [year, month, day] = event.date.split('-').map(Number);
        return new Date(year, month - 1, day);
    }) || [];

    const handleEventClick = () => {
        router.push('/list/events');
    };

    return (
        <div className='bg-white p-4'>
            <style jsx global>{`
                .react-calendar__tile--hasEvent {
                    background-color: #EDF9F0 !important;
                    border-radius: 50%;
                }
                .react-calendar__tile--hasEvent:hover {
                    background-color: #e5f5ea !important;
                }
                .react-calendar__tile--hasEvent abbr {
                    color: #4CAF50;
                    font-weight: 600;
                }
            `}</style>
            <Calendar 
                onChange={onChange} 
                value={value}
                tileClassName={({ date }) => {
                    return eventDates.some(eventDate => 
                        eventDate.getDate() === date.getDate() &&
                        eventDate.getMonth() === date.getMonth() &&
                        eventDate.getFullYear() === date.getFullYear()
                    ) ? 'has-event react-calendar__tile--hasEvent' : null;
                }}
            />
            <div className="flex items-center justify-between mt-4">
                <h1 className="text-[16px] font-semibold my-2 text-gray-500">Upcoming Events</h1>
                <Image 
                    src="/moreDark.png" 
                    alt="" 
                    width={20} 
                    height={20}
                    className="cursor-pointer"
                    onClick={handleEventClick}
                />
            </div>
            <div className="flex flex-col gap-2">
                {events && events.length > 0 ? (
                    events.map(event => (
                        <div 
                            className="p-3 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-[#C3EBFA] even:border-t-[#CFCEFF] cursor-pointer hover:bg-gray-50 transition-colors" 
                            key={event._id}
                            onClick={handleEventClick}
                        >
                            <div className="flex items-center justify-between">
                                <h1 className="font-semibold text-[14px] text-gray-600">{event.title}</h1>
                                <span className="text-gray-300 text-xs">
                                    {event.date} | {event.startTime} - {event.endTime}
                                </span>
                            </div>
                            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                        No events scheduled
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventCalender