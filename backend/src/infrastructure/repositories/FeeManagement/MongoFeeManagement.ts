import { FeeStructureModel } from "../../database/models/FeeManagement/FeeStructure"; 
import { FeeStructureMapper } from "../../../domain/Mapper/FeeStructureMapper";
import { FeeStructure } from "../../../domain/entities/FeeType/FeeStructure";
import { BaseRepository } from "../BASEREPOSITORIES/Baserepository";
import { IFeeStructureRepository } from "../../../domain/repositories/FeeDetails/IFeeStructureRepository";



export class FeeStructureRepository implements IFeeStructureRepository{
    async create(feestructure: FeeStructure): Promise<FeeStructure> {
       const data = FeeStructureMapper.toPersistence(feestructure);
       const model = await FeeStructureModel.create(data)
       return FeeStructureMapper.toDomain(model)
    }
    async findById(id: string): Promise<FeeStructure | null> {
        const model = await FeeStructureModel.findById(id)
        return model?FeeStructureMapper.toDomain(model):null

    }

}