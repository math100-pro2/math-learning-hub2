const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Mathematics', 'Greek', 'Astrophysics', 'Coding', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'Philosophy'],
    required: true
  },
  description: String,
  icon: String,
  color: String,
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  sections: [{
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    units: [{
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      description: String,
      lessons: [{
        _id: mongoose.Schema.Types.ObjectId,
        title: String
      }]
    }]
  }],
  totalLessons: Number,
  enrolledUsers: [{
    userId: mongoose.Schema.Types.ObjectId,
    enrolledAt: Date
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: Number,
  isPremium: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Course', courseSchema);