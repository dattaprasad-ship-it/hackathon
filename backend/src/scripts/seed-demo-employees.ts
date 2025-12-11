import { AppDataSource } from '../config/database';
import { Employee } from '../modules/pim/entities/employee.entity';
import { JobTitle } from '../modules/pim/entities/job-title.entity';
import { SubUnit } from '../modules/pim/entities/sub-unit.entity';

const seedDemoEmployees = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const employeeRepository = AppDataSource.getRepository(Employee);
    const jobTitleRepository = AppDataSource.getRepository(JobTitle);
    const subUnitRepository = AppDataSource.getRepository(SubUnit);

    const existingEmployees = await employeeRepository.count();
    if (existingEmployees > 0) {
      console.log(`ℹ️  ${existingEmployees} employees already exist. Skipping seed.`);
      return;
    }

    const jobTitles = await jobTitleRepository.find({ take: 5 });
    const subUnits = await subUnitRepository.find({ take: 5 });

    if (jobTitles.length === 0 || subUnits.length === 0) {
      console.log('⚠️  Please seed job titles and sub units first.');
      return;
    }

    const demoEmployees = [
      {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: jobTitles[0],
        subUnit: subUnits[0],
        isDeleted: false,
      },
      {
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: jobTitles[1] || jobTitles[0],
        subUnit: subUnits[1] || subUnits[0],
        isDeleted: false,
      },
      {
        employeeId: 'EMP003',
        firstName: 'Michael',
        lastName: 'Johnson',
        jobTitle: jobTitles[2] || jobTitles[0],
        subUnit: subUnits[2] || subUnits[0],
        isDeleted: false,
      },
      {
        employeeId: 'EMP004',
        firstName: 'Sarah',
        lastName: 'Williams',
        jobTitle: jobTitles[3] || jobTitles[0],
        subUnit: subUnits[3] || subUnits[0],
        isDeleted: false,
      },
      {
        employeeId: 'EMP005',
        firstName: 'David',
        lastName: 'Brown',
        jobTitle: jobTitles[4] || jobTitles[0],
        subUnit: subUnits[4] || subUnits[0],
        isDeleted: false,
      },
    ];

    const employees = employeeRepository.create(
      demoEmployees.map((emp) => ({
        ...emp,
        createdBy: 'system',
        updatedBy: 'system',
      }))
    );

    await employeeRepository.save(employees);
    console.log(`✅ Seeded ${employees.length} demo employees`);
    console.log('✅ Demo employees seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding demo employees:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
};

// Run if called directly
if (require.main === module) {
  seedDemoEmployees()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedDemoEmployees;

