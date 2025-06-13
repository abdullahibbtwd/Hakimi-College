"use client"
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const SlotManager = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState(50);
  
  const addSlot = useMutation(api.screening.addScreeningSlot);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSlot({ date, startTime: time, maxCapacity: capacity });
    setDate("");
    setTime("");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add Screening Slot</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Capacity (default: 50)
          </label>
          <input
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};