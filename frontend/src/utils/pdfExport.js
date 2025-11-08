import jsPDF from 'jspdf';

export function exportToPDF(userData, plan) {
  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233); 
  doc.text('AI Fitness Coach Plan', 105, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Name: ${userData.name}`, 20, yPos);
  yPos += 7;
  doc.text(`Age: ${userData.age} | Gender: ${userData.gender}`, 20, yPos);
  yPos += 7;
  doc.text(`Height: ${userData.height} cm | Weight: ${userData.weight} kg`, 20, yPos);
  yPos += 7;
  doc.text(`Goal: ${userData.fitnessGoal} | Level: ${userData.fitnessLevel}`, 20, yPos);
  yPos += 10;

  doc.setFontSize(16);
  doc.setTextColor(14, 165, 233);
  doc.text('Workout Plan', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  if (plan.workoutPlan) {
    Object.keys(plan.workoutPlan).forEach((day, dayIndex) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(14, 165, 233);
      doc.text(`Day ${dayIndex + 1}`, 20, yPos);
      yPos += 7;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      const exercises = plan.workoutPlan[day]?.exercises || [];
      exercises.forEach((exercise) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`• ${exercise.name}`, 25, yPos);
        yPos += 5;
        doc.text(`  Sets: ${exercise.sets} | Reps: ${exercise.reps} | Rest: ${exercise.rest}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    });
  }

  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(14, 165, 233);
  doc.text('Diet Plan', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  if (plan.dietPlan) {
    Object.keys(plan.dietPlan).forEach((day, dayIndex) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(14, 165, 233);
      doc.text(`Day ${dayIndex + 1}`, 20, yPos);
      yPos += 7;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);

      const meals = plan.dietPlan[day];
      ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'].forEach((mealType) => {
        if (meals[mealType]) {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meals[mealType].meal}`, 25, yPos);
          yPos += 5;
          doc.text(`  Calories: ${meals[mealType].calories}`, 25, yPos);
          yPos += 5;
        }
      });
      yPos += 5;
    });
  }

  if (plan.tips && plan.tips.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(14, 165, 233);
    doc.text('Tips & Motivation', 20, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    plan.tips.forEach((tip) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`• ${tip}`, 25, yPos);
      yPos += 7;
    });
  }

  if (plan.motivation) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(14, 165, 233);
    doc.text('Daily Motivation', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const splitText = doc.splitTextToSize(plan.motivation, 170);
    doc.text(splitText, 20, yPos);
  }

  const fileName = `Fitness_Plan_${userData.name}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}