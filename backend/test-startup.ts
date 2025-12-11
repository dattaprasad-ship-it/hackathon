// Simple test to check if backend can start
import { AppDataSource } from './src/config/database';

async function testStartup() {
  console.log('Testing database initialization...');
  try {
    await AppDataSource.initialize();
    console.log('✅ Database initialized successfully');
    await AppDataSource.destroy();
    console.log('✅ Database closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

testStartup();

