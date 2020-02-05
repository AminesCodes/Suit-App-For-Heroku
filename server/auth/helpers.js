const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12)
    return await bcrypt.hash(password, salt)
  } catch (err) {
    console.log('HASHING ERROR', err);
  }
}

const comparePasswords = async (password, passwordDigest) => {
  try {
    return await bcrypt.compare(password, passwordDigest) // TRUE if a match, FALSE if not
  } catch (err) {
    console.log('COMPARISON ERROR', err)
  }
}

const userLoggedCheck = (req, res, next) => {
  console.log(req.session)
  if (req.user) return next()
  res.status(401).json({
    payload: null,
    msg: "You need to be logged in to access this route",
    err: true
  })
}

module.exports = {
  hashPassword,
  comparePasswords,
  userLoggedCheck
}
