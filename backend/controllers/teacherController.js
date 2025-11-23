const User = require('../models/User');
const TeacherContent = require('../models/TeacherContent');
const QuizResult = require('../models/QuizResult');
const Chapter = require('../models/Chapter');

// @desc    Create a student account
// @route   POST /api/teacher/student
// @access  Private/Teacher
const createStudent = async (req, res) => {
    try {
        const { name, email, password, grade } = req.body;
        const teacherId = req.user._id;
        const instituteId = req.user.instituteId;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const student = await User.create({
            name,
            email,
            password,
            role: 'student',
            teacherId,
            instituteId,
            selectedClass: grade,
            status: 'active'
        });

        res.status(201).json({
            _id: student._id,
            name: student.name,
            email: student.email,
            grade: student.selectedClass,
            status: student.status
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students for the teacher
// @route   GET /api/teacher/students
// @access  Private/Teacher
const getStudents = async (req, res) => {
    try {
        const teacherId = req.user._id;
        const students = await User.find({ role: 'student', teacherId }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/teacher/student/:id
// @access  Private/Teacher
const updateStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (student && student.teacherId.toString() === req.user._id.toString()) {
            student.name = req.body.name || student.name;
            student.email = req.body.email || student.email;
            student.selectedClass = req.body.grade || student.selectedClass;
            student.status = req.body.status || student.status;

            if (req.body.password) {
                student.password = req.body.password;
            }

            const updatedStudent = await student.save();
            res.json({
                _id: updatedStudent._id,
                name: updatedStudent.name,
                email: updatedStudent.email,
                grade: updatedStudent.selectedClass,
                status: updatedStudent.status
            });
        } else {
            res.status(404).json({ message: 'Student not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/teacher/student/:id
// @access  Private/Teacher
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.id);

        if (student && student.teacherId.toString() === req.user._id.toString()) {
            await student.deleteOne();
            res.json({ message: 'Student removed' });
        } else {
            res.status(404).json({ message: 'Student not found or not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign chapter to student(s)
// @route   POST /api/teacher/assign
// @access  Private/Teacher
const assignChapter = async (req, res) => {
    try {
        const { studentIds, chapterId } = req.body;

        // Verify chapter exists
        const chapter = await Chapter.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: 'Chapter not found' });
        }

        // Update multiple students
        await User.updateMany(
            { _id: { $in: studentIds }, teacherId: req.user._id },
            {
                $addToSet: {
                    assignments: {
                        chapterId,
                        assignedAt: new Date(),
                        status: 'pending'
                    }
                }
            }
        );

        res.json({ message: 'Chapter assigned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get student analytics
// @route   GET /api/teacher/analytics/:studentId
// @access  Private/Teacher
const getStudentAnalytics = async (req, res) => {
    try {
        const student = await User.findById(req.params.studentId);

        if (!student || student.teacherId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Student not found or not authorized' });
        }

        // Quiz History
        const quizResults = await QuizResult.find({ userId: student._id }).sort({ date: -1 });

        // Weak Topics (simplified: topics with score < 60%)
        // Assuming we can derive topics from quiz results or another way. 
        // For now, let's just list quizzes with low scores.
        const weakAreas = quizResults
            .filter(q => (q.score / q.totalQuestions) < 0.6)
            .map(q => q.quizId); // Ideally map to topic name

        // Completed Lessons (from assignments or progress)
        // Using assignments for now
        const completedLessons = student.assignments ? student.assignments.filter(a => a.status === 'completed').length : 0;

        // Performance Trend (last 5 quiz scores)
        const performanceTrend = quizResults.slice(0, 5).map(q => ({
            date: q.date,
            score: (q.score / q.totalQuestions) * 100
        }));

        res.json({
            xp: student.xp,
            streak: student.streak,
            completedLessons,
            quizHistory: quizResults,
            weakAreas,
            performanceTrend
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add teacher content
// @route   POST /api/teacher/content
// @access  Private/Teacher
const addTeacherContent = async (req, res) => {
    try {
        const { classNumber, subject, chapter, contentType, body } = req.body;

        const content = await TeacherContent.create({
            teacherId: req.user._id,
            classNumber,
            subject,
            chapter,
            contentType,
            body
        });

        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    assignChapter,
    getStudentAnalytics,
    addTeacherContent
};
