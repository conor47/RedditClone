import Link from 'next/link';
import RedditLogo from '../images/redditLogo.svg';

import { useAuthDispatch, useAuthState } from '../context/Auth';
import { Fragment } from 'react';
import axios from 'axios';
import { Actions } from '../../types';

const Navbar: React.FC = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = async (): Promise<void> => {
    await axios.get('/auth/logout');
    dispatch({ type: Actions.logout });
    window.location.reload();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
      {/* Logo and Title */}
      <div className="flex items-center">
        <Link href="/">
          <a>
            <RedditLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="text-2xl font-semibold">
          <Link href="/">Reddit</Link>
        </span>
      </div>
      {/* Search input */}
      <div className="flex items-center mx-auto transition-all bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
        <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
        <input
          type="text"
          placeholder="search"
          className="py-1 pr-3 bg-transparent rounded focus:outline-none w-160"
        ></input>
      </div>
      {/* Auth buttons */}
      <div className="flex">
        {!loading &&
          (authenticated ? (
            // show logout
            <button
              className="w-32 py-1 mr-4 leading-5 hollow button blue"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <Fragment>
              <Link href="/login">
                <a
                  href=""
                  className="w-32 py-1 mr-4 leading-5 hollow button blue"
                >
                  Log In
                </a>
              </Link>
              <Link href="/register">
                <a href="" className="w-32 py-1 leading-5 button blue">
                  Sign Up
                </a>
              </Link>
            </Fragment>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
