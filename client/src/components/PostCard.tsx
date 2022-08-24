import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';

import ActionButton from './ActionButton';
import { Post } from '../../types';
import axios from 'axios';
import { useAuthState } from '../context/Auth';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
  revalidate?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post: {
    identifier,
    voteScore,
    title,
    body,
    subName,
    createdAt,
    slug,
    userVote,
    username,
    url,
    commentCount,
    sub,
  },
  revalidate,
}) => {
  const { authenticated, user } = useAuthState();
  const router = useRouter();

  const isInSubPage = router.pathname === '/r/[sub]';

  const castVote = async (value: number) => {
    if (!authenticated) {
      router.push('/login');
    }

    if (value === userVote) {
      value = 0;
    }

    try {
      const res = await axios.post('/votes/vote', {
        identifier: identifier,
        slug,
        value,
      });
      if (revalidate) {
        revalidate();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      key={identifier}
      className="flex mb-4 transition-all bg-white rounded dark:bg-slate-900"
      id={identifier}
    >
      {/* vote section */}
      <div className="flex flex-col items-center justify-start w-10 transition-all bg-gray-200 rounded-l dark:bg-slate-900">
        <div
          className="w-6 mt-2 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
          onClick={() => castVote(1)}
        >
          <i
            className={classNames('icon-arrow-up', {
              'text-red-500': userVote === 1,
            })}
          ></i>
        </div>
        <p
          className={classNames(
            'text-xs font-bold dark:text-white transition-all',
            {
              'text-red-500': userVote === 1,
              'text-blue-500': userVote === -1,
            }
          )}
        >
          {voteScore}
        </p>
        <div
          className="w-6 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
          onClick={() => castVote(-1)}
        >
          <i
            className={classNames('icon-arrow-down', {
              'text-blue-600': userVote === -1,
            })}
          ></i>
        </div>
      </div>
      {/* data */}
      <div className="w-full p-2">
        <div className="flex items-center ">
          {!isInSubPage && (
            <>
              <Link href={`/r/${subName}`}>
                <Image
                  src={sub.imageUrl}
                  alt="placeholder gravatar"
                  height="24px"
                  width="24px"
                  className="rounded-full cursor-pointer"
                />
              </Link>
              <Link href={`/r/${subName}`}>
                <a className="ml-1 text-xs font-semibold transition-all hover:underline dark:text-white">
                  /r/{subName}
                </a>
              </Link>
              <span className="mx-1 text-xs text-gray-500 transition-all dark:text-white">
                •
              </span>{' '}
              <span className="text-xs transition-all dark:text-white">
                Posted by
              </span>
            </>
          )}
          <p className="text-xs text-gray-500">
            <Link href={`/u/${username}`}>
              <a href="" className="mx-1 hover:underline">
                {username}
              </a>
            </Link>
            <Link href={url}>
              <a className="mx-1 hover:underline">
                {dayjs(createdAt).fromNow()}
              </a>
            </Link>
          </p>
        </div>
        <Link href={url}>
          <a
            href=""
            className="my-1 text-lg font-medium transition-all dark:text-white"
          >
            {title}
          </a>
        </Link>
        {body && (
          <p className="my-1 text-sm transition-all dark:text-white">
            {body.length < 100 ? body : body.substring(0, 150) + ' ...'}
          </p>
        )}
        <div className="flex">
          <Link href={url}>
            <a>
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt "></i>
                <span className="font-bold">{commentCount}</span>
              </ActionButton>
            </a>
          </Link>

          <ActionButton>
            <i className="mr-1 fas fa-share"></i>
            <span className="font-medium">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark "></i>
            <span className="font-medium">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
// test
