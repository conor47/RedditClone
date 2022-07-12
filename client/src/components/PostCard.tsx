import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import ActionButton from './ActionButton';
import gravatar from '../../public/images/defaultGravatar.jpg';
import { Post } from '../../types';

dayjs.extend(relativeTime);

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
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
              <ActionButton>
                <i className="mr-1 fas fa-comment-alt "></i>
                <span className="font-bold">20 comments</span>
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
