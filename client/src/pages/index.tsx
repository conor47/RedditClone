import axios from 'axios';
import Head from 'next/head';

import { Post } from '../../types';
import { GetServerSideProps } from 'next';
import PostCard from '../components/PostCard';

interface HomeProps {
  posts: Post[];
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  // const [posts, setPosts] = useState([]);

  // standard data fetching using useEffect hook
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await axios.get('/posts');
  //       console.log(res);

  //       setPosts(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post: Post) => (
            <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
};

// server side rendering. Fetching posts server side
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    // we must explicitly include the cookies since this request is made on the server where cookies are not automatically passed

    const res = await axios.get('/posts', {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie ? req.headers.cookie : '',
      },
    });

    return {
      props: { posts: res.data }, // will be passed to the page component as props
    };
  } catch (error) {
    return {
      props: { error: 'something went wrong' },
    };
  }
};

export default Home;
