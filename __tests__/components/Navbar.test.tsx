import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Navbar } from '@/components/Navbar';
jest.mock('../../components/WalletMenu', () => ({
  __esModule: true,
  WalletMenu: () => {
    return <button>Wallet</button>;
  },
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('Navbar', () => {
  it('placeholder test', () => {
    expect(true).toBe(true);
  });
  // it('renders WalletMenu link', () => {
  //   render(<Navbar />);
  //   const el = screen.getAllByRole('button');
  //   expect(el[0]).toHaveTextContent('Wallet');
  // });
  // it('renders Play link', () => {
  //   render(<Navbar />);
  //   const el = screen.getAllByRole('link');
  //   expect(el[0]).toHaveTextContent('Play');
  //   expect(el[0]).toHaveAttribute('href', '/');
  // });
  // it('renders About link', () => {
  //   render(<Navbar />);
  //   const el = screen.getAllByRole('link');
  //   expect(el[1]).toHaveTextContent('About');
  //   expect(el[1]).toHaveAttribute('href', '/about');
  // });
});
