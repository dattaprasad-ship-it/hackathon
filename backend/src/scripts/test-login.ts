import { AppDataSource } from '../config/database';
import { User } from '../modules/authentication/entities/user.entity';
import { UserRepository } from '../modules/authentication/repositories/user.repository';
import { passwordUtil } from '../modules/authentication/utils/password.util';

const testLogin = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    const userRepository = new UserRepository(AppDataSource.getRepository(User));

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
      const isValid = await passwordUtil.verifyPassword('admin123', user.passwordHash);
      console.log('Password verification:', isValid ? '✅ VALID' : '❌ INVALID');
      
      if (!isValid) {
        console.log('⚠️  Password verification failed!');
        console.log('Testing hash generation...');
        const testHash = await passwordUtil.hashPassword('admin123');
        console.log('New hash generated:', testHash.substring(0, 20) + '...');
        const testVerify = await passwordUtil.verifyPassword('admin123', testHash);
        console.log('New hash verification:', testVerify ? '✅ WORKS' : '❌ FAILED');
      }
    } else {
      console.log('❌ Admin user not found in database!');
      console.log('Run: npm run seed:users');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  } finally {
    await AppDataSource.destroy();
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

