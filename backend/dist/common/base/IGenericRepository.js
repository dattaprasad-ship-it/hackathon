"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGenericRepository = void 0;
class IGenericRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
        });
    }
    async findAll() {
        return this.repository.find();
    }
    async create(entity) {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }
    async update(id, entity) {
        await this.repository.update(id, entity);
    }
    async delete(id) {
        await this.repository.delete(id);
    }
}
exports.IGenericRepository = IGenericRepository;
//# sourceMappingURL=IGenericRepository.js.map