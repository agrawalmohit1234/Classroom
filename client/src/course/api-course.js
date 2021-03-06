const create = async (params, credentials, course) => {
  try {
    let response = await fetch(
      'http://localhost:3000/api/courses/by/' + params.userId,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
        body: course,
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByInstructor = async (params, credentials, signal) => {
  try {
    let response = await fetch(
      'http://localhost:3000/api/courses/by/' + params.userId,
      {
        method: 'GET',
        signal: signal,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + credentials.t,
        },
      }
    );
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, signal) => {
  try {
    let response = await fetch(
      'http://localhost:3000/api/courses/' + params.courseId,
      {
        method: 'GET',
        signal: signal,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export {create, listByInstructor, read};
