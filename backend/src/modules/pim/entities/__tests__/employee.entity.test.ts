import { Employee } from '../employee.entity';
import { JobTitle } from '../job-title.entity';
import { EmploymentStatus } from '../employment-status.entity';
import { SubUnit } from '../sub-unit.entity';
import { ReportingMethod } from '../reporting-method.entity';

describe('Employee Entity', () => {
  it('should create an employee with required fields', () => {
    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.isDeleted = false;

    expect(employee.employeeId).toBe('0445');
    expect(employee.firstName).toBe('John');
    expect(employee.lastName).toBe('Doe');
    expect(employee.isDeleted).toBe(false);
  });

  it('should allow optional middle name', () => {
    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.middleName = 'Michael';
    employee.lastName = 'Doe';

    expect(employee.middleName).toBe('Michael');
  });

  it('should allow optional job title relationship', () => {
    const jobTitle = new JobTitle();
    jobTitle.title = 'Software Engineer';

    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.jobTitle = jobTitle;

    expect(employee.jobTitle?.title).toBe('Software Engineer');
  });

  it('should allow optional employment status relationship', () => {
    const employmentStatus = new EmploymentStatus();
    employmentStatus.status = 'Active';

    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.employmentStatus = employmentStatus;

    expect(employee.employmentStatus?.status).toBe('Active');
  });

  it('should allow optional sub-unit relationship', () => {
    const subUnit = new SubUnit();
    subUnit.name = 'Engineering';

    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.subUnit = subUnit;

    expect(employee.subUnit?.name).toBe('Engineering');
  });

  it('should allow optional supervisor relationship (self-referential)', () => {
    const supervisor = new Employee();
    supervisor.employeeId = '0001';
    supervisor.firstName = 'Jane';
    supervisor.lastName = 'Smith';

    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.supervisor = supervisor;

    expect(employee.supervisor?.employeeId).toBe('0001');
    expect(employee.supervisor?.firstName).toBe('Jane');
  });

  it('should allow optional reporting method relationship', () => {
    const reportingMethod = new ReportingMethod();
    reportingMethod.name = 'Direct';

    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.reportingMethod = reportingMethod;

    expect(employee.reportingMethod?.name).toBe('Direct');
  });

  it('should allow optional profile photo path', () => {
    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.profilePhotoPath = '/uploads/photos/0445.jpg';

    expect(employee.profilePhotoPath).toBe('/uploads/photos/0445.jpg');
  });

  it('should allow optional login credentials', () => {
    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.username = 'jdoe';
    employee.passwordHash = 'hashed_password';
    employee.loginStatus = 'Enabled';

    expect(employee.username).toBe('jdoe');
    expect(employee.passwordHash).toBe('hashed_password');
    expect(employee.loginStatus).toBe('Enabled');
  });

  it('should support soft delete with isDeleted flag', () => {
    const employee = new Employee();
    employee.employeeId = '0445';
    employee.firstName = 'John';
    employee.lastName = 'Doe';
    employee.isDeleted = true;

    expect(employee.isDeleted).toBe(true);
  });
});

