
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { ParentModel } from "../src/infrastructure/database/models/ParentsModel";
import { StudentModel } from "../src/infrastructure/database/models/StudentModel";
import { AddressModel } from "../src/infrastructure/database/models/AddressModel";
import { ClassModel } from "../src/infrastructure/database/models/ClassModel";
import { ParentSignupModel } from "../src/infrastructure/database/models/ParentSignupModel";

dotenv.config();

const createData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to DB");

        // 1. Find a Class
        const cls = await ClassModel.findOne();
        if (!cls) throw new Error("No class found to assign student to.");
        console.log("Using class:", cls.className);

        // 2. Create Address
        const address = await AddressModel.create({
            street: "123 Test St",
            city: "Test City",
            state: "Test State",
            pincode: "123456"
        });
        console.log("Created Address:", address._id);

        // 3. Create Parent Profile
        const parent = await ParentModel.create({
            name: "Test Parent",
            contactNumber: "9999999999",
            whatsappNumber: "9999999999",
            email: "testparent@school.com",
            relationship: "Son"
        });
        console.log("Created Parent Profile:", parent._id);

        const studentId = "ST" + Math.floor(Date.now() / 1000);
        const student = await StudentModel.create({
            fullName: "Test Student",
            dateOfBirth: new Date("2010-01-01"),
            gender: "Male",
            studentId: studentId,
            parent: parent._id,
            address: address._id,
            classId: cls._id,
            Password: "hashed_student_pass_placeholder",
            role: "student"
        });
        console.log("Created Student:", student._id);

       
        const hashedPassword = await bcrypt.hash("password123", 10);
        const signup = await ParentSignupModel.create({
            email: "testparent@school.com",
            password: hashedPassword,
            student: student._id
        });
        console.log("Created Parent Signup:", signup.email);

        console.log("\nSUCCESS! Login with:");
        console.log("Email: testparent@school.com");
        console.log("Password: password123");

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

createData();
