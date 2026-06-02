const express = require('express');
const Lesson = require('../models/Lesson');
const Progress = require('../models/Progress');
const User = require('../models/User');
const router = express.Router();

router.get('/course/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const lessons = await Lesson.find({ courseId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ sequenceNumber: 1 });

    const total = await Lesson.countDocuments({ courseId });

    res.json({
      lessons,
      totalLessons: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, difficulty } = req.query;
    const query = {};
    if (difficulty) query.difficulty = difficulty;

    const lessons = await Lesson.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lesson.countDocuments(query);

    res.json({
      lessons,
      totalLessons: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/difficulty/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const { courseId, page = 1, limit = 50 } = req.query;

    const query = { difficulty: level };
    if (courseId) query.courseId = courseId;

    const lessons = await Lesson.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Lesson.countDocuments(query);

    res.json({
      lessons,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:lessonId/submit', async (req, res) => {
  try {
    const { userId, courseId, answers } = req.body;
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    let score = 0;
    let earnedPoints = 0;
    const processedAnswers = [];

    answers.forEach((answer) => {
      const question = lesson.questions.find(q => q._id.toString() === answer.questionId);
      if (question) {
        const isCorrect = JSON.stringify(question.correctAnswer) === JSON.stringify(answer.userAnswer);
        if (isCorrect) {
          score += (question.points || 10);
          earnedPoints += (question.points || 10);
        }
        processedAnswers.push({
          questionId: question._id,
          userAnswer: answer.userAnswer,
          isCorrect,
          earnedPoints: isCorrect ? (question.points || 10) : 0
        });
      }
    });

    const totalPossiblePoints = lesson.questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const scorePercentage = totalPossiblePoints > 0 ? (score / totalPossiblePoints) * 100 : 0;

    let progress = await Progress.findOne({ userId, lessonId, courseId });
    if (!progress) {
      progress = new Progress({ userId, lessonId, courseId });
    }

    progress.status = scorePercentage >= 60 ? 'completed' : 'in-progress';
    progress.score = scorePercentage;
    progress.answers = processedAnswers;
    progress.attempts = (progress.attempts || 0) + 1;
    progress.completedAt = scorePercentage >= 60 ? new Date() : null;
    progress.lastAccessedAt = new Date();

    await progress.save();

    if (progress.status === 'completed') {
      const user = await User.findById(userId);
      user.mathPoints += lesson.pointsReward;
      user.totalLessonsCompleted += 1;
      user.level = user.calculateLevel();
      await user.save();
    }

    res.json({
      message: 'Lesson submitted successfully',
      score: scorePercentage,
      earnedPoints: earnedPoints,
      status: progress.status,
      completed: progress.status === 'completed'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:lessonId/progress/:userId', async (req, res) => {
  try {
    const { lessonId, userId } = req.params;
    const progress = await Progress.findOne({ userId, lessonId });

    if (!progress) {
      return res.json({
        status: 'not-started',
        score: 0,
        attempts: 0
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;