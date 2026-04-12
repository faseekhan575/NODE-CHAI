import express from 'express';
import passport from '../utils/passport.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

const router = express.Router();

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

      // Save refreshToken to tokens array just like normal login
      user.tokens = user.tokens ? [...user.tokens, refreshToken] : [refreshToken]
      await user.save()

      // Clear old cookies
      res.clearCookie('accesstoken')
      res.clearCookie('refreshtoken')

      // Set new cookies exactly like normal login
      res
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .redirect('https://faseehvision.netlify.app/google-callback')

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