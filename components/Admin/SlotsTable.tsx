"use client"
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DataTable() {
  const slots = useQuery(api.screeningSlots.listAll) || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {slots.map((slot) => (
            <tr key={slot._id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(slot.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{slot.startTime}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slot.bookings >= slot.maxCapacity 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                }`}>
                  {slot.bookings}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{slot.maxCapacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}