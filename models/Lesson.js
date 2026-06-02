const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  sectionId: mongoose.Schema.Types.ObjectId,
  unitId: mongoose.Schema.Types.ObjectId,
  description: String,
  content: {
    type: String,
    required: true
  },
  videoUrl: String,
  imageUrl: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  estimatedTime: Number,
  lessonType: {
    type: String,
    enum: ['video', 'interactive', 'quiz', 'reading', 'practice'],
    default: 'interactive'
  },
  questions: [{
    _id: mongoose.Schema.Types.ObjectId,
    question: String,
    type: { type: String, enum: ['multiple-choice', 'true-false', 'fill-in', 'essay'] },
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    points: { type: Number, default: 10 }
  }],
  practiceProblems: [{
    _id: mongoose.Schema.Types.ObjectId,
    problem: String,
    solution: String,
    difficulty: String,
    points: Number
  }],
  resources: [{
    title: String,
    url: String,
    type: String
  }],
  prerequisites: [mongoose.Schema.Types.ObjectId],
  pointsReward: {
    type: Number,
    default: 100
  },
  completionRate: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  sequenceNumber: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);