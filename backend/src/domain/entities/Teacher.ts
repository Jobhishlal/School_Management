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
    public Password: string
  ) {}
}
