import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, isAfter, isBefore, isToday, subDays } from 'date-fns'
import { FaCheck, FaTimes, FaArrowLeft, FaArrowRight, FaFireAlt, FaClock } from 'react-icons/fa';

const HabitStats = ({ habits, onClose }) => {
  const [selectedHabit, setSelectedHabit] = useState(habits[0]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek);
  const weekEnd = endOfWeek(currentWeek);
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getCompletionStatus = (habit, date) => {
    const log = habit.logs.find(log => 
      isSameDay(new Date(log.date), date)
    );
    if (!log) return null;
    
    switch (habit.type) {
      case 'habit':
        return log.value >= habit.timesPerDay;
      case 'bad_habit':
        return log.value === 0;
      case 'timed_habit':
        return log.value >= habit.timeGoal;
      default:
        return null;
    }
  };

  const renderCompletionStatus = (status) => {
    if (status === null) return '-';
    return status ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />;
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));

  const calculateStreak = (habit) => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const status = getCompletionStatus(habit, currentDate);
      
      if (status === true) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else if (status === false) {
        // If there's a failed log, break the streak
        break;
      } else if (status === null) {
        // If there's no log for a past date, break the streak
        if (isBefore(currentDate, new Date())) {
          break;
        }
        // If it's today or a future date, continue checking but don't increment
        currentDate = subDays(currentDate, 1);
      }
    }
    
    return streak;
  };

  const renderStreakIcon = (habit) => {
    const streak = calculateStreak(habit);
    const todayStatus = getCompletionStatus(habit, new Date());
    const color = todayStatus === true ? "text-orange-500" : "text-gray-400";
    
    return (
      <span className={`flex items-center ${color}`}>
        <FaFireAlt className="mr-1" />
        {streak}
      </span>
    );
  };

  const getHabitIcon = (habitType) => {
    switch (habitType) {
      case 'habit':
        return <FaCheck className="main-color" />;
      case 'bad_habit':
        return <FaTimes className="text-red-500" />;
      case 'timed_habit':
        return <FaClock className="main-color" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Habit Stats</h2>
        <div className="flex">
          {/* Habit List */}
          <div className="w-1/4 pr-4 border-r">
            <h3 className="text-lg font-semibold mb-2">Your Habits</h3>
            <ul>
              {habits.map(habit => (
                <li 
                  key={habit.id} 
                  className={`cursor-pointer p-2 flex justify-between items-center ${selectedHabit.id === habit.id ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedHabit(habit)}
                >
                  <span className="flex items-center">
                    {getHabitIcon(habit.type)}
                    <span className="ml-2">{habit.name}</span>
                  </span>
                  {renderStreakIcon(habit)}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Stats View */}
          <div className="w-3/4 pl-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              {getHabitIcon(selectedHabit.type)}
              <span className="ml-2">{selectedHabit.name}</span>
            </h3>
            <div className="flex items-center justify-between mb-4">
              <button onClick={goToPreviousWeek} className="p-2"><FaArrowLeft /></button>
              <span>{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</span>
              <button onClick={goToNextWeek} className="p-2"><FaArrowRight /></button>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  {daysOfWeek.map(day => (
                    <th key={day.toString()} className="text-center">{format(day, 'EEE')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {daysOfWeek.map(day => (
                    <td key={day.toString()} className="text-center p-2">
                      <div className="flex justify-center items-center h-8">
                        {renderCompletionStatus(getCompletionStatus(selectedHabit, day))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HabitStats;