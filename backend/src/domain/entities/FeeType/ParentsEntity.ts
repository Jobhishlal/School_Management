import { Students } from "../Students";
export class ParentEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public students: Students[] = [] 
  ) {}
}