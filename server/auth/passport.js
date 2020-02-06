const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { comparePasswords } = require('./helpers');
const usersQueries = require('../queries/users');

passport.use(new LocalStrategy({usernameField: 'email', passwordField : 'password'}, 
  async (username, password, done) => {
  try {
    const user = await usersQueries.getUserByEmail(username);
    if (!user) { // user not found in the database
      return done(null, false)
    }

    // const passMatch = await comparePasswords(password, user.user_password);
    // if (!passMatch) { // user found but passwords don't match
    if (password !== user.user_password) { // user found but passwords don't match
      return done(null, false)
    }

    delete user.user_password; 
    done(null, user);

  } catch (err) {
    done(err)
  }
}))

passport.serializeUser((user, done) => {
  console.log('serializeUser')
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  console.log('deserializeUser')
  try {
    let retrievedUser = await usersQueries.getUserByEmail(user.email)
    delete retrievedUser.password;
    done(null, retrievedUser)
  } catch (err) {
    done(err, false)
  }
})

module.exports = passport;