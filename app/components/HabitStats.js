"use client";

import { useState, useEffect } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';

export default function HabitStats({ habit, onClose }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch habit stats from the API based on selected time range
    fetch(`/api/habits/${habit.id}/stats?range=${timeRange}`)
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching habit stats:', error));
  }, [habit.id, timeRange]);

  const getStartDate = () => {
    switch (timeRange) {
      case '7d': return format(subDays(new Date(), 7), 'yyyy-MM-dd');
      case '1m': return format(subMonths(new Date(), 1), 'yyyy-MM-dd');
      case '3m': return format(subMonths(new Date(), 3), 'yyyy-MM-dd');
      case '6m': return format(subMonths(new Date(), 6), 'yyyy-MM-dd');
      case '1y': return format(subYears(new Date(), 1), 'yyyy-MM-dd');
      case 'max': return format(new Date(0), 'yyyy-MM-dd'); // Assuming 'max' means from the beginning
      default: return format(subDays(new Date(), 7), 'yyyy-MM-dd');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#e8e9ec] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4 text-[#33374c]">{habit.name} Stats</h2>
        <div className="mb-4 space-x-2">
          {['7d', '1m', '3m', '6m', '1y', 'max'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-1 rounded ${timeRange === range ? 'bg-[#2d539e] text-white' : 'bg-[#adb1c4] text-[#33374c]'}`}
            >
              {range}
            </button>
          ))}
        </div>
        {stats && (
          <div className="mt-4">
            <p>Completion Rate: {(stats.completionRate * 100).toFixed(2)}%</p>
            <p>Current Streak: {stats.currentStreak} days</p>
            <p>Total Completions: {stats.totalCompletions}</p>
          </div>
        )}
        <button onClick={onClose} className="mt-6 px-4 py-2 bg-[#cc517a] text-white rounded">Close</button>
      </div>
    </div> 
  );
}
