import Link from 'next/link';
import { useRouter } from 'next/router';
import { WalletMenu } from '@/components/WalletMenu';

export function Navbar() {
  const router = useRouter();
  const currentRoute = router.pathname;

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Pog Flip</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          {/* <li>
            <Link href="/">
              <a className={currentRoute === '/' ? 'active' : undefined}>
                Play
              </a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a className={currentRoute === '/about' ? 'active' : undefined}>
                About
              </a>
            </Link>
          </li> */}
          <li>
            <div className="flex">
              <WalletMenu onUseWalletClick={() => {}} />
              <label htmlFor="my-modal-3" className="btn modal-button">
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,10 L12,18 M12,6 L12,8"
                  />
                </svg>
              </label>

              <input type="checkbox" id="my-modal-3" className="modal-toggle" />
              <div className="modal">
                <div className="modal-box relative">
                  <label
                    htmlFor="my-modal-3"
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                  >
                    ✕
                  </label>
                  <h3 className="text-lg font-bold">Notes</h3>
                  <p className="py-4">
                    While in early development this game is running on Solana
                    devnet, with support for Phantom wallet initially.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
