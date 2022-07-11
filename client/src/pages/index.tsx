import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../../types';
import gravatar from '../../public/images/defaultGravatar.jpg';
import { GetServerSideProps } from 'next';

dayjs.extend(relativeTime);

interface HomeProps {
  posts: Post[];
}

const Home: React.FC<HomeProps> = ({ posts }) => {
  // const [posts, setPosts] = useState([]);

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
            <div key={post.identifier} className="flex mb-4 bg-white rounded">
              {/* vote section */}
              <div className="flex items-center justify-center w-10 bg-gray-200 rounded-l">
                <p>V</p>
              </div>
              {/* post data */}
              <div className="w-full p-2">
                <div className="flex items-center">
                  <Link href={`/r/${post.subName}`}>
                    <Image
                      src={gravatar}
                      alt="placeholder gravatar"
                      height="24px"
                      width="24px"
                      className="rounded-full cursor-pointer"
                    />
                  </Link>
                  <Link href={`/r/${post.subName}`}>
                    <a className="text-xs font-bold hover:underline">
                      /r/{post.subName}
                    </a>
                  </Link>
                  <p className="text-xs text-gray-500">
                    <span className="mx-1">•</span> Posted by
                    <Link href={`/u/user`}>
                      <a href="" className="mx-1 hover:underline">
                        {post.username}
                      </a>
                    </Link>
                    <Link href={post.url}>
                      <a className="mx-1 hover:underline">
                        {dayjs(post.createdAt).fromNow()}
                      </a>
                    </Link>
                  </p>
                </div>
                <Link href={post.url}>
                  <a href="" className="my-1 text-lg font-medium">
                    {post.title}
                  </a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}
                <div className="flex">
                  <Link href={post.url}>
                    <a>
                      <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-comment-alt "></i>
                        <span className="font-bold">20 comments</span>
                      </div>
                    </a>
                  </Link>

                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-share"></i>
                    <span className="font-bold">Share</span>
                  </div>
                  <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                    <i className="mr-1 fas fa-bookmark "></i>
                    <span className="font-bold">Save</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Sidebar */}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await axios.get('/posts');
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
