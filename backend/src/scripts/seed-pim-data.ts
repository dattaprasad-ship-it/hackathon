import { AppDataSource } from '../config/database';
import { JobTitle } from '../modules/pim/entities/job-title.entity';
import { SubUnit } from '../modules/pim/entities/sub-unit.entity';

const seedPimData = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const jobTitleRepository = AppDataSource.getRepository(JobTitle);
    const subUnitRepository = AppDataSource.getRepository(SubUnit);

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
    } else {
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
    } else {
      console.log(`ℹ️  Sub units already exist (${existingSubUnits} records)`);
    }

    console.log('✅ PIM seed data completed successfully');
  } catch (error) {
    console.error('❌ Error seeding PIM data:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
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

