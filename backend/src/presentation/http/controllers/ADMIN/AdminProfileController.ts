import { Request, Response } from "express";
import { StatusCodes } from "../../../../shared/constants/statusCodes";
import { ISubAdminProfileGetUseCase } from "../../../../applications/interface/UseCaseInterface/ISubAdminProfile";
import { ISubAdminProfileUpdateUseCase } from "../../../../applications/interface/UseCaseInterface/ISubAdminUpdateUseCase";
import { AuthRequest } from "../../../../infrastructure/types/AuthRequest";
import { SubAdminEntities } from "../../../../domain/entities/SubAdmin";
import { IRequestPasswordOtpUseCase } from "../../../../applications/interface/UseCaseInterface/IPasswordUpdateUseCase";
import { IUpdateSubAdminPasswordUseCase } from "../../../../applications/interface/UseCaseInterface/IUpdateSubAdminPasswordUseCase";
import { IVerifySubAdminPasswordOtpUseCase } from '../../../../applications/interface/UseCaseInterface/IVerifySubAdminPasswordOtpUseCase'
import { validateSubAdminUpdate, validatePasswordUpdate } from '../../../validators/SubAdminValidation/SubAdminValidators';

export class AdminOwnProfileManagement {
  constructor(
    private admingetUseCase: ISubAdminProfileGetUseCase,
    private adminUpdateUseCase: ISubAdminProfileUpdateUseCase,
    private requesetpasswordUseCase: IRequestPasswordOtpUseCase,
    private udpatesubadminpassword: IUpdateSubAdminPasswordUseCase,
    private iverifypasswordUseCase: IVerifySubAdminPasswordOtpUseCase
  ) { }
  async getProfile(req: AuthRequest, res: Response) {
    console.log("id get frst", req.user?.id)
    if (!req.user?.id) {

      return res.status(401).json({ message: "Unauthorized" });
    }

    try {

      const profile = await this.admingetUseCase.execute(req.user.id);

      if (!profile) return res.status(StatusCodes.NOT_FOUND).json({ message: "Profile not found" });

      const profileResponse = {
        ...profile,
        address: profile.address && typeof profile.address !== "string"
          ? {
            _id: profile.address._id.toString(),
            street: profile.address.street,
            city: profile.address.city,
            state: profile.address.state,
            pincode: profile.address.pincode,
          }
          : undefined,
      };

      return res.status(StatusCodes.OK).json({ profile: profileResponse });

    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
    }
  }



  async updateProfile(req: AuthRequest, res: Response) {


    if (!req.user?.id) {
      console.log("user id is here", req.user?.id)
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
    }


    const files = req.files as {
      photo?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    };

    const safeAddressId =
      req.body.addressId && req.body.addressId !== "undefined" ? req.body.addressId : undefined;

    const updates: Partial<SubAdminEntities> = {
      name: req.body.name || undefined,
      email: req.body.email || undefined,
      phone: req.body.phone || undefined,
      gender: req.body.gender || undefined,
      dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
      address: safeAddressId,
      photo: files?.photo?.map(f => ({
        url: f.path,
        filename: f.originalname,
        uploadedAt: new Date(),
      })) ?? [],
      documents: files?.documents?.map(f => ({
        url: f.path,
        filename: f.originalname,
        uploadedAt: new Date(),
      })) ?? [],
    };

    validateSubAdminUpdate(updates);





    try {
      const updatedProfile = await this.adminUpdateUseCase.execute(req.user.id, updates);

      if (!updatedProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Profile not found" });
      }

      return res.status(StatusCodes.OK).json({ profile: updatedProfile });
    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
    }
  }
  async RequestPasswor(req: AuthRequest, res: Response): Promise<void> {
    const { email } = req.body;
    console.log("get this page", email)
    if (!email) res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });

    try {
      const { otpToken } = await this.requesetpasswordUseCase.execute(email);
      console.log("danjkdbad", email)
      res.status(StatusCodes.OK).json({ otpToken });
    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
    }
  }

  async verifypassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { otpToken, otp } = req.body;


      const result = await this.iverifypasswordUseCase.execute(otpToken, otp);



      res.status(StatusCodes.CREATED).json({ message: "OTP verified", email: result.email });
    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
    }
  }
  async updatePassword(req: AuthRequest, res: Response) {
    console.log("Reached backend update-password route");

    const { newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User ID and new password required" });
    }

    validatePasswordUpdate(newPassword);

    try {
      const updatedUser = await this.udpatesubadminpassword.execute(userId, newPassword);
      console.log("Password updated for user:", userId);
      return res.status(StatusCodes.CREATED).json({ message: "Password updated successfully", updatedUser });
    } catch (err: any) {
      console.error(err.message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: err.message || "Failed to create parent"
      });
    }
  }



}
