import Head from 'next/head';
import { Fragment, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import useSWR from 'swr';
import {} from 'swr';
import Image from 'next/image';
import Link from 'next/link';

import { Post, Sub } from '../../../types';
import PostCard from '../../components/PostCard';
import { useAuthState } from '../../context/Auth';
import ActionButton from '../../components/ActionButton';
import { Filters } from '../../../types';

const Home: React.FC = () => {
  const [observedPost, setObservedPost] = useState('');
  const [filter, setFilter] = useState(Filters.top_alltime);
  const [sortTop, setSortTop] = useState(false);
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
  } = useSWRInfinite<Post[]>(
    (index) => `/posts?page=${index}&filter=${filter}`
  );

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

  // function for handling posts filtering
  const updateFilteredPosts = (e: Event, type: Filters) => {
    e.preventDefault();
    setFilter(type);
  };

  // function for handling updating top posts filter
  const filterTopPosts = (e: Event, type: Filters) => {
    e.preventDefault();
    setSortTop(!sortTop);
    setFilter(type);
    updateFilteredPosts(e, type);
  };

  const formatFilterText = (type: Filters): string => {
    switch (type) {
      case Filters.top_day:
        return 'Today';
      case Filters.top_week:
        return 'Week';
      case Filters.top_month:
        return 'Month';
      case Filters.top_alltime:
        return 'All time';
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
          <div className="py-3 pl-2 mb-3 transition-all bg-white rounded-sm flexmax-w-full dark:bg-customDark">
            <div className="flex">
              <ActionButton
                selected={filter == Filters.new}
                type={Filters.new}
                clickHandler={updateFilteredPosts}
              >
                <i className="mr-1 fas fa-sun"></i>
                <span className="font-bold">New</span>
              </ActionButton>
              <ActionButton
                selected={
                  filter == Filters.top_day ||
                  filter == Filters.top_week ||
                  filter == Filters.top_month ||
                  filter == Filters.top_alltime
                }
                type={Filters.top_day}
                clickHandler={updateFilteredPosts}
              >
                <i className="mr-1 fas fa-square-poll-vertical"></i>
                <span className="font-bold">Top</span>
              </ActionButton>
              {(filter == Filters.top_day ||
                filter == Filters.top_month ||
                filter == Filters.top_week ||
                filter == Filters.top_alltime) && (
                <>
                  <div>
                    <ActionButton
                      selected={
                        filter == Filters.top_day ||
                        filter == Filters.top_month ||
                        filter == Filters.top_week ||
                        filter == Filters.top_alltime
                      }
                      type={filter}
                      clickHandler={filterTopPosts}
                    >
                      <span className="relative font-bold">
                        {formatFilterText(filter)}
                      </span>
                      <i className="ml-1 fas fa-chevron-down"></i>
                    </ActionButton>
                    {sortTop && (
                      <div className="absolute flex bg-white shadow">
                        <p
                          className="px-2 py-2 text-sm text-gray-400 transition-all cursor-pointer hover:bg-blue-100 hover:text-black"
                          onClick={(e) =>
                            filterTopPosts(e.nativeEvent, Filters.top_day)
                          }
                        >
                          Today
                        </p>
                        <p
                          className="px-2 py-2 text-sm text-gray-400 transition-all cursor-pointer hover:bg-blue-100 hover:text-black"
                          onClick={(e) =>
                            filterTopPosts(e.nativeEvent, Filters.top_week)
                          }
                        >
                          Week
                        </p>
                        <p
                          className="px-2 py-2 text-sm text-gray-400 transition-all cursor-pointer hover:bg-blue-100 hover:text-black"
                          onClick={(e) =>
                            filterTopPosts(e.nativeEvent, Filters.top_month)
                          }
                        >
                          Month
                        </p>
                        <p
                          className="px-2 py-2 text-sm text-gray-400 transition-all cursor-pointer hover:bg-blue-100 hover:text-black"
                          onClick={(e) =>
                            filterTopPosts(e.nativeEvent, Filters.top_alltime)
                          }
                        >
                          All time
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {posts?.map((post) => (
            <PostCard post={post} key={post.identifier} revalidate={mutate} />
          ))}
          {isValidating && posts.length > 0 && (
            <p className="text-lg text-center">Loading more posts ...</p>
          )}
        </div>
        {/* Sidebar */}
        <div className="hidden ml-6 w-80 md:block">
          <div className="transition-all bg-white rounded dark:bg-customDark dark:text-slate-50">
            <div className="p-4 transition-all border-b-2 dark:border-b-black">
              <p className="text-lg font-semibold text-center transition-all dark:bg-customDark">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub) => {
                return (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b dark:border-b-black"
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
              <div className="p-4 border-t-2 dark:border-t-black">
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
//

export default Home;
