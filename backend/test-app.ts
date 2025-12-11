// Test app creation
import { createApp } from './src/app';
import { AppDataSource } from './src/config/database';

async function testApp() {
  console.log('Testing app creation...');
  try {
    await AppDataSource.initialize();
    console.log('✅ Database initialized');
    
    const app = createApp();
    console.log('✅ App created successfully');
    
    await AppDataSource.destroy();
    console.log('✅ Test completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ App creation failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
}

testApp();

