import { IGetParentProfileUseCase } from "../../../domain/UseCaseInterface/Parent/IGetParentProfileUseCase";
import { ParentProfileDTO } from "../../dto/Parent/ParentProfileDTO";
import { IParentProfileRepository } from "../../../domain/repositories/ParentProfile/IParentProfile";

export class GetParentProfileUseCase implements IGetParentProfileUseCase {
    constructor(private repo: IParentProfileRepository) { }

    async execute(parentId: string): Promise<ParentProfileDTO> {

        const signup = await this.repo.getParentSignupById(parentId);
        if (!signup) throw new Error("Parent account not found");

        const student = await this.repo.getStudentById(signup.student);
        if (!student) throw new Error("Student not found");

        const parent = student.parent
            ? await this.repo.getParentById(student.parent)
            : null;

        const address = student.address
            ? await this.repo.getAddressById(student.address)
            : null;

        const cls = student.classId
            ? await this.repo.getClassById(student.classId)
            : null;

        const data = {
            parent: {
                id: parent?._id?.toString() ?? signup._id.toString(),
                name: parent?.name ?? signup.name ?? "Parent",
                email: parent?.email ?? signup.email,
                contactNumber: parent?.contactNumber ?? "",
                whatsappNumber: parent?.whatsappNumber ?? "",
                relationship: parent?.relationship ?? "Parent",
            },
            student: {
                id: student._id.toString(),
                fullName: student.fullName,
                studentId: student.studentId ?? "N/A",
                dob: student.dateOfBirth ?? null,
                gender: student.gender ?? "N/A",
                photo: student.photos?.[0]?.url ?? "",
                classDetails: cls
                    ? { className: cls.className, division: cls.division }
                    : undefined,
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
        console.log("data", data)

        return data

    }
}
