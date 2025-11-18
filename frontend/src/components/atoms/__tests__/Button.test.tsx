/**
 * Button 컴포넌트 테스트
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByText('Primary');
    expect(button.className).toContain('bg-primary-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByText('Secondary');
    expect(button.className).toContain('bg-gray-200');
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByText('Small');
    expect(button.className).toContain('px-3');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByText('Large');
    expect(button.className).toContain('px-6');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(
      <Button isLoading loadingText="Loading...">
        Submit
      </Button>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText('Submit')).toBeDisabled();
  });

  it('should render with left icon', () => {
    const Icon = () => <span data-testid="left-icon">Icon</span>;
    render(<Button leftIcon={<Icon />}>With Icon</Button>);

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render with right icon', () => {
    const Icon = () => <span data-testid="right-icon">Icon</span>;
    render(<Button rightIcon={<Icon />}>With Icon</Button>);

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');
    expect(button.className).toContain('w-full');
  });
});
