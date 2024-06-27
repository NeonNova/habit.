"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import AddHabitModal from './components/AddHabitModal';
import HabitStats from './components/HabitStats';
import Confetti from './components/Confetti';
import { FaCheck, FaTimes, FaClock, FaCrown, FaTrophy } from 'react-icons/fa';
import { IoMdAdd, IoMdClose } from 'react-icons/io';


export default function Home() {
  const [habits, setHabits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const today = format(new Date(), 'dd MMM yy');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }
      const data = await response.json();
      console.log('Fetched habits:', data); // Log fetched habits
      setHabits(data);
    } catch (error) {
      console.error('Error fetching habits:', error);
      alert('Failed to fetch habits. Please try again.');
    }
  };

  const addHabit = async (newHabit) => {
    try {
      if (habits.length >= 6) {
        throw new Error('You can only add up to 6 habits.');
      }
      console.log('Adding new habit:', newHabit); // Log the new habit being added
      const habitData = {
        name: newHabit.name,
        type: newHabit.type,
        target: newHabit.target,
      };
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData),
      });
      const createdHabit = await response.json();
      console.log('Created habit:', createdHabit); // Log the created habit
      setHabits([...habits, createdHabit]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding habit:', error);
      alert(error.message);
    }
  };

  const updateHabit = async (updatedHabit) => {
    try {
      const response = await fetch(`/api/habits/${updatedHabit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedHabit),
      });
      const data = await response.json();
      setHabits(habits.map(h => h.id === data.id ? data : h));
    } catch (error) {
      console.error('Error updating habit:', error);
      alert(`Failed to update habit: ${error.message}`);
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      const response = await fetch(`/api/habits?id=${habitId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to delete habit: ${response.statusText}`);
      }
      
      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
      // Remove this line to keep delete mode active
      // setDeleteMode(false);
    } catch (error) {
      console.error('Error in deleteHabit:', error);
      alert(`Failed to delete habit. ${error.message}`);
    }
  };
  

  const calculateOverallProgress = useCallback(() => {
    let completedTasks = 0;
    let totalTasks = habits.length;
  
    habits.forEach((habit) => {
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = habit.logs?.filter(log => 
        new Date(log.date).toISOString().split('T')[0] === today
      ) || [];
  
      const completions = todayLogs.reduce((sum, log) => sum + (log.value || 0), 0);
  
      switch (habit.type) {
        case 'habit':
          if (completions >= habit.timesPerDay) completedTasks++;
          break;
        case 'bad_habit':
          if (completions === 0) completedTasks++;
          break;
        case 'timed_habit':
          if (completions >= habit.timeGoal) completedTasks++;
          break;
      }
    });
  
      const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      return { completedTasks, totalTasks, progressPercentage };
  }, [habits]);

  useEffect(() => {
    const { progressPercentage } = calculateOverallProgress();
    if (progressPercentage === 100) {
      triggerCelebration();
    }
  }, [calculateOverallProgress]);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setShowCongrats(true);
     // 5 seconds of confetti
  };

  const triggerConfetti = () => {
    setShowConfetti(false); // Reset the state
    setTimeout(() => setShowConfetti(true), 10); // Trigger confetti after a short delay
  };

  const getHabitProgress = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = habit.logs?.filter(log => 
      new Date(log.date).toISOString().split('T')[0] === today
    ) || [];
  
    const completions = todayLogs.reduce((sum, log) => sum + (log.value || 0), 0);
  
    const getProgressBarStyle = (percentage, isTimedOrBadHabit) => {
      if (isTimedOrBadHabit) {
        return `linear-gradient(-45deg, var(--main-color) 25%, ${isTimedOrBadHabit === 'timed' ? '#4CAF50' : '#F44336'} 25%, ${isTimedOrBadHabit === 'timed' ? '#4CAF50' : '#F44336'} 50%, var(--main-color) 50%, var(--main-color) 75%, ${isTimedOrBadHabit === 'timed' ? '#4CAF50' : '#F44336'} 75%)`;
      }
      return 'var(--main-color)';
    };
  
    switch (habit.type) {
      case 'habit':
        const maxCompletions = habit.timesPerDay || 1;
        const progressPercentage = Math.min((completions / maxCompletions) * 100, 100);
        return (
          <div>
            <span>{completions}/{maxCompletions}</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
              <div 
                className="h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%`, backgroundColor: getProgressBarStyle(progressPercentage) }}
              ></div>
            </div>
          </div>
        );
      case 'timed_habit':
        const timeGoal = habit.timeGoal || 0;
        const timeProgressPercentage = Math.min((completions / timeGoal) * 100, 100);
        return (
          <div>
            <span>{completions}/{timeGoal} minutes</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${timeProgressPercentage}%`, 
                  backgroundImage: getProgressBarStyle(timeProgressPercentage, 'timed'), 
                  backgroundSize: '40px 40px',
                  animation: 'moveStripes 1s linear infinite'
                }}
              ></div>
            </div>
          </div>
        );
      case 'bad_habit':
        const maxOccurrences = habit.missesAllowed || 1;
        const badHabitPercentage = Math.min((completions / maxOccurrences) * 100, 100);
        return (
          <div>
            <span>{completions}/{maxOccurrences} occurrences</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
              <div 
                className="h-2.5 rounded-full" 
                style={{ 
                  width: `${badHabitPercentage}%`, 
                  backgroundImage: getProgressBarStyle(badHabitPercentage, 'bad'), 
                  backgroundSize: '40px 40px',
                  animation: 'moveStripes 1s linear infinite'
                }}
              ></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getHabitInput = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = habit.logs?.filter(log => 
      new Date(log.date).toISOString().split('T')[0] === today
    ) || [];
    const completions = todayLogs.reduce((sum, log) => sum + log.value, 0);
    
    const buttonClass = 'px-2 py-1 rounded bg-[var(--main-bg-color)] text-[var(--sub-color)]';
  
    const renderInput = () => {
      switch (habit.type) {
        case 'habit':
          return (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logHabit(habit, -1);
                }} 
                className={`${buttonClass} ${completions > 0 ? '' : 'invisible'}`}
                disabled={deleteMode || completions === 0}
              >
                Undo
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logHabit(habit, 1);
                }} 
                className={`${buttonClass} ml-2`}
                disabled={deleteMode || completions >= habit.timesPerDay}
              >
                Done
              </button>
            </>
          );
        case 'timed_habit':
          return (
            <input
              type="range"
              min="0"
              max={habit.timeGoal}
              value={completions}
              onChange={(e) => {
                e.stopPropagation();
                const newValue = parseInt(e.target.value);
                logHabit(habit, newValue - completions);
              }}
              disabled={deleteMode}
              className="w-full"
            />
          );
        case 'bad_habit':
          return (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logHabit(habit, -1);
                }} 
                className={`${buttonClass} ${completions > 0 ? '' : 'invisible'}`}
                disabled={deleteMode || completions === 0}
              >
                Undo
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logHabit(habit, 1);
                }} 
                className={`${buttonClass} bg-red-500 ml-2`}
                disabled={deleteMode}
              >
                Occurred
              </button>
            </>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="flex items-center">
        {renderInput()}
      </div>
    );
  };

  const logHabit = async (habit, value) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = habit.logs?.filter(log => 
        new Date(log.date).toISOString().split('T')[0] === today
      ) || [];
      
      const currentValue = todayLogs.reduce((sum, log) => sum + (log.value || 0), 0);
      let newValue;

      switch (habit.type) {
        case 'habit':
          const maxCompletions = habit.timesPerDay || 1;
          newValue = Math.max(0, Math.min(currentValue + value, maxCompletions));
          break;
        case 'timed_habit':
          newValue = Math.max(0, currentValue + value);
          break;
        case 'bad_habit':
          newValue = Math.max(0, currentValue + value);
          break;
        default:
          throw new Error('Invalid habit type');
      }

      // Optimistically update the state
      setHabits(prevHabits => prevHabits.map(h => {
        if (h.id === habit.id) {
          let updatedLogs = h.logs ? [...h.logs] : [];
          const todayLogIndex = updatedLogs.findIndex(log => new Date(log.date).toISOString().split('T')[0] === today);

          if (todayLogIndex !== -1) {
            updatedLogs[todayLogIndex] = { ...updatedLogs[todayLogIndex], value: newValue };
          } else {
            updatedLogs.push({ date: new Date(today), value: newValue });
          }

          return { ...h, logs: updatedLogs };
        }
        return h;
      }));

      const response = await fetch('/api/habits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId: habit.id, value: newValue, date: today }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log habit');
      }

      const updatedLog = await response.json();
      
      // Update state again with the server response (in case of any discrepancies)
      setHabits(prevHabits => prevHabits.map(h => {
        if (h.id === habit.id) {
          let updatedLogs = h.logs ? [...h.logs] : [];
          const todayLogIndex = updatedLogs.findIndex(log => new Date(log.date).toISOString().split('T')[0] === today);

          if (todayLogIndex !== -1) {
            updatedLogs[todayLogIndex] = { ...updatedLogs[todayLogIndex], value: updatedLog.value };
          } else {
            updatedLogs.push(updatedLog);
          }

          return { ...h, logs: updatedLogs };
        }
        return h;
      }));
    } catch (error) {
      console.error('Error logging habit:', error);
      alert(`Failed to log habit: ${error.message}`);
      // Revert the optimistic update in case of error
      fetchHabits();
    }
  };

  const { completedTasks, totalTasks, progressPercentage } = calculateOverallProgress();
  
  return (
    <main className="bg-var(--bg-color) text-var(--text-color) p-5 min-h-screen font-mono">
      <h1 className="text-3xl text-center mb-2 text-var(--main-color) font-bold">habits.</h1>
      <p className="text-center mb-4 text-var(--main-color) text-lg">{today}</p>
      
      {/* Overall Progress Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-center mb-2">
          <span className="text-lg font-medium">Progress: {completedTasks}/{totalTasks}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <ul className="max-w-md mx-auto mt-6 space-y-4">
        {habits.map((habit) => {
          const habitIcon = habit.type === 'habit' ? <FaCheck className={`${deleteMode ? 'text-white' : 'text-[var(--main-color)]'}`} /> :
                            habit.type === 'bad_habit' ? <FaTimes className={`${deleteMode ? 'text-white' : 'text-[var(--error-color)]'}`} /> :
                            <FaClock className={`${deleteMode ? 'text-white' : 'text-[var(--main-color)]'}`} />;
          
          return (
              <li
                key={habit.id}
                className={`p-4 rounded-lg shadow-md text-[var(--text-color)] habit-item cursor-pointer
                            ${deleteMode ? 'bg-red-500 hover:bg-red-600' : 'bg-white'}`}
                onClick={() => deleteMode ? deleteHabit(habit.id) : setSelectedHabit(habit)}
              >
              <div className="flex justify-between items-center">
                <span className={`text-lg font-semibold flex items-center ${deleteMode ? 'text-white' : ''}`}>
                  {habitIcon}
                  <span className="ml-2">{habit.name}</span>
                </span>
                {!deleteMode && getHabitInput(habit)}
              </div>
              {!deleteMode && (
                <div className="mt-2">
                  <span className="text-sm font-medium">{getHabitProgress(habit)}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
  
      <div className="max-w-md mx-auto flex justify-center items-center mt-6">
        {!deleteMode && (
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 bg-[var(--main-color)] text-white rounded-full shadow-md hover:bg-opacity-90 transition-colors duration-200 flex items-center"
          >
            <IoMdAdd className="mr-2" />
            Add Habit 
          </button>
        )}

        <button 
          onClick={() => setDeleteMode(!deleteMode)} 
          className={`px-4 py-2 ${deleteMode ? 'bg-[var(--error-color)]' : 'bg-[var(--main-color)]'} text-white rounded-full shadow-md hover:bg-opacity-90 transition-colors duration-200 ml-4 flex items-center`}
        >
          {deleteMode ? 'Done' : 'Delete'}
        </button>
      </div>

      {isModalOpen && (
        <AddHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddHabit={addHabit}
        />
      )}
      {selectedHabit && (
        <HabitStats
          habit={selectedHabit}
          onClose={() => setSelectedHabit(null)}
          updateHabit={updateHabit}
        />
      )}
      {showConfetti && (
        <Confetti 
          generationDuration={200} // Adjust this value as needed
        />
      )}
      
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md text-center relative">
            <button 
              onClick={() => setShowCongrats(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <IoMdClose size={24} />
            </button>
            <FaTrophy className="text-yellow-400 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">All done for today!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Congratulations! You've completed all your habits for today.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Enjoy and rest up - let's do this again tomorrow!
            </p>
            
            <button 
              onClick={triggerConfetti}
              className="px-4 py-2 bg-yellow-400 text-blue-600 rounded-full shadow-md hover:bg-yellow-300 transition-colors duration-200 flex items-center justify-center mx-auto"
              title="Celebrate again!">
                <FaCrown size={20} className="mr-2" />
              Celebrate!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}