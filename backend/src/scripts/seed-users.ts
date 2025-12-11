import { AppDataSource } from '../config/database';
import { User } from '../modules/authentication/entities/user.entity';
import { UserRole } from '../constants/enums/user-role.enum';
import { AccountStatus } from '../constants/enums/account-status.enum';
import { passwordUtil } from '../modules/authentication/utils/password.util';

const seedUsers = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    const userRepository = AppDataSource.getRepository(User);

    const existingUsers = await userRepository.count();

    if (existingUsers === 0) {
      const adminPasswordHash = await passwordUtil.hashPassword('admin123');
      const employeePasswordHash = await passwordUtil.hashPassword('employee123');

      const users = userRepository.create([
        {
          username: 'admin',
          passwordHash: adminPasswordHash,
          role: UserRole.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
          displayName: 'Administrator',
          email: 'admin@example.com',
        },
        {
          username: 'employee',
          passwordHash: employeePasswordHash,
          role: UserRole.EMPLOYEE,
          accountStatus: AccountStatus.ACTIVE,
          displayName: 'Employee User',
          email: 'employee@example.com',
        },
      ]);

      await userRepository.save(users);
      console.log(`✅ Seeded ${users.length} users`);
      console.log('   - admin / admin123 (Admin role)');
      console.log('   - employee / employee123 (Employee role)');
    } else {
      console.log(`ℹ️  Users already exist (${existingUsers} records)`);
      
      // Check if admin user exists
      const adminUser = await userRepository.findOne({
        where: { username: 'admin' } as any,
      });
      
      if (!adminUser) {
        console.log('⚠️  Admin user not found. Creating admin user...');
        const adminPasswordHash = await passwordUtil.hashPassword('admin123');
        const adminUser = userRepository.create({
          username: 'admin',
          passwordHash: adminPasswordHash,
          role: UserRole.ADMIN,
          accountStatus: AccountStatus.ACTIVE,
          displayName: 'Administrator',
          email: 'admin@example.com',
        });
        await userRepository.save(adminUser);
        console.log('✅ Admin user created: admin / admin123');
      } else {
        console.log('✅ Admin user exists');
      }
    }

    console.log('✅ User seed data completed successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
};

seedUsers()
  .then(() => {
    console.log('Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });

