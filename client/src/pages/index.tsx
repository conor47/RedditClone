import Head from 'next/head';

import { Post, Sub } from '../../types';
import useSWR from 'swr';
import PostCard from '../components/PostCard';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HomeProps {
  posts: Post[];
}

const Home: React.FC = () => {
  const {
    data: posts,
    error: errorPosts,
    isValidating: validatingPosts,
  } = useSWR('posts');
  const {
    data: topSubs,
    error: errorSubs,
    isValidating: validatingSubs,
  } = useSWR('/subs/topSubs');

  return (
    <Fragment>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {!validatingPosts &&
            posts.map((post: Post) => (
              <PostCard post={post} key={post.identifier} />
            ))}
        </div>
        {/* Sidebar */}
        <div className="ml-6 w-80">
          <div className="bg-white rounded">
            <div className="p-4 border-b-2">
              <p className="text-lg font-semibold text-center">
                Top Communities
              </p>
            </div>
            <div>
              {topSubs?.map((sub: Sub) => {
                return (
                  <div
                    key={sub.name}
                    className="flex items-center px-4 py-2 text-xs border-b"
                  >
                    <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                      <Link href={`/r/${sub.name}`}>
                        <Image
                          src={sub.imageUrl}
                          alt="Sub"
                          width={(6 * 16) / 4}
                          height={(6 * 16) / 4}
                        />
                      </Link>
                    </div>
                    <Link href={`/r/${sub.name}`}>
                      <a className="font-bold hover:cursor-pointer">
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
