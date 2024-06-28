import React from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaBullseye, FaTrophy } from 'react-icons/fa';
import LoginButton from './LoginButton';

const HeroSection = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-16 text-center"
      >
        <motion.h1 
          className="text-8xl font-bold text-[var(--main-color)]"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          habits.
        </motion.h1>
        
        <motion.p 
          className="text-xl text-[var(--sub-color)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Take control of your life, one habit at a time.
        </motion.p>
        
        <div className="space-y-6">
          {[
            { Icon: FaChartBar, text: 'Track your progress' },
            { Icon: FaBullseye, text: 'Set meaningful goals' },
            { Icon: FaTrophy, text: 'Build lasting habits' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + 0.2 * index, duration: 0.6 }}
              className="flex items-center justify-center space-x-4"
            >
              <feature.Icon className="text-2xl text-[var(--main-color)]" />
              <span className="text-[var(--text-color)] text-lg">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex justify-center"
        >
          <LoginButton className="py-3 px-6 border border-transparent text-lg font-medium rounded-full text-white bg-[var(--main-bg-color)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color)] transition-all duration-300 ease-in-out" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;