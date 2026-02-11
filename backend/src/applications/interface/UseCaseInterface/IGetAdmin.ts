import { AdminResponseDTO } from "../../applications/dto/Admin"

export interface IGetAdmin {
  execute(): Promise<AdminResponseDTO[]>; 
}
