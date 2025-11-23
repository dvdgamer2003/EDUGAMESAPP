const express = require('express');
const router = express.Router();
const {
    createTeacher,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    getInstituteAnalytics,
    uploadContent,
    listContent
} = require('../controllers/instituteController');
const { protect } = require('../middleware/auth');

// Middleware to check for institute role
const instituteOnly = (req, res, next) => {
    if (req.user && req.user.role === 'institute') {
        next();
    } else {
        res.status(403).json({ message: 'Institute access required' });
    }
};

router.use(protect, instituteOnly);

router.route('/teacher')
    .post(createTeacher);

router.route('/teachers')
    .get(getTeachers);

router.route('/teacher/:id')
    .put(updateTeacher)
    .delete(deleteTeacher);

router.route('/analytics')
    .get(getInstituteAnalytics);

router.route('/content')
    .post(uploadContent)
    .get(listContent);

module.exports = router;
