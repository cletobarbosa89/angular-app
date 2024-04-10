import express from 'express';
import morgan from 'morgan';
// import helmet from 'helmet';
import cors from 'cors';
// import rateLimit from 'express-rate-limit';
import api from './routes/api.routes.js';

const app = express();
const port = process.env.PORT || 8080;

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });

// Middlewares
app.use(morgan("common"));
// app.use(helmet());
app.use(cors());
// app.use('/api/v1/', limiter); //  apply to all requests

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(process.cwd()+"/client/dist/canvas/"));

// Node api routes
app.use('/api/v1/', api);

app.get('/api/v1/*', (req, res) => {
    res.status(404).json({
        code: res.statusCode,
        message: "API URL does not exists."
    });
})

// Angular app route
app.get('/*', (req, res) => {
    res.sendFile(process.cwd()+"/client/dist/canvas/index.html");
});

app.all('*', (req, res) => {
    console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
    res.status(200).sendFile(process.cwd()+"/client/dist/canvas/index.html");
});

app.listen(port, () => console.log(`Server running on port ${port}`));