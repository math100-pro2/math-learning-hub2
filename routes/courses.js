const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const courses = await Course.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id/structure', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({
      id: course._id,
      title: course.title,
      category: course.category,
      sections: course.sections,
      totalLessons: course.totalLessons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/enroll', async (req, res) => {
  try {
    const { userId } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const alreadyEnrolled = course.enrolledUsers.some(e => e.userId.toString() === userId);
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledUsers.push({ userId, enrolledAt: new Date() });
    await course.save();

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;