const router = require('express').Router();
const passport = require('../auth/passport');

// Kicks off the GitHub OAuth flow. Visiting this in a browser redirects to
// GitHub's own login/consent screen.
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub redirects back here after the user approves (or denies) access.
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  (req, res) => {
    res.redirect('/auth/success');
  }
);

router.get('/success', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.status(200).json({
    message: 'Logged in successfully',
    user: { username: req.user.username, displayName: req.user.displayName }
  });
});

router.get('/failure', (req, res) => {
  res.status(401).json({ message: 'GitHub authentication failed' });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Lets the frontend (or you, while testing) check current login state.
router.get('/status', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      loggedIn: true,
      user: { username: req.user.username, displayName: req.user.displayName }
    });
  }
  res.status(200).json({ loggedIn: false });
});

module.exports = router;
