"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_entity_1 = require("../modules/authentication/entities/user.entity");
const user_role_enum_1 = require("../constants/enums/user-role.enum");
const account_status_enum_1 = require("../constants/enums/account-status.enum");
const password_util_1 = require("../modules/authentication/utils/password.util");
const seedUsers = async () => {
    try {
        await database_1.AppDataSource.initialize();
        const userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
        const existingUsers = await userRepository.count();
        if (existingUsers === 0) {
            const adminPasswordHash = await password_util_1.passwordUtil.hashPassword('admin123');
            const employeePasswordHash = await password_util_1.passwordUtil.hashPassword('employee123');
            const users = userRepository.create([
                {
                    username: 'admin',
                    passwordHash: adminPasswordHash,
                    role: user_role_enum_1.UserRole.ADMIN,
                    accountStatus: account_status_enum_1.AccountStatus.ACTIVE,
                    displayName: 'Administrator',
                    email: 'admin@example.com',
                },
                {
                    username: 'employee',
                    passwordHash: employeePasswordHash,
                    role: user_role_enum_1.UserRole.EMPLOYEE,
                    accountStatus: account_status_enum_1.AccountStatus.ACTIVE,
                    displayName: 'Employee User',
                    email: 'employee@example.com',
                },
            ]);
            await userRepository.save(users);
            console.log(`✅ Seeded ${users.length} users`);
            console.log('   - admin / admin123 (Admin role)');
            console.log('   - employee / employee123 (Employee role)');
        }
        else {
            console.log(`ℹ️  Users already exist (${existingUsers} records)`);
            // Check if admin user exists
            const adminUser = await userRepository.findOne({
                where: { username: 'admin' },
            });
            if (!adminUser) {
                console.log('⚠️  Admin user not found. Creating admin user...');
                const adminPasswordHash = await password_util_1.passwordUtil.hashPassword('admin123');
                const adminUser = userRepository.create({
                    username: 'admin',
                    passwordHash: adminPasswordHash,
                    role: user_role_enum_1.UserRole.ADMIN,
                    accountStatus: account_status_enum_1.AccountStatus.ACTIVE,
                    displayName: 'Administrator',
                    email: 'admin@example.com',
                });
                await userRepository.save(adminUser);
                console.log('✅ Admin user created: admin / admin123');
            }
            else {
                console.log('✅ Admin user exists');
            }
        }
        console.log('✅ User seed data completed successfully');
    }
    catch (error) {
        console.error('❌ Error seeding users:', error);
        throw error;
    }
    finally {
        await database_1.AppDataSource.destroy();
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
//# sourceMappingURL=seed-users.js.map