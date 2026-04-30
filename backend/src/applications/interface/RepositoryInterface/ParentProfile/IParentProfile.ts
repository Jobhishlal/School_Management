export interface IParentProfileRepository {
  getParentSignupById(id: string): Promise<ReturnType<typeof JSON.parse>>;
  getStudentById(id: string): Promise<ReturnType<typeof JSON.parse>>;
  getParentById(id: string): Promise<ReturnType<typeof JSON.parse>>;
  getAddressById(id: string): Promise<ReturnType<typeof JSON.parse>>;
  getClassById(id: string): Promise<ReturnType<typeof JSON.parse>>;
}