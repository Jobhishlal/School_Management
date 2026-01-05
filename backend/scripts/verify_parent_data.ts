
import mongoose from "mongoose";
import dotenv from "dotenv";
import { StudentModel } from "../src/infrastructure/database/models/StudentModel";

dotenv.config();


const getClassId = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        const cls = await import("../src/infrastructure/database/models/ClassModel").then(m => m.ClassModel.findOne());
        if (cls) {
            console.log("VALID_CLASS_ID:", (cls._id as any).toString());
        } else {
            console.log("NO_CLASSES_FOUND");
        }
    } catch (e) { console.error(e); }
    finally { mongoose.disconnect(); }
}
getClassId();
