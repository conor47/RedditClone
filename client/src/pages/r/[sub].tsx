import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import useSWR from 'swr';

import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';
import { Sub } from '../../../types';

const Sub: React.FC = () => {
  const router = useRouter();

  const subName = router.query.sub;

  const {
    data: sub,
    error,
    isValidating,
  } = useSWR<Sub>(subName ? `subs/${subName}` : null);

  if (error) {
    router.push('/');
  }

  let postsMarkup;

  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading ...</p>;
  } else if (sub.posts.length < 1) {
    postsMarkup = <p className="text-lg text-center">It looks empty ...</p>;
  } else {
    postsMarkup = sub.posts.map((post) => {
      return <PostCard key={post.identifier} post={post} />;
    });
  }
  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          {/* Sub info and images */}
          <div>
            <div className="bg-blue-500">
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500"
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
          </div>

          {/* Posts and Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postsMarkup}</div>
            <SideBar sub={sub} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Sub;
