import express from 'express';
const durationRouter = express.Router();
import durationController from '../../controllers/duration.controller.js';

// @route   GET api/v1/duration/
// @desc    Test API route
// @access  Public
durationRouter.get('/', durationController.duration);


export default durationRouter;