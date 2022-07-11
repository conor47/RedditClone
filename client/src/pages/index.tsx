import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { Post } from '../../types';

const Home: React.FC = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/posts');
        console.log(res);

        setPosts(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="pt-12">
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post: Post) => (
            <div key={post.identifier}>{post.title}</div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
};

export default Home;
