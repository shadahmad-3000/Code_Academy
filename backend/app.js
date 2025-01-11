import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from "./routes/chat.routes.js";
import messagesRoutes from "./routes/messages.routes.js";
import usersRoutes from './routes/user.routes.js';
import coursesRoutes from './routes/course.routes.js';
import assignmentsRoutes from './routes/assignments.routes.js';
import authRoutes from './routes/auth.routes.js';
import contestRoutes from './routes/contest.routes.js';
import opportunitiesRoutes from './routes/opportunities.routes.js';
import { FRONTEND_URL } from './config.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors({
  credentials: true,
  origin: FRONTEND_URL,
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/contest', contestRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messagesRoutes);

if (process.env.NODE_ENV === 'production') {
  const path = await import('path');
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('client', 'dist', 'index.html'));
  });
}

export default app;