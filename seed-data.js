const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
require('dotenv').config();

const generateLessons = (courseId, sectionId, unitId) => {
  const lessons = [];
  for (let i = 1; i <= 12; i++) {
    lessons.push({
      _id: new mongoose.Types.ObjectId(),
      title: `Lesson ${i}`,
      courseId,
      sectionId,
      unitId,
      description: `Complete lesson on topic ${i}`,
      sequenceNumber: i
    });
  }
  return lessons;
};

const generateUnits = (courseId, sectionId) => {
  const units = [];
  for (let i = 1; i <= 15; i++) {
    const lessons = generateLessons(courseId, sectionId, new mongoose.Types.ObjectId());
    units.push({
      _id: new mongoose.Types.ObjectId(),
      title: `Unit ${i}`,
      description: `Unit ${i} content`,
      lessons: lessons.map(l => ({ _id: l._id, title: l.title }))
    });
  }
  return units;
};

const generateSections = (courseId) => {
  const sections = [];
  for (let i = 1; i <= 6; i++) {
    const units = generateUnits(courseId, new mongoose.Types.ObjectId());
    sections.push({
      _id: new mongoose.Types.ObjectId(),
      title: `Section ${i}`,
      description: `Section ${i} content`,
      units: units
    });
  }
  return sections;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/math-learning-platform');
    console.log('Connected to MongoDB');

    await Course.deleteMany({});
    await Lesson.deleteMany({});

    const categories = [
      { name: 'Mathematics', icon: '📐', color: '#FF6B6B' },
      { name: 'Greek', icon: '🏛️', color: '#4ECDC4' },
      { name: 'Astrophysics', icon: '🔭', color: '#9D84B7' },
      { name: 'Coding', icon: '💻', color: '#FFE66D' },
      { name: 'Physics', icon: '⚛️', color: '#95E1D3' },
      { name: 'Chemistry', icon: '🧪', color: '#F38181' },
      { name: 'Biology', icon: '🔬', color: '#AA96DA' },
      { name: 'History', icon: '📜', color: '#FCBAD3' },
      { name: 'Literature', icon: '📚', color: '#A8D8EA' },
      { name: 'Philosophy', icon: '🤔', color: '#C7CEEA' }
    ];

    for (const category of categories) {
      const sections = generateSections(new mongoose.Types.ObjectId());
      const totalLessons = sections.reduce((sum, sec) => sum + sec.units.reduce((uSum, unit) => uSum + unit.lessons.length, 0), 0);

      const course = new Course({
        title: `${category.name} Mastery`,
        category: category.name,
        description: `Complete ${category.name} learning course with interactive lessons`,
        icon: category.icon,
        color: category.color,
        difficulty: 'Beginner',
        sections: sections,
        totalLessons: totalLessons,
        enrolledUsers: [],
        rating: 4.5,
        reviews: Math.floor(Math.random() * 1000),
        isPremium: false
      });

      await course.save();
      console.log(`Created course: ${category.name} with ${totalLessons} lessons`);

      for (const section of sections) {
        for (const unit of section.units) {
          for (const lesson of unit.lessons) {
            const questions = [];
            for (let i = 1; i <= 5; i++) {
              questions.push({
                _id: new mongoose.Types.ObjectId(),
                question: `Question ${i}: Sample question for this lesson`,
                type: 'multiple-choice',
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A',
                explanation: 'This is the correct answer because...',
                points: 20
              });
            }

            const newLesson = new Lesson({
              title: lesson.title,
              courseId: course._id,
              sectionId: section._id,
              unitId: unit._id,
              description: `Learn about ${lesson.title}`,
              content: `Complete content for ${lesson.title}`,
              difficulty: 'Easy',
              estimatedTime: 15,
              lessonType: 'interactive',
              questions: questions,
              pointsReward: 100,
              isPremium: false
            });

            await newLesson.save();
          }
        }
      }
    }

    console.log('Database seeding completed!');
    console.log('Created 10 courses with 1080 lessons each (10,800 total lessons)');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDatabase();