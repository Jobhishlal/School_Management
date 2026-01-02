import { IGetParentProfileUseCase } from "../../../domain/UseCaseInterface/Parent/IGetParentProfileUseCase";
import { ParentProfileDTO } from "../../dto/Parent/ParentProfileDTO";

import { ParentModel } from "../../../infrastructure/database/models/ParentsModel";
import { StudentModel } from "../../../infrastructure/database/models/StudentModel";
import { AddressModel } from "../../../infrastructure/database/models/AddressModel";
import { ClassModel } from "../../../infrastructure/database/models/ClassModel";
import { ParentSignupModel } from "../../../infrastructure/database/models/ParentSignupModel";

export class GetParentProfileUseCase implements IGetParentProfileUseCase {
    async execute(parentId: string): Promise<ParentProfileDTO> {

        console.log("🔹 Step 1: Fetch ParentSignup using token ID:", parentId);

        // 1️⃣ Find ParentSignup login record
        const parentSignup = await ParentSignupModel.findById(parentId);

        if (!parentSignup) {
            console.error("❌ ParentSignup not found for ID:", parentId);
            throw new Error("Parent account not found");
        }

        console.log("🔹 Found ParentSignup — linked Student ID:", parentSignup.student);

        // 2️⃣ Find Student mapped to this login
        const student = await StudentModel.findById(parentSignup.student);

        if (!student) {
            console.error("❌ Student not found for ID:", parentSignup.student);
            throw new Error("Linked Student record not found");
        }

        console.log("🔹 Found Student:", student.fullName);
        console.log("🔹 Student links to ParentModel ID:", student.parent);

        // 3️⃣ Try to fetch Parent Profile
        let parentProfile = null;

        if (student.parent) {
            parentProfile = await ParentModel.findById(student.parent);
        }

        if (!parentProfile) {
            console.warn("⚠ Parent profile missing — fallback to Signup data");
        }

        // 4️⃣ Fetch Address (optional)
        let address = null;
        if (student.address) {
            try {
                address = await AddressModel.findById(student.address);
            } catch (err) {
                console.error("⚠ Error fetching address:", err);
            }
        }

        // 5️⃣ Fetch Class Details (optional)
        let classDetails = undefined;

        if (student.classId) {
            try {
                const cls = await ClassModel.findById(student.classId);

                if (cls) {
                    classDetails = {
                        className: cls.className,
                        division: cls.division,
                    };
                }
            } catch (err) {
                console.error("⚠ Error fetching class:", err);
            }
        }

        // 6️⃣ Return formatted DTO (with fallback parent fields)
        return {
            parent: {
                id: parentProfile
                    ? (parentProfile._id as any).toString()
                    : parentSignup._id.toString(),

                name: parentProfile?.name || parentSignup.name || "Parent",

                email: parentProfile?.email || parentSignup.email,

                contactNumber: parentProfile?.contactNumber || "",

                whatsappNumber: parentProfile?.whatsappNumber || "",

                relationship: parentProfile?.relationship || "Parent",
            },

            student: {
                id: (student._id as any).toString(),
                fullName: student.fullName,
                studentId: student.studentId,
                dob: student.dateOfBirth,
                gender: student.gender,
                photo:
                    student.photos?.length > 0
                        ? student.photos[0].url
                        : undefined,
                classDetails,
            },

            address: address
                ? {
                      street: address.street,
                      city: address.city,
                      state: address.state,
                      pincode: address.pincode,
                  }
                : undefined,
        };
    }
}
