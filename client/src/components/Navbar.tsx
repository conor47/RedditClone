import Link from 'next/link';
import RedditLogo from '../images/redditLogo.svg';

import { useAuthDispatch, useAuthState } from '../context/Auth';
import {
  useGlobalStateContext,
  useGlobalStateDispatch,
} from '../context/GlobalState';
import { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Actions as authActions } from '../reducers/authReducer';
import { Actions as globalActions } from '../reducers/globalStateReducer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Sub } from '../../types';

const Navbar: React.FC = () => {
  const [name, setName] = useState('');
  const [subs, setSubs] = useState<Sub[]>([]);
  const [timer, setTimer] = useState(null);
  const { authenticated, loading, user } = useAuthState();
  const { darkMode } = useGlobalStateContext();
  const authDispatch = useAuthDispatch();
  const globalStateDispatch = useGlobalStateDispatch();

  const router = useRouter();
  let htmlRef;
  let bodyRef;

  // function which posts a logout request for the currently logged in user
  const logout = async (): Promise<void> => {
    await axios.get('/auth/logout');
    authDispatch({ type: authActions.logout });
    window.location.reload();
  };

  // function which makes a search request.
  const searchSubs = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          const { data } = await axios.get<Sub[]>(`/subs/search/${name}`);
          setSubs(data);
        } catch (error) {
          console.log(error);
        }
      }, 250)
    );
  };

  const goToSub = (subName: string) => {
    router.push(`/r/${subName}`);
    setName('');
  };

  const toggleDarkMode = (e: Event) => {
    if (darkMode) {
      globalStateDispatch({ type: globalActions.light });
      htmlRef.classList.remove('dark');
      bodyRef.style.backgroundColor = '#DAE0E6';
    } else {
      globalStateDispatch({ type: globalActions.dark });
      htmlRef.classList.add('dark');
      bodyRef.style.backgroundColor = 'black';
    }
  };

  useEffect(() => {
    htmlRef = document.querySelector('html');
    bodyRef = document.querySelector('body');
  });

  useEffect(() => {
    if (name.trim() === '') {
      setSubs([]);
      return;
    } else {
      searchSubs();
    }
  }, [name]);

  return (
    <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-12 px-5 transition-all bg-white dark:bg-customDark">
      {/* Logo and Title */}
      <div className="flex items-center">
        <Link href="/r/all">
          <a>
            <RedditLogo className="w-8 h-8 mr-2" />
          </a>
        </Link>
        <span className="hidden text-2xl font-semibold transition-all lg:block dark:text-slate-50">
          <Link href="/r/all">Reddit</Link>
        </span>
      </div>
      {/* Search input */}
      <div className="max-w-full px-4 w-160">
        <div className="relative flex items-center transition-all bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Search Reddit"
            className="py-1 pr-3 text-sm font-light bg-transparent rounded focus:outline-none"
          ></input>
          <div className="absolute inset-x-0 bg-white" style={{ top: '100%' }}>
            {subs?.map((sub) => (
              <div
                key={sub.name}
                className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                onClick={() => goToSub(sub.name)}
              >
                <Image
                  src={sub.imageUrl}
                  alt="sub"
                  height={(8 * 16) / 4}
                  width={(8 * 16) / 4}
                  className="rounded-full"
                />
                <div className="ml-4 text-sm">
                  <p className="font-medium">{sub.name}</p>
                  <p className="text-gray-600">{sub.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Auth buttons */}
      <div className="flex">
        {darkMode ? (
          <i
            className="mt-1 mr-5 text-orange-500 cursor-pointer fas fa-sun"
            onClick={(e) => toggleDarkMode(e.nativeEvent)}
          ></i>
        ) : (
          <i
            className="mt-1 mr-5 text-center cursor-pointer text-customDark fas fa-moon"
            onClick={(e) => toggleDarkMode(e.nativeEvent)}
          ></i>
        )}
        {!loading &&
          (authenticated ? (
            // show logout
            <>
              <Link href={`/u/${user.username}`}>
                <button className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow button blue">
                  {/* {user.username} */}
                  Profile
                </button>
              </Link>
              <button
                className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow button blue"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <Fragment>
              <Link href="/login">
                <a className="hidden w-20 py-1 mr-4 leading-5 sm:block lg:w-32 hollow button blue">
                  Log In
                </a>
              </Link>
              <Link href="/register">
                <a className="hidden w-20 py-1 leading-5 sm:block lg:w-32 button blue">
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
