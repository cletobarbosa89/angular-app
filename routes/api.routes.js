import express from 'express';
const apiRouter = express.Router();

import testRoute from './api/test.routes.js';
import brandRoute from './api/brand.routes.js';
import durationRoute from './api/duration.routes.js';
import authRoute from './api/auth.routes.js';


// API routes
apiRouter.use('/brand/', brandRoute);
apiRouter.use('/test/', testRoute);
apiRouter.use('/duration/', durationRoute);
apiRouter.use('/auth/', authRoute);


export default apiRouter;