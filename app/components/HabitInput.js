import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const HabitInput = ({ habit, onLogHabit, disabled }) => {
  const [localValue, setLocalValue] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = habit.logs?.filter(log => 
      new Date(log.date).toISOString().split('T')[0] === today
    ) || [];
    const completions = todayLogs.reduce((sum, log) => sum + (log.value || 0), 0);
    setLocalValue(completions);
  }, [habit]);

  const debouncedLogHabit = useCallback(
    debounce((newValue) => {
      onLogHabit(habit, newValue - localValue);
    }, 300),
    [habit, localValue, onLogHabit]
  );

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    debouncedLogHabit(newValue);
  };

  switch (habit.type) {
    case 'habit':
      return (
        <>
          <button 
            onClick={() => onLogHabit(habit, -1)}
            className={`px-2 py-1 rounded bg-[var(--main-bg-color)] text-[var(--sub-color)] ${localValue > 0 ? '' : 'invisible'}`}
            disabled={disabled || localValue === 0}
          >
            Undo
          </button>
          <button 
            onClick={() => onLogHabit(habit, 1)}
            className="px-2 py-1 rounded bg-[var(--main-bg-color)] text-[var(--sub-color)] ml-2"
            disabled={disabled || localValue >= habit.timesPerDay}
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
          value={localValue}
          onChange={handleChange}
          disabled={disabled}
          className="w-full cursor-pointer"
        />
      );
    case 'bad_habit':
      return (
        <>
          <button 
            onClick={() => onLogHabit(habit, -1)}
            className={`px-2 py-1 rounded bg-[var(--main-bg-color)] text-[var(--sub-color)] ${localValue > 0 ? '' : 'invisible'}`}
            disabled={disabled || localValue === 0}
          >
            Undo
          </button>
          <button 
            onClick={() => onLogHabit(habit, 1)}
            className="px-2 py-1 rounded bg-red-500 text-white ml-2"
            disabled={disabled}
          >
            Occurred
          </button>
        </>
      );
    default:
      return null;
  }
};

export default HabitInput;