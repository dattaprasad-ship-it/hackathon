"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const job_title_entity_1 = require("../modules/pim/entities/job-title.entity");
const sub_unit_entity_1 = require("../modules/pim/entities/sub-unit.entity");
const seedPimData = async () => {
    try {
        await database_1.AppDataSource.initialize();
        const jobTitleRepository = database_1.AppDataSource.getRepository(job_title_entity_1.JobTitle);
        const subUnitRepository = database_1.AppDataSource.getRepository(sub_unit_entity_1.SubUnit);
        const existingJobTitles = await jobTitleRepository.count();
        const existingSubUnits = await subUnitRepository.count();
        if (existingJobTitles === 0) {
            const jobTitles = jobTitleRepository.create([
                { title: 'Software Engineer' },
                { title: 'Senior Software Engineer' },
                { title: 'Product Manager' },
                { title: 'HR Manager' },
                { title: 'HR Executive' },
                { title: 'Finance Manager' },
                { title: 'Accountant' },
                { title: 'Sales Executive' },
                { title: 'Marketing Manager' },
                { title: 'CEO' },
            ]);
            await jobTitleRepository.save(jobTitles);
            console.log(`✅ Seeded ${jobTitles.length} job titles`);
        }
        else {
            console.log(`ℹ️  Job titles already exist (${existingJobTitles} records)`);
        }
        if (existingSubUnits === 0) {
            const subUnits = subUnitRepository.create([
                { name: 'Engineering' },
                { name: 'Human Resources' },
                { name: 'Finance' },
                { name: 'Sales' },
                { name: 'Marketing' },
                { name: 'Operations' },
                { name: 'Executive' },
            ]);
            await subUnitRepository.save(subUnits);
            console.log(`✅ Seeded ${subUnits.length} sub units`);
        }
        else {
            console.log(`ℹ️  Sub units already exist (${existingSubUnits} records)`);
        }
        console.log('✅ PIM seed data completed successfully');
    }
    catch (error) {
        console.error('❌ Error seeding PIM data:', error);
        throw error;
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
};
seedPimData()
    .then(() => {
    console.log('Seed script completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-pim-data.js.map