import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Page from '@/app/(main)/page';

describe('Home', () => {
  it('renders homepage unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });
  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });
});
