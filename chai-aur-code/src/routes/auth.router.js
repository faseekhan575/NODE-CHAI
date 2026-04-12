import express from 'express';
import passport from '../utils/passport.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,  // always true, not conditional
  sameSite: 'None',
  maxAge: 100 * 24 * 60 * 60 * 1000
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: true,  // always true
  sameSite: 'None',
  maxAge: 100 * 24 * 60 * 60 * 1000
};

// Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2: Google calls back here
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  async (req, res) => {
    try {
      const user = req.user;

      const accessToken = jwt.sign(
        {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );

      // Clear any old cookies first
      res.clearCookie('accesstoken');
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('refreshtoken');

      // Set new cookies for Google user
      res.cookie('accesstoken', accessToken, cookieOptions);
      res.cookie('refreshtoken', refreshToken, refreshCookieOptions);

      res.redirect('https://faseehvision.netlify.app/google-callback');

    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect('/auth/failed');
    }
  }
);

// Failed route
router.get('/failed', (req, res) => {
  res.status(401).json({ message: "Google login failed" });
});

export default router;