import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const testResults: TestResult[] = [];

const logTest = (name: string, passed: boolean, error?: string) => {
  testResults.push({ name, passed, error });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
};

const testPimEndpoints = async (): Promise<void> => {
  console.log('🧪 Testing PIM Endpoints...\n');

  let authToken = '';

  try {
    console.log('1. Testing Authentication...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123',
    });

    if (loginResponse.data.token) {
      authToken = loginResponse.data.token;
      logTest('Authentication - Login', true);
    } else {
      logTest('Authentication - Login', false, 'No token received');
      return;
    }
  } catch (error: any) {
    logTest(
      'Authentication - Login',
      false,
      error.response?.data?.error?.message || error.message
    );
    console.log('\n⚠️  Note: You may need to create a user first or use existing credentials');
    return;
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  try {
    console.log('\n2. Testing Employee List Endpoint...');
    const listResponse = await axios.get(`${API_BASE_URL}/employees`, { headers });
    logTest('GET /api/employees', true);
    console.log(`   Found ${listResponse.data.data?.length || 0} employees`);
    console.log(`   Total: ${listResponse.data.pagination?.total || 0}`);
  } catch (error: any) {
    logTest(
      'GET /api/employees',
      false,
      error.response?.data?.error?.message || error.message
    );
  }

  try {
    console.log('\n3. Testing Employee Search...');
    const searchResponse = await axios.get(
      `${API_BASE_URL}/employees?employeeName=John&page=1&limit=10`,
      { headers }
    );
    logTest('GET /api/employees?employeeName=John', true);
    console.log(`   Found ${searchResponse.data.data?.length || 0} results`);
  } catch (error: any) {
    logTest(
      'GET /api/employees?employeeName=John',
      false,
      error.response?.data?.error?.message || error.message
    );
  }

  try {
    console.log('\n4. Testing Create Employee...');
    const createResponse = await axios.post(
      `${API_BASE_URL}/employees`,
      {
        employeeId: 'TEST001',
        firstName: 'Test',
        lastName: 'Employee',
      },
      { headers }
    );
    logTest('POST /api/employees', true);
    console.log(`   Created employee: ${createResponse.data.employeeId}`);

    const employeeId = createResponse.data.id;

    try {
      console.log('\n5. Testing Get Employee by ID...');
      const getResponse = await axios.get(`${API_BASE_URL}/employees/${employeeId}`, {
        headers,
      });
      logTest('GET /api/employees/:id', true);
      console.log(`   Employee: ${getResponse.data.firstName} ${getResponse.data.lastName}`);
    } catch (error: any) {
      logTest(
        'GET /api/employees/:id',
        false,
        error.response?.data?.error?.message || error.message
      );
    }

    try {
      console.log('\n6. Testing Update Employee...');
      const updateResponse = await axios.put(
        `${API_BASE_URL}/employees/${employeeId}`,
        {
          firstName: 'Updated',
          lastName: 'Employee',
        },
        { headers }
      );
      logTest('PUT /api/employees/:id', true);
      console.log(`   Updated employee: ${updateResponse.data.firstName}`);
    } catch (error: any) {
      logTest(
        'PUT /api/employees/:id',
        false,
        error.response?.data?.error?.message || error.message
      );
    }

    try {
      console.log('\n7. Testing Delete Employee...');
      await axios.delete(`${API_BASE_URL}/employees/${employeeId}`, { headers });
      logTest('DELETE /api/employees/:id', true);
    } catch (error: any) {
      logTest(
        'DELETE /api/employees/:id',
        false,
        error.response?.data?.error?.message || error.message
      );
    }
  } catch (error: any) {
    logTest(
      'POST /api/employees',
      false,
      error.response?.data?.error?.message || error.message
    );
  }

  console.log('\n📊 Test Summary:');
  const passed = testResults.filter((t) => t.passed).length;
  const total = testResults.length;
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  }
};

testPimEndpoints().catch((error) => {
  console.error('❌ Test script failed:', error);
  process.exit(1);
});

