import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  userId: String,
  userData: {
    name: String,
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    fitnessGoal: String,
    fitnessLevel: String,
    workoutLocation: String,
    dietaryPreferences: String,
    medicalHistory: String,
    stressLevel: String
  },
  plan: {
    workoutPlan: Object,
    dietPlan: Object,
    tips: Array,
    motivation: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Plan = mongoose.models.Plan || mongoose.model('Plan', planSchema);

export async function savePlan(planData) {
  try {
    const plan = new Plan(planData);
    await plan.save();
    return plan;
  } catch (error) {
    console.error('Error saving plan:', error);
    throw new Error('Failed to save plan');
  }
}

export async function getPlans(userId = null) {
  try {
    const query = userId ? { userId } : {};
    const plans = await Plan.find(query).sort({ createdAt: -1 });
    return plans;
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw new Error('Failed to fetch plans');
  }
}

export async function getPlanById(id) {
  try {
    const plan = await Plan.findById(id);
    if (!plan) {
      throw new Error('Plan not found');
    }
    return plan;
  } catch (error) {
    console.error('Error fetching plan:', error);
    throw new Error('Failed to fetch plan');
  }
}

