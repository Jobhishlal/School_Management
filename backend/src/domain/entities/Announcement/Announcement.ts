export class Announcement {
  constructor(
    public readonly _id?: string, 
    public readonly title?: string,
    public readonly content?: string,
    public readonly scope?: "GLOBAL" | "CLASS" | "DIVISION",
    public readonly classes?: string[],  
    public readonly division?: string | null,
    public readonly attachment?: { url: string; filename: string; uploadAt: string },
    public readonly activeTime?: Date | string,
    public readonly endTime?: Date | string,
    public readonly status?: "DRAFT" | "ACTIVE",
  ) {}
}
