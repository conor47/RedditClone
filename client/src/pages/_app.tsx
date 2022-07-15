import '../styles/globals.css';
import '../styles/icons.css';
import type { AppProps } from 'next/app';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/Auth';

// configure default base url and credentials to use for all backend requests
Axios.defaults.baseURL = 'http://localhost:5001/api/';
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  console.log('in fetcher ========', url);

  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // array of routes where navbar will not be displayed
  const authRoutes = ['/register', '/login'];
  const authRoute = authRoutes.includes(pathname);

  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        {!authRoute && <Navbar />}
        <Component {...pageProps} />
      </AuthProvider>
    </SWRConfig>
  );
}
