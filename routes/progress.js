const express = require('express');
const Progress = require('../models/Progress');
const User = require('../models/User');
const router = express.Router();

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = await Progress.find({ userId });
    const completedLessons = progress.filter(p => p.status === 'completed').length;
    const inProgressLessons = progress.filter(p => p.status === 'in-progress').length;
    const averageScore = progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length
      : 0;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        mathPoints: user.mathPoints,
        level: user.calculateLevel(),
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalLessonsCompleted: user.totalLessonsCompleted
      },
      progress: {
        totalLessonsAttempted: progress.length,
        completedLessons,
        inProgressLessons,
        averageScore: parseFloat(averageScore.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/course/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    
    const progress = await Progress.find({ userId, courseId });
    const completed = progress.filter(p => p.status === 'completed').length;
    const avgScore = progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.score || 0), 0) / progress.length
      : 0;

    res.json({
      courseId,
      totalLessons: progress.length,
      completedLessons: completed,
      averageScore: parseFloat(avgScore.toFixed(2)),
      completionPercentage: progress.length > 0 ? parseFloat(((completed / progress.length) * 100).toFixed(2)) : 0,
      lessons: progress
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/streak/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const lastActivity = new Date(user.lastActivityDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isConsecutive = lastActivity.toDateString() === yesterday.toDateString() ||
                          lastActivity.toDateString() === today.toDateString();

    if (isConsecutive) {
      user.currentStreak += 1;
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
      }
    } else {
      user.currentStreak = 1;
    }

    user.lastActivityDate = today;
    await user.save();

    res.json({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;