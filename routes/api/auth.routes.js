import express from 'express';
const authRouter = express.Router();
import authController from '../../controllers/auth.controller.js';

// -- Brand -- //

// @route   GET api/v1/auth/
// @desc    Auth API route
// @access  Public
authRouter.get('/isAuthenticated', authController.isAuthenticated);

export default authRouter;