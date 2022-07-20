import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import {} from 'swr';
import Image from 'next/image';
import Link from 'next/link';

import { Post, Sub } from '../../types';
import PostCard from '../components/PostCard';
import { useAuthState } from '../context/Auth';

const Home: React.FC = () => {
  const [observedPost, setObservedPost] = useState('');
  const { authenticated } = useAuthState();
  // const {
  //   data: posts,
  //   error: errorPosts,
  //   isValidating: validatingPosts,
  // } = useSWR<Post[]>('posts');
  const {
    data: topSubs,
    error: errorSubs,
    isValidating: validatingSubs,
  } = useSWR<Sub[]>('/subs/topSubs');

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
  } = useSWRInfinite<Post[]>((index) => `/posts?page=${index}`);

  const posts: Post[] = data ? [].concat(...data) : [];
  const isLoadingInitialData = !data && !error;

  // use effect which is used to track the bottom post on the page. The bottom post's id is saved into state so we can know when the post has been
  // scrolled into the user's view
  useEffect(() => {
    if (!posts || posts.length === 0) {
      return;
    }

    const id = posts[posts.length - 1].identifier;
    if (id !== observedPost) {
      setObservedPost(id);
      observeElement(document.getElementById(id));
    }
  }, [posts]);

  const observeElement = (element: HTMLElement) => {
    if (!element) {
      return;
    } else {
      // this method takes a callback which is run when the observed element comes into view. We set a threshold of 1 which represents the bottom of the element
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting === true) {
            console.log('reached bottom of post');
            setPage(page + 1);
            observer.unobserve(element);
          }
        },
        { threshold: 1 }
      );
      // begin observing the element passed as arguement
      observer.observe(element);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>reddit: the front page of the internet</title>
        <meta
          name="description"
          content="Reddit is a network of communities based on peoples interests. Find communities you are interested in, and become part of an online community"
        />
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="px-4 md:w-160 w-fill md:p-0">
          {isLoadingInitialData && (
            <p className="text-lg text-center">Loading ...</p>
          )}
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} revalidate={mutate} />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading more posts ...</p>
          )}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 w-80 md:block">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => {
                return (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b"
                  >
                    <Link href={`/r/${sub.name}`}>
                      <Image
                        src={sub.imageUrl}
                        alt="Sub"
                        width={(6 * 16) / 4}
                        className="rounded-full cursor-pointer"
                        height={(6 * 16) / 4}
                      />
                    </Link>
                    <Link href={`/r/${sub.name}`}>
                      <a className="ml-2 font-bold hover:cursor-pointer">
                        /r/{sub.name}
                      </a>
                    </Link>
                    <p className="ml-auto font-medium">
                      {<sub className="postCount">{sub.postCount}</sub>}
                    </p>
                  </div>
                );
              })}
            </div>
            {authenticated && (
              <div className="p-4 border-t-2">
                <Link href="/subs/create">
                  <a className="w-full px-3 py-2 blue button">
                    Create Community
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

// server side rendering. Fetching posts server side
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   try {
// we must explicitly include the cookies since this request is made on the server where cookies are not automatically passed

//     const res = await axios.get('/posts', {
//       withCredentials: true,
//       headers: {
//         Cookie: req.headers.cookie ? req.headers.cookie : '',
//       },
//     });

//     return {
//       props: { posts: res.data }, // will be passed to the page component as props
//     };
//   } catch (error) {
//     return {
//       props: { error: 'something went wrong' },
//     };
//   }
// };

export default Home;
