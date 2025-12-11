"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const user_entity_1 = require("../modules/authentication/entities/user.entity");
const user_repository_1 = require("../modules/authentication/repositories/user.repository");
const password_util_1 = require("../modules/authentication/utils/password.util");
const testLogin = async () => {
    try {
        await database_1.AppDataSource.initialize();
        console.log('✅ Database connected');
        const userRepository = new user_repository_1.UserRepository(database_1.AppDataSource.getRepository(user_entity_1.User));
        // Test finding user
        const user = await userRepository.findByUsername('admin');
        console.log('User found:', user ? 'YES' : 'NO');
        if (user) {
            console.log('Username:', user.username);
            console.log('Role:', user.role);
            console.log('Account Status:', user.accountStatus);
            console.log('Password Hash exists:', !!user.passwordHash);
            console.log('Password Hash length:', user.passwordHash?.length || 0);
            // Test password verification
            const isValid = await password_util_1.passwordUtil.verifyPassword('admin123', user.passwordHash);
            console.log('Password verification:', isValid ? '✅ VALID' : '❌ INVALID');
            if (!isValid) {
                console.log('⚠️  Password verification failed!');
                console.log('Testing hash generation...');
                const testHash = await password_util_1.passwordUtil.hashPassword('admin123');
                console.log('New hash generated:', testHash.substring(0, 20) + '...');
                const testVerify = await password_util_1.passwordUtil.verifyPassword('admin123', testHash);
                console.log('New hash verification:', testVerify ? '✅ WORKS' : '❌ FAILED');
            }
        }
        else {
            console.log('❌ Admin user not found in database!');
            console.log('Run: npm run seed:users');
        }
    }
    catch (error) {
        console.error('❌ Error:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        }
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
};
testLogin()
    .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=test-login.js.map