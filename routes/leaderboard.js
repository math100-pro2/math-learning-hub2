const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;

    const leaderboard = await User.find()
      .sort({ mathPoints: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('username mathPoints level totalLessonsCompleted currentStreak profilePicture');

    const total = await User.countDocuments();

    const leaderboardWithRank = leaderboard.map((user, index) => ({
      rank: ((page - 1) * limit) + index + 1,
      username: user.username,
      mathPoints: user.mathPoints,
      level: user.level,
      totalLessonsCompleted: user.totalLessonsCompleted,
      currentStreak: user.currentStreak,
      profilePicture: user.profilePicture
    }));

    res.json({
      leaderboard: leaderboardWithRank,
      totalUsers: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/rank/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const usersAbove = await User.countDocuments({ mathPoints: { $gt: user.mathPoints } });
    const rank = usersAbove + 1;

    res.json({
      username: user.username,
      mathPoints: user.mathPoints,
      rank,
      level: user.level
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/streak/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const streakLeaderboard = await User.find()
      .sort({ currentStreak: -1 })
      .limit(limit * 1)
      .select('username currentStreak longestStreak profilePicture');

    const leaderboardWithRank = streakLeaderboard.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      profilePicture: user.profilePicture
    }));

    res.json({ leaderboard: leaderboardWithRank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;