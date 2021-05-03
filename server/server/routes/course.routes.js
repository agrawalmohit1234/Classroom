const express = require('express');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const courseCtrl = require('../controllers/course.controller');
const router = express.Router();

router
  .route('/api/courses/by/:userId')
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isEducator,
    courseCtrl.create
  )
  .get(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    courseCtrl.listByInstructor
  );

router
  .route('/api/courses/photo/:courseId')
  .get(courseCtrl.photo, courseCtrl.defaultPhoto);

router.route('/api/courses/defaultphoto').get(courseCtrl.defaultPhoto);

router.route('/api/courses/:courseId').get(courseCtrl.read);

router.param('courseId', courseCtrl.courseByID);
router.param('userId', userCtrl.userByID);

module.exports = router;
