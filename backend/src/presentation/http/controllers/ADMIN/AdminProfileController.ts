import { RESPONSE_MESSAGES } from "../../../../shared/constants/responseMessages";
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
    private _admingetUseCase: ISubAdminProfileGetUseCase,
    private _adminUpdateUseCase: ISubAdminProfileUpdateUseCase,
    private _requesetpasswordUseCase: IRequestPasswordOtpUseCase,
    private _udpatesubadminpassword: IUpdateSubAdminPasswordUseCase,
    private _iverifypasswordUseCase: IVerifySubAdminPasswordOtpUseCase
  ) { }
  async getProfile(req: AuthRequest, res: Response) {
    console.log("id get frst", req.user?.id)
    if (!req.user?.id) {

      return res.status(401).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
    }

    try {

      const profile = await this._admingetUseCase.execute(req.user.id);

      if (!profile) return res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.PROFILE_NOT_FOUND });

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

    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }



  async updateProfile(req: AuthRequest, res: Response) {


    if (!req.user?.id) {
      console.log("user id is here", req.user?.id)
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: RESPONSE_MESSAGES.UNAUTHORIZED });
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
      const updatedProfile = await this._adminUpdateUseCase.execute(req.user.id, updates);

      if (!updatedProfile) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: RESPONSE_MESSAGES.PROFILE_NOT_FOUND });
      }

      return res.status(StatusCodes.OK).json({ profile: updatedProfile });
    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }
  async RequestPasswor(req: AuthRequest, res: Response): Promise<void> {
    const { email } = req.body;
    console.log("get this page", email)
    if (!email) res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.EMAIL_IS_REQUIRED });

    try {
      const { otpToken } = await this._requesetpasswordUseCase.execute(email);
      console.log("danjkdbad", email)
      res.status(StatusCodes.OK).json({ otpToken });
    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }

  async verifypassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { otpToken, otp } = req.body;


      const result = await this._iverifypasswordUseCase.execute(otpToken, otp);



      res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.OTP_VERIFIED, email: result.email });
    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }
  async updatePassword(req: AuthRequest, res: Response) {
    console.log("Reached backend update-password route");

    const { newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId || !newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: RESPONSE_MESSAGES.USER_ID_AND_NEW_PASSWORD_REQUIRED });
    }

    validatePasswordUpdate(newPassword);

    try {
      const updatedUser = await this._udpatesubadminpassword.execute(userId, newPassword);
      console.log("Password updated for user:", userId);
      return res.status(StatusCodes.CREATED).json({ message: RESPONSE_MESSAGES.PASSWORD_UPDATED_SUCCESSFULLY, updatedUser });
    } catch (err: unknown) {
      console.error((err as Error).message);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: (err as Error).message || "Failed to create parent"
      });
    }
  }



}
