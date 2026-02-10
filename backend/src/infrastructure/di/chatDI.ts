import { ChatRepositoryMongo } from "../repositories/Chat/ChatRepositoryMongo";
import { MongoTeacher } from "../repositories/MongoTeacherRepo";
import { MongoStudentRepo } from "../repositories/MongoStudentRepo";
import { MongoClassRepository } from "../repositories/MongoClassRepo";
import { ChatSocketService } from "../services/ChatSocketService";
import { SendMessageUseCase } from "../../applications/useCases/Chat/SendMessageUseCase";
import { GetConversationsUseCase } from "../../applications/useCases/Chat/GetConversationsUseCase";
import { GetMessagesUseCase } from "../../applications/useCases/Chat/GetMessagesUseCase";
import { MarkMessagesReadUseCase } from "../../applications/useCases/Chat/MarkMessagesReadUseCase";
import { CreateClassGroupChatUseCase } from "../../applications/useCases/Chat/CreateClassGroupChatUseCase";
import { EditMessageUseCase } from "../../applications/useCases/Chat/EditMessageUseCase";
import { DeleteMessageUseCase } from "../../applications/useCases/Chat/DeleteMessageUseCase";
import { GetTeachersForChatUseCase } from "../../applications/useCases/Chat/GetTeachersForChatUseCase";
import { SearchChatUsersUseCase } from "../../applications/useCases/Chat/SearchChatUsersUseCase";
import { SchoolChatController } from "../../presentation/http/controllers/Chat/SchoolChatController";

// Repositories
const chatRepo = new ChatRepositoryMongo();
const teacherRepo = new MongoTeacher();
const studentRepo = new MongoStudentRepo();
const classRepo = new MongoClassRepository();
const chatSocketService = new ChatSocketService();

// Use Cases
const sendMessageUseCase = new SendMessageUseCase(chatRepo, chatSocketService);
const getConversationsUseCase = new GetConversationsUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const markMessagesReadUseCase = new MarkMessagesReadUseCase(chatRepo, chatSocketService);
const createClassGroupChatUseCase = new CreateClassGroupChatUseCase(chatRepo, classRepo, studentRepo, teacherRepo);
const editMessageUseCase = new EditMessageUseCase(chatRepo, chatSocketService);
const deleteMessageUseCase = new DeleteMessageUseCase(chatRepo, chatSocketService);
const getTeachersForChatUseCase = new GetTeachersForChatUseCase(teacherRepo);
const searchChatUsersUseCase = new SearchChatUsersUseCase(studentRepo, teacherRepo);

// Controller
export const chatController = new SchoolChatController(
    sendMessageUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    markMessagesReadUseCase,
    getTeachersForChatUseCase,
    createClassGroupChatUseCase,
    editMessageUseCase,
    deleteMessageUseCase,
    searchChatUsersUseCase
);
