import React, { useState } from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

const AddHabitModal = ({ isOpen, onClose, onAddHabit }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [timeGoal, setTimeGoal] = useState(0);
  const [missesAllowed, setMissesAllowed] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHabit = {
      name,
      type,
      target: type === 'habit' ? parseInt(timesPerDay) : 
              (type === 'timed_habit' ? parseInt(timeGoal) : 
              (type === 'bad_habit' ? parseInt(missesAllowed) : 1)),
    };
    onAddHabit(newHabit);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setType('');
    setName('');
    setTimesPerDay(1);
    setTimeGoal(0);
    setMissesAllowed(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[var(--main-color)]">Add New Habit</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h3 className="text-lg mb-4 text-[var(--text-color)]">Select the type of habit you want to track:</h3>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => { setType('habit'); setStep(2); }}
                  className="w-full p-4 bg-[var(--sub-color)] text-[var(--add-habit-text-color)] rounded-lg flex items-center justify-between hover:bg-opacity-90 transition-colors"
                >
                  <span className="flex items-center">
                    <FaCheck className="mr-3" />
                    Habit
                  </span>
                  <span className="text-sm">Build healthy habits</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setType('bad_habit'); setStep(2); }}
                  className="w-full p-4 bg-[var(--sub-color)] text-[var(--add-habit-text-color)] rounded-lg flex items-center justify-between hover:bg-opacity-90 transition-colors"
                >
                  <span className="flex items-center">
                    <FaTimes className="mr-3" />
                    Bad Habit
                  </span>
                  <span className="text-sm">Track unhealthy habits</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setType('timed_habit'); setStep(2); }}
                  className="w-full p-4 bg-[var(--sub-color)] text-[var(--add-habit-text-color)] rounded-lg flex items-center justify-between hover:bg-opacity-90 transition-colors"
                >
                  <span className="flex items-center">
                    <FaClock className="mr-3" />
                    Timed Habit
                  </span>
                  <span className="text-sm">Habits with a time goal</span>
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Habit name"
                className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                required
              />
              {type === 'habit' && (
                <input
                  type="number"
                  value={timesPerDay}
                  onChange={(e) => setTimesPerDay(e.target.value)}
                  placeholder="Times per day"
                  className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                  required
                  min="1"
                />
              )}
              {type === 'timed_habit' && (
                <input
                  type="number"
                  value={timeGoal}
                  onChange={(e) => setTimeGoal(e.target.value)}
                  placeholder="Time goal (minutes)"
                  className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                  required
                  min="1"
                />
              )}
              {type === 'bad_habit' && (
                <input
                  type="number"
                  value={missesAllowed}
                  onChange={(e) => setMissesAllowed(e.target.value)}
                  placeholder="Misses allowed per day"
                  className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                  required
                  min="0"
                />
              )}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-300 text-[var(--text-color)] rounded-lg flex items-center hover:bg-gray-400"
                >
                  <MdCancel className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[var(--main-color)] text-white rounded-lg flex items-center hover:bg-opacity-90"
                >
                  <IoMdAdd className="mr-2" />
                  Add Habit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;