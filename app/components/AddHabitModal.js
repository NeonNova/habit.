import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import { MdCancel, MdClose } from 'react-icons/md';

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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const contentVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      x: -20, 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <MdClose size={24} />
            </motion.button>
            <motion.h2 
              className="text-2xl font-bold mb-6 text-[var(--main-color)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Add New Habit
            </motion.h2>
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <h3 className="text-lg mb-4 text-[var(--text-color)]">Select the type of habit you want to track:</h3>
                    <div className="space-y-4">
                      {[
                        { type: 'habit', icon: FaCheck, label: 'Habit', description: 'Build healthy habits' },
                        { type: 'bad_habit', icon: FaTimes, label: 'Bad Habit', description: 'Track unhealthy habits' },
                        { type: 'timed_habit', icon: FaClock, label: 'Timed Habit', description: 'Habits with a time goal' }
                      ].map((item, index) => (
                        <motion.button
                          key={item.type}
                          type="button"
                          onClick={() => { setType(item.type); setStep(2); }}
                          className="w-full p-4 bg-[var(--sub-color)] text-[var(--add-habit-text-color)] rounded-lg flex items-center justify-between hover:bg-opacity-90 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="flex items-center">
                            <item.icon className="mr-3" />
                            {item.label}
                          </span>
                          <span className="text-sm">{item.description}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Habit name"
                      className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                      required
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    />
                    {type === 'habit' && (
                      <motion.input
                        type="number"
                        value={timesPerDay}
                        onChange={(e) => setTimesPerDay(e.target.value)}
                        placeholder="Times per day"
                        className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                        required
                        min="1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                    {type === 'timed_habit' && (
                      <motion.input
                        type="number"
                        value={timeGoal}
                        onChange={(e) => setTimeGoal(e.target.value)}
                        placeholder="Time goal (minutes)"
                        className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                        required
                        min="1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                    {type === 'bad_habit' && (
                      <motion.input
                        type="number"
                        value={missesAllowed}
                        onChange={(e) => setMissesAllowed(e.target.value)}
                        placeholder="Misses allowed per day"
                        className="w-full p-3 mb-4 bg-gray-100 text-[var(--text-color)] rounded-lg border border-gray-300"
                        required
                        min="0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-4 py-2 bg-gray-300 text-[var(--text-color)] rounded-lg flex items-center hover:bg-gray-400"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdCancel className="mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        className="px-4 py-2 bg-[var(--main-color)] text-white rounded-lg flex items-center hover:bg-opacity-90"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IoMdAdd className="mr-2" />
                        Add Habit
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddHabitModal;