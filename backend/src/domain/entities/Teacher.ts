export class Teeacher {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public gender: string,
    public role: string,
    public createdAt: Date,
    public updatedAt: Date,
    public blocked: boolean,
    public Password: string,
    public documents?: { url: string; filename: string; uploadedAt: Date }[],
    public subjects?: { name: string, code: string }[],
    public department?: "LP" | "UP" | "HS",
    public leaveBalance?: { sickLeave: number; casualLeave: number }
  ) { }
}
