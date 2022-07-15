import Head from 'next/head';

import { Post } from '../../types';
import useSWR from 'swr';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { Fragment } from 'react';

interface HomeProps {
  posts: Post[];
}

const Home: React.FC = () => {
  const { data: posts, error, isValidating } = useSWR('posts');

  return (
    <Fragment>
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {!isValidating &&
            posts.map((post: Post) => (
              <PostCard post={post} key={post.identifier} />
            ))}
        </div>
        {/* Sidebar */}
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
