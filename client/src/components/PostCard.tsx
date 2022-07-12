import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ActionButton from './ActionButton';
import gravatar from '../../public/images/defaultGravatar.jpg';
import { Post } from '../../types';
import axios from 'axios';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
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
  },
}) => {
  const castVote = async (value: number) => {
    try {
      const res = await axios.post('/votes/vote', {
        identifier: identifier,
        slug,
        value,
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div key={identifier} className="flex mb-4 bg-white rounded">
      {/* vote section */}

      <div className="flex flex-col items-center justify-start w-10 bg-gray-200 rounded-l">
        <div
          className="w-6 mt-2 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
          onClick={() => castVote(1)}
        >
          <i className="icon-arrow-up"></i>
        </div>
        <p className="text-xs font-bold">{voteScore}</p>
        <div
          className="w-6 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
          onClick={() => castVote(-1)}
        >
          <i className="icon-arrow-down"></i>
        </div>
      </div>
      {/* data */}
      <div className="w-full p-2">
        <div className="flex items-center">
          <Link href={`/r/${subName}`}>
            <Image
              src={gravatar}
              alt="placeholder gravatar"
              height="24px"
              width="24px"
              className="rounded-full cursor-pointer"
            />
          </Link>
          <Link href={`/r/${subName}`}>
            <a className="text-xs font-bold hover:underline">/r/{subName}</a>
          </Link>
          <p className="text-xs text-gray-500">
            <span className="mx-1">•</span> Posted by
            <Link href={`/u/user`}>
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
          <a href="" className="my-1 text-lg font-medium">
            {title}
          </a>
        </Link>
        {body && <p className="my-1 text-sm">{body}</p>}
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
            <span className="font-bold">Share</span>
          </ActionButton>
          <ActionButton>
            <i className="mr-1 fas fa-bookmark "></i>
            <span className="font-bold">Save</span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
