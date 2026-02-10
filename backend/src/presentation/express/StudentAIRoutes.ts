import { Router } from "express";
import { aiController } from "../../infrastructure/di/studentAIDI";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";

const studentAIRouter = Router();

studentAIRouter.post('/ask', authMiddleware, (req, res) => aiController.askDoubt(req, res));
studentAIRouter.get('/history', authMiddleware, (req, res) => aiController.getHistory(req, res));
studentAIRouter.get('/session/:id', authMiddleware, (req, res) => aiController.getSession(req, res));
studentAIRouter.delete('/session/:id', authMiddleware, (req, res) => aiController.deleteSession(req, res));

export default studentAIRouter;
