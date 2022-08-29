import Link from 'next/link';
import { useState, useEffect } from 'react';
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

  const [showChildren, setShowChildren] = useState(true);

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.identifier}>
          <div>
            <CommentComponent
              comment={comment}
              post={post}
              mutateComment={mutateComment}
              mutatePost={mutatePost}
            />
          </div>
          {comment.children.length > 0 && (
            <button onClick={() => setShowChildren(!showChildren)}>
              Hide replies
            </button>
          )}
          <div
            className={classNames('ml-4 flex', {
              hidden: !showChildren,
            })}
          >
            {comment.children.length > 0 && (
              <>
                <div
                  onClick={() => setShowChildren(!showChildren)}
                  className="w-2 bg-slate-500"
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
        </div>
      ))}
    </div>
  );
};

export default ThreadedComment;
