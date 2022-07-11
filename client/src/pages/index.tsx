import Head from 'next/head';
import styles from '../styles/Home.module.css';

import RedditLogo from '../images/redditLogo.svg';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12">
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
        {/* Auth buttons */}
      </div>
    </div>
  );
};

export default Home;
