import { AdminResponseDTO } from "../../dto/Admin"

export interface IGetAdmin {
  execute(): Promise<AdminResponseDTO[]>; 
}
