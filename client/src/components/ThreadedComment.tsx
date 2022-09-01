import Link from 'next/link';
import { useState, useEffect, Children } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { Comment, Post } from '../../types';
import CommentComponent from './Comment';

interface CommentProps {
  comments: Comment[];
  post: Post;
  mutateComment: () => void;
  mutatePost: () => void;
}

const ThreadedComment: React.FC<CommentProps> = ({
  comments,
  post,
  mutateComment,
  mutatePost,
}) => {
  const router = useRouter();

  console.log('threaded', comments);

  const [showChildren, setShowChildren] = useState(true);

  return (
    <div className="px-10 py-2">
      {comments.map((comment) => (
        <>
          <div key={comment.identifier} className="relative">
            {!showChildren && comment.children.length > 0 && (
              <i
                className="absolute text-sm text-gray-400 rotate-90 cursor-pointer fa-solid fa-up-right-and-down-left-from-center top-1/3 -left-5"
                onClick={() => setShowChildren(!showChildren)}
              ></i>
            )}
            <CommentComponent
              comment={comment}
              post={post}
              mutateComment={mutateComment}
              mutatePost={mutatePost}
            />
          </div>
          {/* {comment.children.length > 0 && (
            <button
              onClick={() => setShowChildren(!showChildren)}
              className="text-sm text-gray-500"
            >
              {showChildren
                ? 'Hide replies'
                : `Show ${comment.children.length} replies`}
            </button>
          )} */}
          <div
            className={classNames('ml-1 flex transition-all', {
              hidden: !showChildren,
            })}
          >
            {comment.children.length > 0 && (
              <>
                <div
                  onClick={() => setShowChildren(!showChildren)}
                  className="w-1 mb-2 ml-1 transition-all bg-gray-100 cursor-pointer dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
                ></div>
                <ThreadedComment
                  post={post}
                  comments={comment.children}
                  mutateComment={mutateComment}
                  mutatePost={mutatePost}
                />
              </>
            )}
          </div>
        </>
      ))}
    </div>
  );
};

export default ThreadedComment;
