// domain/entities/SubAdmin.ts
import { AdminRole } from "../enums/AdminRole";

export interface AddressValue {
  _id: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export class SubAdminEntities {
  constructor(
    public _id: string,
    public name: string,
    public email: string,
    public phone: string,
    public role: AdminRole,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
    public blocked: boolean,
    public major_role: string,
    public dateOfBirth: Date,
    public gender: string,
    public documents: any[],

    public address?: string | AddressValue,
    public photo?: any[],
    public leaveBalance?: { sickLeave: number; casualLeave: number; }
  ) { }
}
