
export class Class {
  constructor(
    public _id: string,
    public className: string,
    public division: string,
    public rollNumber: string,
    public department?: "LP" | "UP" | "HS",
    public subjects?: string
  ) {}
}
