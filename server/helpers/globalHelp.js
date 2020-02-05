/*
GLOBAL Routes Helper Functions | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


/* IMPORTS */
const { getUserById } = require('../queries/users.js'); // for checking if user exists after no results
const { authenticateUser } = require('../queries/authentication.js'); // for authentication


/* HELPERS */
const handleError = (err, req, res, next) => {
  if (res.headersSent) {
    console.log("err: res headers already exist. passing error to express");
    return next(err);
  }
  let [ code, msg ] = err.message.split('__');
  if (!msg) {
    msg = code;
  }
  if (code.length === 3 && !isNaN(code)) {
    code = parseInt(code);
    res.status(code);
  } else {
    msg = "error: " + msg;
    res.status(500);
  }
  console.log(code[0] === '4' ? "(front)" : "(back)", msg);
  res.json({
      status: "fail",
      message: msg,
      payload: null
  });
};

const getAuth = async (currUserId, password) => {
  try {
    return await authenticateUser(currUserId, password);
  } catch (err) {
    throw new Error(err.message === "No data returned from the query."
      ? "404__error: authentication failure"
      : "401__error: authentication failure"
    );
  }
}

const checkDoesUserExist = async (resultArray, userId) => {
  try {
    if (resultArray.length === 0) {
      const doesUserExist = await getUserById(userId);
      if (doesUserExist === 'no match') {
        throw new Error("400__error: user does not exist");
      }
    }
  } catch (err) {
    throw (err);
  }
}


module.exports = {
  handleError,
  getAuth,
  checkDoesUserExist
}
