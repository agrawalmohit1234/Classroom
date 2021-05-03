const Course = require('../models/course.model');
const fs = require('fs');
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

module.exports = {create, listByInstructor};
