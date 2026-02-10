import express from "express";
import { chatController } from "../../infrastructure/di/chatDI";
import { authMiddleware } from "../../infrastructure/middleware/AuthMiddleWare";
import { upload } from "../../infrastructure/middleware/fileUploadService";

const router = express.Router();

router.get('/teachers', authMiddleware, chatController.getTeachersForStudent);
router.get('/conversations', authMiddleware, chatController.getConversations);
router.get('/history/:otherUserId', authMiddleware, chatController.getChatHistory);
router.post('/send', authMiddleware, chatController.sendMessage);
router.put('/read', authMiddleware, chatController.markAsRead);
router.put('/edit', authMiddleware, chatController.editMessage);
router.put('/delete', authMiddleware, (chatController as any).deleteMessage);
router.get('/search', authMiddleware, (chatController as any).searchUsers);
router.post('/upload', authMiddleware, upload.single('file'), chatController.uploadFile);
router.post('/group/create', authMiddleware, chatController.createClassGroup);

export default router;
