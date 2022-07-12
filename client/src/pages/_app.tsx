import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '../styles/icons.css';
import Axios from 'axios';
import { useRouter } from 'next/router';

import Navbar from '../components/Navbar';
import { Fragment } from 'react';

// configure default base url and credentials to use for all backend requests
Axios.defaults.baseURL = 'http://localhost:5001/api/';
Axios.defaults.withCredentials = true;

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // array of routes where navbar will not be displayed
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <Fragment>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </Fragment>
  );
}
