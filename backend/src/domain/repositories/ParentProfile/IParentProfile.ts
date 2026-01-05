export interface IParentProfileRepository {
  getParentSignupById(id: string): Promise<any>;
  getStudentById(id: string): Promise<any>;
  getParentById(id: string): Promise<any>;
  getAddressById(id: string): Promise<any>;
  getClassById(id: string): Promise<any>;
}