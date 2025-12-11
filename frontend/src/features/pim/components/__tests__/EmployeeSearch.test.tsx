import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmployeeSearch } from '../EmployeeSearch';
import type { EmployeeListFilters } from '../../types/employees.types';

describe('EmployeeSearch', () => {
  const mockFilters: EmployeeListFilters = {
    page: 1,
    limit: 50,
    include: 'current',
  };

  const mockOnFiltersChange = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search form with all fields', () => {
    render(
      <EmployeeSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByLabelText('Employee Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Employee Id')).toBeInTheDocument();
    expect(screen.getByLabelText('Include')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should call onFiltersChange when input changes', () => {
    render(
      <EmployeeSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        onSearch={mockOnSearch}
      />
    );

    const nameInput = screen.getByLabelText('Employee Name');
    fireEvent.change(nameInput, { target: { value: 'John' } });

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ employeeName: 'John' });
  });

  it('should call onSearch when Search button is clicked', () => {
    render(
      <EmployeeSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        onSearch={mockOnSearch}
      />
    );

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalled();
  });

  it('should call onReset when Reset button is clicked', () => {
    render(
      <EmployeeSearch
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        onReset={mockOnReset}
        onSearch={mockOnSearch}
      />
    );

    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });
});

