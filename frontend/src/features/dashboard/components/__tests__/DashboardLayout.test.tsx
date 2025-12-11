import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardLayout } from '../DashboardLayout';
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DashboardLayout', () => {
  it('should render children content', () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Test Content</div>
      </DashboardLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render LeftSidebar', () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(screen.getByLabelText(/main navigation/i)).toBeInTheDocument();
  });

  it('should render TopHeader', () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have main content area', () => {
    renderWithRouter(
      <DashboardLayout>
        <div>Content</div>
      </DashboardLayout>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });
});

