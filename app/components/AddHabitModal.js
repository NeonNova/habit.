import React, { useState } from 'react';

export default function AddHabitModal({ isOpen, onClose, onAddHabit }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#e8e9ec] p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4 text-[#33374c]">Add New Habit</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h3 className="mb-2">Select Habit Type</h3>
              <div className="flex justify-between mb-4">
                <button type="button" onClick={() => { setType('habit'); setStep(2); }} className="px-4 py-2 bg-[#2d539e] text-white rounded">Habit</button>
                <button type="button" onClick={() => { setType('bad_habit'); setStep(2); }} className="px-4 py-2 bg-[#cc517a] text-white rounded">Bad Habit</button>
                <button type="button" onClick={() => { setType('timed_habit'); setStep(2); }} className="px-4 py-2 bg-[#adb1c4] text-[#33374c] rounded">Timed Habit</button>
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
                className="w-full p-2 mb-2 bg-[#adb1c4] text-[#33374c] rounded"
                required
              />
              {type === 'habit' && (
                <input
                  type="number"
                  value={timesPerDay}
                  onChange={(e) => setTimesPerDay(e.target.value)}
                  placeholder="Times per day"
                  className="w-full p-2 mb-2 bg-[#adb1c4] text-[#33374c] rounded"
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
                  className="w-full p-2 mb-2 bg-[#adb1c4] text-[#33374c] rounded"
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
                  className="w-full p-2 mb-2 bg-[#adb1c4] text-[#33374c] rounded"
                  required
                  min="0"
                />
              )}
              <div className="flex justify-end">
                <button type="button" onClick={() => setStep(1)} className="mr-2 px-4 py-2 bg-[#cc517a] text-white rounded">Back</button>
                <button type="submit" className="px-4 py-2 bg-[#2d539e] text-white rounded">Add Habit</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
