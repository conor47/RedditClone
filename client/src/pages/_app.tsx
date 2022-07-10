import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Axios from 'axios';

// configure default base url to use for all backend requests
Axios.defaults.baseURL = 'http://localhost:5001/api/';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
