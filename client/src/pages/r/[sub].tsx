import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import useSWR from 'swr';

import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';
import { Sub } from '../../../types';
import Image from 'next/image';

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
            {/* banner image */}
            <div>
              {sub.bannerUrl ? (
                <div
                  className="h-56 "
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
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    width={70}
                    height={70}
                    className="rounded-full"
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-grey-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
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
