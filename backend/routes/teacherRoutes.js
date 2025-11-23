const express = require('express');
const router = express.Router();
const {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    assignChapter,
    getStudentAnalytics,
    addTeacherContent
} = require('../controllers/teacherController');
const { protect } = require('../middleware/auth');

// Middleware to check for teacher role
const teacherOnly = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        res.status(403).json({ message: 'Teacher access required' });
    }
};

router.use(protect, teacherOnly);

router.route('/student')
    .post(createStudent);

router.route('/students')
    .get(getStudents);

router.route('/student/:id')
    .put(updateStudent)
    .delete(deleteStudent);

router.route('/assign')
    .post(assignChapter);

router.route('/analytics/:studentId')
    .get(getStudentAnalytics);

router.route('/content')
    .post(addTeacherContent);

module.exports = router;
