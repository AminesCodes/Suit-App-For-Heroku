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

const checkUserLogged = (req, res, next) => {
  if (req.user) return next()
  res.status(401).json({
    status: 'fail',
    message: "You need to be logged in to access this route",
    payload: null,
  })
}

module.exports = {
  hashPassword,
  comparePasswords,
  checkUserLogged
}
