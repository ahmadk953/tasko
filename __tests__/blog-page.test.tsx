import { render, screen } from '@testing-library/react';

import Page from '@/app/(main)/blog/page';

describe('Blog Page', () => {
  it('renders blog page unchanged', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
  });

  it('renders a heading', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('renders blog posts', () => {
    render(<Page />);

    const posts = screen.getAllByRole('heading', { level: 2 });

    expect(posts.length).toBeGreaterThan(0);
  });
});
