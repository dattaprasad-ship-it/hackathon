import { AppDataSource } from '../config/database';
import { Claim } from '../modules/claims/entities/claim.entity';
import { Expense } from '../modules/claims/entities/expense.entity';
import { Attachment } from '../modules/claims/entities/attachment.entity';
import { Employee } from '../modules/pim/entities/employee.entity';
import { EventType } from '../modules/claims/entities/event-type.entity';
import { ExpenseType } from '../modules/claims/entities/expense-type.entity';
import { Currency } from '../modules/claims/entities/currency.entity';
import { User } from '../modules/authentication/entities/user.entity';
import { ClaimRepository } from '../modules/claims/repositories/claim.repository';
import { ExpenseRepository } from '../modules/claims/repositories/expense.repository';
import { AttachmentRepository } from '../modules/claims/repositories/attachment.repository';
import { ReferenceIdUtil } from '../modules/claims/utils/reference-id.util';

const seedClaimsDemoData = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const employeeRepository = AppDataSource.getRepository(Employee);
    const eventTypeRepository = AppDataSource.getRepository(EventType);
    const expenseTypeRepository = AppDataSource.getRepository(ExpenseType);
    const currencyRepository = AppDataSource.getRepository(Currency);
    const userRepository = AppDataSource.getRepository(User);
    const claimRepository = new ClaimRepository(AppDataSource.getRepository(Claim));
    const expenseRepository = new ExpenseRepository(AppDataSource.getRepository(Expense));
    const attachmentRepository = new AttachmentRepository(AppDataSource.getRepository(Attachment));

    // Get existing data
    const employees = await employeeRepository.find({ take: 10 });
    const eventTypes = await eventTypeRepository.find({ where: { isActive: true } });
    const expenseTypes = await expenseTypeRepository.find({ where: { isActive: true } });
    const currencies = await currencyRepository.find({ where: { isActive: true } });
    const users = await userRepository.find({ take: 5 });

    if (employees.length === 0) {
      console.log('⚠️  No employees found. Please seed employees first.');
      return;
    }

    if (eventTypes.length === 0) {
      console.log('⚠️  No event types found. Please seed event types first.');
      return;
    }

    if (currencies.length === 0) {
      console.log('⚠️  No currencies found. Please seed currencies first.');
      return;
    }

    if (users.length === 0) {
      console.log('⚠️  No users found. Please seed users first.');
      return;
    }

    const existingClaims = await claimRepository.findAll();
    if (existingClaims.length > 0) {
      console.log(`ℹ️  ${existingClaims.length} claims already exist. Skipping seed.`);
      return;
    }

    // Demo claims data
    const demoClaims = [
      {
        employee: employees[0],
        eventType: eventTypes.find((et) => et.name === 'Travel Allowance') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Submitted' as const,
        remarks: 'Business trip to New York for client meeting',
        totalAmount: 1250.50,
        submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), amount: 450.00, note: 'Flight tickets' },
          { expenseType: expenseTypes[1] || expenseTypes[0], expenseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), amount: 300.00, note: 'Hotel accommodation' },
          { expenseType: expenseTypes[2] || expenseTypes[0], expenseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), amount: 150.50, note: 'Meals' },
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), amount: 350.00, note: 'Taxi and transportation' },
        ],
      },
      {
        employee: employees[0],
        eventType: eventTypes.find((et) => et.name === 'Medical Reimbursement') || eventTypes[1] || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Approved' as const,
        remarks: 'Annual health checkup',
        totalAmount: 350.00,
        submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        approver: users.find((u) => u.role === 'Admin') || users[0],
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), amount: 350.00, note: 'Medical consultation and tests' },
        ],
      },
      {
        employee: employees[1] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Training & Development') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Pending Approval' as const,
        remarks: 'Online certification course',
        totalAmount: 899.99,
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), amount: 899.99, note: 'Course fee' },
        ],
      },
      {
        employee: employees[1] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Equipment Purchase') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Initiated' as const,
        remarks: 'New laptop for development work',
        totalAmount: 0,
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(), amount: 1299.99, note: 'MacBook Pro' },
        ],
      },
      {
        employee: employees[2] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Meal Allowance') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Paid' as const,
        remarks: 'Monthly meal allowance',
        totalAmount: 200.00,
        submittedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        approvedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        approver: users.find((u) => u.role === 'Admin') || users[0],
        expenses: [
          { expenseType: expenseTypes[2] || expenseTypes[0], expenseDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), amount: 200.00, note: 'Monthly meal allowance' },
        ],
      },
      {
        employee: employees[2] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Transportation') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Rejected' as const,
        remarks: 'Uber rides for client visits',
        totalAmount: 85.50,
        submittedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        rejectedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        rejectionReason: 'Insufficient documentation. Please provide receipts for all rides.',
        approver: users.find((u) => u.role === 'Admin') || users[0],
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), amount: 85.50, note: 'Uber rides' },
        ],
      },
      {
        employee: employees[3] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Internet Reimbursement') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Initiated' as const,
        remarks: 'Home internet bill reimbursement',
        totalAmount: 0,
        expenses: [],
      },
      {
        employee: employees[3] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Office Supplies') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Submitted' as const,
        remarks: 'Office stationery and supplies',
        totalAmount: 125.75,
        submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expenses: [
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), amount: 75.25, note: 'Notebooks and pens' },
          { expenseType: expenseTypes[0], expenseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), amount: 50.50, note: 'Printer paper' },
        ],
      },
      {
        employee: employees[4] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Client Entertainment') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'On Hold' as const,
        remarks: 'Client dinner meeting',
        totalAmount: 450.00,
        submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        expenses: [
          { expenseType: expenseTypes[2] || expenseTypes[0], expenseDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), amount: 450.00, note: 'Restaurant bill' },
        ],
      },
      {
        employee: employees[4] || employees[0],
        eventType: eventTypes.find((et) => et.name === 'Parking Fees') || eventTypes[0],
        currency: currencies.find((c) => c.code === 'USD') || currencies[0],
        status: 'Cancelled' as const,
        remarks: 'Monthly parking fees',
        totalAmount: 0,
        expenses: [],
      },
    ];

    let createdCount = 0;

    for (const claimData of demoClaims) {
      try {
        // Generate reference ID
        const referenceId = await ReferenceIdUtil.generateReferenceId(claimRepository);

        // Get a random user for createdBy
        const createdByUser = users[Math.floor(Math.random() * users.length)];

        // Create claim
        const claim = await claimRepository.create({
          referenceId,
          employee: claimData.employee,
          eventType: claimData.eventType,
          currency: claimData.currency,
          status: claimData.status,
          remarks: claimData.remarks,
          totalAmount: claimData.totalAmount,
          submittedDate: claimData.submittedDate,
          approvedDate: claimData.approvedDate,
          rejectedDate: claimData.rejectedDate,
          rejectionReason: claimData.rejectionReason,
          approver: claimData.approver,
          createdBy: createdByUser.username,
          updatedBy: createdByUser.username,
        } as Partial<Claim>);

        // Create expenses
        if (claimData.expenses && claimData.expenses.length > 0) {
          for (const expenseData of claimData.expenses) {
            await expenseRepository.create({
              claim,
              expenseType: expenseData.expenseType,
              expenseDate: expenseData.expenseDate,
              amount: expenseData.amount,
              note: expenseData.note,
              createdBy: createdByUser.username,
              updatedBy: createdByUser.username,
            } as Partial<Expense>);
          }
        }

        // Create sample attachments for some claims
        if (claimData.status === 'Submitted' || claimData.status === 'Approved') {
          await attachmentRepository.create({
            claim,
            originalFilename: 'receipt.pdf',
            storedFilename: `receipt-${Date.now()}.pdf`,
            fileSize: 102400, // 100KB
            fileType: 'application/pdf',
            description: 'Receipt attachment',
            filePath: `uploads/claims/receipt-${Date.now()}.pdf`,
            createdBy: createdByUser.username,
            updatedBy: createdByUser.username,
          } as Partial<Attachment>);
        }

        createdCount++;
      } catch (error) {
        console.error(`Error creating claim: ${error}`);
      }
    }

    console.log(`✅ Seeded ${createdCount} demo claims with expenses and attachments`);
    console.log('✅ Claims demo data seed completed successfully');
  } catch (error) {
    console.error('❌ Error seeding claims demo data:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
};

// Run if called directly
if (require.main === module) {
  seedClaimsDemoData()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });
}

export default seedClaimsDemoData;

