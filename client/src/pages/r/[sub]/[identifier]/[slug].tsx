import axios from 'axios';
import classNames from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { Post } from '../../../../../types';
import SideBar from '../../../../components/SideBar';
import { useAuthState } from '../../../../context/Auth';

const PostPage: React.FC = () => {
  const router = useRouter();
  const { authenticated } = useAuthState();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  if (error) {
    router.push('/');
  }

  const castVote = async (value: number) => {
    // note logged in
    if (!authenticated) {
      router.push('/login');
    }

    // vote is the same
    if (value === post.userVote) {
      value = 0;
    }
    try {
      const res = await axios.post('/votes/vote', {
        identifier: identifier,
        slug,
        value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {post && (
        <>
          <Head>
            <title>{post.title}</title>
          </Head>
          <Link href={`/r/${sub}`}>
            <a>
              <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                <div className="container flex">
                  {post && (
                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                      <Image
                        src={post.sub.imageUrl}
                        height={(8 * 16) / 4}
                        width={(8 * 16) / 4}
                        alt="post image"
                      />
                    </div>
                  )}
                  <p className="text-xl font-semibold text-white">/r/{sub}</p>
                </div>
              </div>
            </a>
          </Link>
          <div className="container flex pt-5">
            {/* Post  */}
            <div className="w-160">
              <div className="bg-white rounded">
                {post && (
                  <div className="flex">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center justify-start w-10 rounded-l">
                      <div
                        className="w-6 mt-2 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
                        onClick={() => castVote(1)}
                      >
                        <i
                          className={classNames('icon-arrow-up', {
                            'text-red-500': post.userVote === 1,
                          })}
                        ></i>
                      </div>
                      <p
                        className={classNames('text-xs font-bold ', {
                          'text-red-500': post.userVote === 1,
                          'text-blue-500': post.userVote === -1,
                        })}
                      >
                        {post.voteScore}
                      </p>
                      <div
                        className="w-6 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
                        onClick={() => castVote(-1)}
                      >
                        <i
                          className={classNames('icon-arrow-down', {
                            'text-blue-600': post.userVote === -1,
                          })}
                        ></i>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-gray-500">
                        Posted by
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
                  </div>
                )}
              </div>
            </div>
            {/* Sidebar */}
            <SideBar sub={post.sub} />
          </div>
        </>
      )}
    </div>
  );
};

export default PostPage;
