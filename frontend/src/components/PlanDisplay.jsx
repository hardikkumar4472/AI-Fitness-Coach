import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Image as ImageIcon, Calendar, Utensils, Dumbbell, Lightbulb, Heart, Smartphone } from 'lucide-react';

const PlanDisplay = ({ userData, plan, onImageClick, onTextToSpeech, darkMode }) => {
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedDay, setSelectedDay] = useState('day1');

  const days = ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'];

  const handleReadPlan = (section) => {
    let text = '';
    if (section === 'workout' && plan.workoutPlan) {
      const dayPlan = plan.workoutPlan[selectedDay];
      if (dayPlan && dayPlan.exercises) {
        text = `Day ${selectedDay.replace('day', '')} Workout Plan. `;
        dayPlan.exercises.forEach((ex, idx) => {
          text += `Exercise ${idx + 1}: ${ex.name}. ${ex.sets} sets of ${ex.reps} reps. Rest ${ex.rest} between sets. `;
        });
      }
    } else if (section === 'diet' && plan.dietPlan) {
      const dayPlan = plan.dietPlan[selectedDay];
      if (dayPlan) {
        text = `Day ${selectedDay.replace('day', '')} Diet Plan. `;
        ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].forEach((meal) => {
          if (dayPlan[meal]) {
            text += `${meal}: ${dayPlan[meal].meal}. ${dayPlan[meal].calories} calories. `;
            if (meal.protein) text += `Protein: ${meal.protein}. `;
            if (meal.carbs) text += `Carbs: ${meal.carbs}. `;
            if (meal.fats) text += `Fats: ${meal.fats}. `;
          }
        });
      }
    } else if (section === 'motivation' && plan.motivation) {
      text = `Motivational message: ${plan.motivation}`;
    } else if (section === 'tips' && plan.tips) {
      text = `Lifestyle tips: ${plan.tips.join('. ')}`;
    }

    if (text) {
      onTextToSpeech(text, section);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome, {userData.name}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your personalized {userData.fitnessGoal} plan is ready
            </p>
          </div>
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{userData.age} years</span>
            <span>•</span>
            <span>{userData.height} cm</span>
            <span>•</span>
            <span>{userData.weight} kg</span>
          </div>
        </div>

        {}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Voice Feature:</span>
            <span className="text-sm">Click "Read Plan" to hear your workout and diet instructions using browser text-to-speech</span>
          </div>
        </div>
      </motion.div>

      {}
      <div className="flex gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 border border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('workout')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'workout'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Dumbbell className="w-5 h-5" />
          Workout Plan
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('diet')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'diet'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Utensils className="w-5 h-5" />
          Diet Plan
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'tips'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <Lightbulb className="w-5 h-5" />
          Tips & Motivation
        </motion.button>
      </div>

      {}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {days.map((day, idx) => (
          <motion.button
            key={day}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Day {idx + 1}
          </motion.button>
        ))}
      </div>

      {}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {activeTab === 'workout' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-primary-600" />
                Day {selectedDay.replace('day', '')} Workout
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReadPlan('workout')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Read Plan
              </motion.button>
            </div>

            {plan.workoutPlan && plan.workoutPlan[selectedDay]?.exercises ? (
              <div className="space-y-4">
                {plan.workoutPlan[selectedDay].exercises.map((exercise, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-primary-200 dark:border-gray-600 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {exercise.name}
                        </h4>
                        {exercise.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {exercise.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                            Sets: {exercise.sets}
                          </span>
                          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                            Reps: {exercise.reps}
                          </span>
                          <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                            Rest: {exercise.rest}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onImageClick(exercise, 'exercise')}
                        className="ml-4 p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        title="Generate Image"
                      >
                        <ImageIcon className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No workout data available for this day.
              </p>
            )}
          </div>
        )}

        {activeTab === 'diet' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-6 h-6 text-primary-600" />
                Day {selectedDay.replace('day', '')} Diet
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReadPlan('diet')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Read Plan
              </motion.button>
            </div>

            {plan.dietPlan && plan.dietPlan[selectedDay] ? (
              <div className="space-y-4">
                {['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].map((mealType) => {
                  const meal = plan.dietPlan[selectedDay][mealType];
                  if (!meal) return null;

                  return (
                    <motion.div
                      key={mealType}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-xl border border-green-200 dark:border-gray-600 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                            {mealType === 'snack1' ? 'Morning Snack' : mealType === 'snack2' ? 'Evening Snack' : mealType}
                          </h4>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                            {meal.meal}
                          </p>
                          {meal.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {meal.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                              {meal.calories} cal
                            </span>
                            {meal.protein && (
                              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                                Protein: {meal.protein}
                              </span>
                            )}
                            {meal.carbs && (
                              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                                Carbs: {meal.carbs}
                              </span>
                            )}
                            {meal.fats && (
                              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white">
                                Fats: {meal.fats}
                              </span>
                            )}
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onImageClick(meal, 'meal')}
                          className="ml-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Generate Image"
                        >
                          <ImageIcon className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No diet data available for this day.
              </p>
            )}
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary-600" />
                Tips & Motivation
              </h3>
              <div className="flex gap-2">
                {plan.tips && plan.tips.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReadPlan('tips')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read Tips
                  </motion.button>
                )}
                {plan.motivation && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReadPlan('motivation')}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read Motivation
                  </motion.button>
                )}
              </div>
            </div>

            {plan.tips && plan.tips.length > 0 && (
              <div className="space-y-4 mb-8">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Lifestyle Tips
                </h4>
                {plan.tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg"
                  >
                    <p className="text-gray-800 dark:text-gray-200">{tip}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {plan.motivation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl text-white"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Daily Motivation</h4>
                    <p className="text-lg">{plan.motivation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PlanDisplay;