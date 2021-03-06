const Course = require('../models/course.model');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const errorHandler = require('./../helpers/dbErrorHandler');

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({error: 'Image could not be uploaded'});
    }
    let course = new Course(fields);
    course.instructor = req.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({error: errorHandler.getErrorMessage(err)});
    }
  });
};

const listByInstructor = (req, res) => {
  Course.find({instructor: req.profile._id}, (err, courses) => {
    if (err) {
      return res.status(400).json({
        eroor: errorHandler.getErrorMessage(err),
      });
    }
    res.json(courses);
  }).populate('instructor', '_id name');
};

const read = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate('instructor', '_id name');
    if (!course)
      return res.status('400').json({
        error: 'Course not found',
      });
    req.course = course;
    next();
  } catch (err) {
    return res.status('400').json({
      error: 'Could not retrieve course',
    });
  }
};

const photo = (req, res, next) => {
  if (req.course.image.data) {
    res.set('Content-Type', req.course.image.contentType);
    return res.send(req.course.image.data);
  }
  next();
};
const defaultPhoto = (req, res) => {
  return res.sendFile(
    path.join(__dirname, './../../assets/images/default.png')
  );
};

module.exports = {
  create,
  listByInstructor,
  read,
  courseByID,
  photo,
  defaultPhoto,
};
