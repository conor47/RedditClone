import Head from 'next/head';

import RedditLogo from '../images/redditLogo.svg';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <nav className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 bg-white">
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
            className="py-1 pr-3 bg-transparent rounded focus:outline-none w-160"
          ></input>
        </div>
        {/* Auth buttons */}
      </nav>
    </div>
  );
};

export default Home;
