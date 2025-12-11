"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportingMethodRepository = exports.SubUnitRepository = exports.EmploymentStatusRepository = exports.JobTitleRepository = void 0;
const IGenericRepository_1 = require("../../../common/base/IGenericRepository");
class JobTitleRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
}
exports.JobTitleRepository = JobTitleRepository;
class EmploymentStatusRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
}
exports.EmploymentStatusRepository = EmploymentStatusRepository;
class SubUnitRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
}
exports.SubUnitRepository = SubUnitRepository;
class ReportingMethodRepository extends IGenericRepository_1.IGenericRepository {
    constructor(repository) {
        super(repository);
    }
}
exports.ReportingMethodRepository = ReportingMethodRepository;
//# sourceMappingURL=lookup.repository.js.map