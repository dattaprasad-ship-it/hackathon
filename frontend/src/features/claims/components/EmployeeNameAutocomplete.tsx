import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { employeesService } from '@/features/pim/services/employeesService';
import type { Employee } from '@/features/pim/types/employees.types';

interface EmployeeNameAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (employee: Employee | null) => void;
  placeholder?: string;
  id?: string;
}

export const EmployeeNameAutocomplete: React.FC<EmployeeNameAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search employee name...',
  id = 'employeeName',
}) => {
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await employeesService.list({
        employeeName: searchTerm,
        limit: 10,
        include: 'current',
      });
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch employee suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelect = (employee: Employee) => {
    const displayName = `${employee.firstName} ${employee.lastName}`;
    onChange(displayName);
    if (onSelect) {
      onSelect(employee);
    }
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls={showSuggestions ? `${id}-suggestions` : undefined}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id={`${id}-suggestions`}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {loading && (
            <li className="px-4 py-2 text-sm text-gray-500">Loading...</li>
          )}
          {!loading && suggestions.map((employee) => (
            <li
              key={employee.id}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              role="option"
              onClick={() => handleSelect(employee)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(employee);
                }
              }}
              tabIndex={0}
            >
              {employee.firstName} {employee.lastName} ({employee.employeeId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

