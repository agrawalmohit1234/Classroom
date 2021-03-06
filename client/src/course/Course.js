import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Edit from '@material-ui/icons/Edit';
import {makeStyles} from '@material-ui/core/styles';
import {read} from './api-course.js';
import {Link} from 'react-router-dom';
import auth from './../auth/auth-helper';

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: 'flex',
    marginBottom: 20,
  },
  card: {
    padding: '24px 40px 40px',
  },
  subheading: {
    margin: '10px',
    color: theme.palette.openTitle,
  },
  details: {
    margin: '16px',
  },
  sub: {
    display: 'block',
    margin: '3px 0px 5px 0px',
    fontSize: '0.9em',
  },
  media: {
    height: 190,
    display: 'inline-block',
    width: '100%',
    marginLeft: '16px',
  },
  category: {
    color: '#5c5c5c',
    fontSize: '0.9em',
    padding: '3px 5px',
    backgroundColor: '#dbdbdb',
    borderRadius: '0.2em',
    marginTop: 5,
  },
  action: {
    margin: '10px 0px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export default function Course({match}) {
  const classes = useStyles();
  const [course, setCourse] = useState({instructor: {}});
  const [values, setValues] = useState({
    error: '',
  });

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read({courseId: match.params.courseId}, signal).then((data) => {
      if (data.error) {
        setValues({...values, error: data.error});
      } else {
        setCourse(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.courseId]);

  const imageUrl = course._id
    ? `http://localhost:3000/api/courses/photo/${
        course._id
      }?${new Date().getTime()}`
    : 'http://localhost:3000/api/courses/defaultphoto';

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          title={course.name}
          subheader={
            <div>
              <Link
                to={'/user/' + course.instructor._id}
                className={classes.sub}
              >
                By {course.instructor.name}
              </Link>
              <span className={classes.category}>{course.category}</span>
            </div>
          }
          action={
            <React.Fragment>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id === course.instructor._id && (
                  <span className={classes.action}>
                    <Link to={'/teach/course/edit/' + course._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                  </span>
                )}
            </React.Fragment>
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={course.name}
          />
          <div className={classes.details}>
            <Typography variant="body1" className={classes.subheading}>
              {course.description}
              <br />
            </Typography>
          </div>
        </div>
      </Card>
    </div>
  );
}
