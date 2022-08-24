import '../styles/globals.css';
import '../styles/icons.css';
// import type { AppProps } from 'next/app';
import Axios from 'axios';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import Navbar from '../components/Navbar';
import { AuthProvider } from '../context/Auth';
import { GlobalStateProvider } from '../context/GlobalState';
import { NextComponentType, NextPageContext } from 'next';

// configure default base url and credentials to use for all backend requests
Axios.defaults.baseURL = 'http://localhost:5001/api/';
Axios.defaults.withCredentials = true;

const fetcher = async (url: string) => {
  try {
    const res = await Axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response.data;
  }
};

type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & {
    layout?: any;
  };
};

export default function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();

  // array of routes where navbar will not be displayed
  const authRoutes = ['/register', '/login', '/404'];
  const authRoute = authRoutes.includes(pathname);

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  return (
    <SWRConfig
      value={{
        fetcher,
        dedupingInterval: 10000,
      }}
    >
      <AuthProvider>
        <GlobalStateProvider>
          {!authRoute && <Navbar />}
          <div className={authRoute ? '' : 'pt-12'}>
            <Layout>
              <Component {...pageProps}></Component>
            </Layout>
          </div>
        </GlobalStateProvider>
      </AuthProvider>
    </SWRConfig>
  );
}
