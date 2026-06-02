const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  timeSpent: Number,
  completedAt: Date,
  attempts: {
    type: Number,
    default: 0
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    earnedPoints: Number
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

progressSchema.index({ userId: 1, courseId: 1 });
progressSchema.index({ userId: 1, lessonId: 1 });

module.exports = mongoose.model('Progress', progressSchema);