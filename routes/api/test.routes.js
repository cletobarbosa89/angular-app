import express from 'express';
const testRouter = express.Router();
import testController from '../../controllers/test.controller.js';

// @route   GET api/v1/test/
// @desc    Test API route
// @access  Public
testRouter.get('/:brand', testController.test);

export default testRouter;