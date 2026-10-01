const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET && GITHUB_CALLBACK_URL) {
  passport.use(new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = getDb().collection('users');
        let user = await users.findOne({ githubId: profile.id });

        if (!user) {
          const result = await users.insertOne({
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName || profile.username,
            createdAt: new Date()
          });
          user = { _id: result.insertedId, githubId: profile.id, username: profile.username };
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
} else {

  console.warn(
    'GitHub OAuth is not configured (GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / ' +
    'GITHUB_CALLBACK_URL missing) — login routes will not work until these are set.'
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// The full user record is looked up fresh from the database on each request.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await getDb().collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
