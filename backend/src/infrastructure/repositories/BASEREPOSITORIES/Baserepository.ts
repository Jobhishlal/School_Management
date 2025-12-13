import { Document,Model,Types } from "mongoose";

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  protected toObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error(`Invalid ObjectId: ${id}`);
    return new Types.ObjectId(id);
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(this.toObjectId(id)).exec();
  }

  async findOne(query: Partial<Record<keyof T, any>>): Promise<T | null> {
    return this.model.findOne(query as any).exec();
  }

  async findAll(query: Partial<Record<keyof T, any>> = {}): Promise<T[]> {
    return this.model.find(query as any).exec();
  }

  async update(id: string, update: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(this.toObjectId(id), update, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(this.toObjectId(id));
  }
}