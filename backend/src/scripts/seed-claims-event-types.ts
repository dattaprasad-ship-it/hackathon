import { AppDataSource } from '../config/database';
import { EventType } from '../modules/claims/entities/event-type.entity';

const seedEventTypes = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const eventTypeRepository = AppDataSource.getRepository(EventType);

    // All required event types from the specification
    const eventTypes = [
      { name: 'Travel Allowance', description: 'Travel expense claims' },
      { name: 'Medical Reimbursement', description: 'Medical expense claims' },
      { name: 'Accommodation', description: 'Accommodation expense claims' },
      { name: 'Meal Allowance', description: 'Meal allowance expenses' },
      { name: 'Transportation', description: 'Transportation expenses' },
      { name: 'Training & Development', description: 'Training and development expenses' },
      { name: 'Equipment Purchase', description: 'Equipment purchase expenses' },
      { name: 'Mobile/Phone Bill', description: 'Mobile and phone bill expenses' },
      { name: 'Internet Reimbursement', description: 'Internet reimbursement expenses' },
      { name: 'Relocation Expenses', description: 'Relocation expense claims' },
      { name: 'Uniform Allowance', description: 'Uniform allowance expenses' },
      { name: 'Parking Fees', description: 'Parking fee expenses' },
      { name: 'Client Entertainment', description: 'Client entertainment expenses' },
      { name: 'Office Supplies', description: 'Office supplies expenses' },
      { name: 'Meals & Entertainment', description: 'Meals and entertainment expenses' },
      { name: 'Other', description: 'Other expense claims' },
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const eventTypeData of eventTypes) {
      const existing = await eventTypeRepository.findOne({
        where: { name: eventTypeData.name },
      });

      if (!existing) {
        const eventType = eventTypeRepository.create({
          name: eventTypeData.name,
          description: eventTypeData.description,
          isActive: true,
          createdBy: 'system',
          updatedBy: 'system',
        });
        await eventTypeRepository.save(eventType);
        addedCount++;
      } else {
        skippedCount++;
      }
    }

    console.log(`✅ Seeded ${addedCount} new event types`);
    if (skippedCount > 0) {
      console.log(`ℹ️  Skipped ${skippedCount} existing event types`);
    }
    console.log('✅ Claims event types seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding claims event types:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
};

// Run if called directly
if (require.main === module) {
  seedEventTypes()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedEventTypes;

