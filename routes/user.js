const express = require('express');
const User = require('../models/User');
const Progress = require('../models/Progress');
const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      mathPoints: user.mathPoints,
      level: user.calculateLevel(),
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalLessonsCompleted: user.totalLessonsCompleted,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture,
      bio: user.bio,
      preferences: user.preferences
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const { username, bio, profilePicture, preferences } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    user.updatedAt = new Date();
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progressData = await Progress.find({ userId });
    const completedCount = progressData.filter(p => p.status === 'completed').length;
    const totalAttempts = progressData.length;
    const averageScore = progressData.length > 0
      ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length
      : 0;

    res.json({
      mathPoints: user.mathPoints,
      level: user.calculateLevel(),
      totalLessonsCompleted: user.totalLessonsCompleted,
      totalLessonsAttempted: totalAttempts,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      averageScore: parseFloat(averageScore.toFixed(2)),
      completionRate: totalAttempts > 0 ? parseFloat(((completedCount / totalAttempts) * 100).toFixed(2)) : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:userId/unlock-premium', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isPremium = true;
    user.premiumExpiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    await user.save();

    res.json({ message: 'Premium unlocked', isPremium: user.isPremium });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;