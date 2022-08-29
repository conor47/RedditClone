import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { Comment, Post } from '../../types';
import { useAuthState } from '../context/Auth';
import ActionButton from './ActionButton';
import axios from 'axios';

interface CommentProps {
  comment: Comment;
  post: Post;
  mutateComment: () => void;
  mutatePost: () => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  post,
  mutateComment,
  mutatePost,
}) => {
  const { authenticated, user } = useAuthState();
  const [editingComment, setEditingComment] = useState('');
  const [updatedComment, setUpdatedComment] = useState('');

  const router = useRouter();

  const castVote = async (value: number) => {
    // not logged in
    if (!authenticated) {
      router.push('/login');
    }

    // vote is the same
    if (comment.userVote === value) {
      value = 0;
    }
    try {
      // we pass the commentIdentifier. If this is null then it's value wont be included. This allows us to differentiate between voting on a post or comment
      const res = await axios.post('/votes/vote', {
        identifier: post.identifier,
        slug: post.slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      //   setNewComment('');
      if (comment) {
        mutateComment();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateComment = async (e: Event) => {
    e.preventDefault();
    try {
      await axios.patch(`/comments/${comment.identifier}`, {
        body: updatedComment,
      }),
        setEditingComment('');
      mutateComment();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="pl-10 pr-6 mb-4">
      <div key={comment.identifier} className="flex">
        <div className="flex flex-col items-center justify-start flex-shrink-0 w-10 rounded-l">
          <div
            className="w-6 mt-2 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
            onClick={() => castVote(1)}
          >
            <i
              className={classNames('icon-arrow-up', {
                'text-red-500': comment.userVote === 1,
              })}
            ></i>
          </div>
          <p
            className={classNames(
              'text-xs font-bold dark:text-white transition-all',
              {
                'text-red-500': comment.userVote === 1,
                'text-blue-500': comment.userVote === -1,
              }
            )}
          >
            {comment.voteScore}
          </p>
          <div
            className="w-6 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
            onClick={() => castVote(-1)}
          >
            <i
              className={classNames('icon-arrow-down', {
                'text-blue-600': comment.userVote === -1,
              })}
            ></i>
          </div>
        </div>
        <div className="py-2 pl-1">
          <p className="mb-1 text-xs leading-none">
            <Link href={`/u/${comment.username}`}>
              <a className="mr-1 font-bold hover:underline dark:text-white">
                {comment.username}
              </a>
            </Link>
            <span className="text-gray-600">{`${
              comment.voteScore
            } Points • ${dayjs(comment.createdAt).fromNow()}`}</span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-gray-600 dark:text-gray">
                {` - last edit : ${dayjs(comment.updatedAt).fromNow()}`}
              </span>
            )}
          </p>

          {editingComment === comment.identifier && editingComment !== '' ? (
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              onChange={(e) => setUpdatedComment(e.target.value)}
              value={updatedComment}
              placeholder={comment.body}
            ></textarea>
          ) : (
            <p className="dark:text-white">{comment.body}</p>
          )}
          <div className="flex">
            {/* if user is logged and and same user as comment owner then display edit button */}
            {user && user.username == comment.username && (
              <div
                onClick={() => {
                  setUpdatedComment(comment.body);
                  if (editingComment === '') {
                    setEditingComment(comment.identifier);
                  } else if (
                    editingComment !== '' &&
                    comment.identifier !== editingComment
                  ) {
                    setEditingComment(comment.identifier);
                  } else {
                    setEditingComment('');
                  }
                }}
              >
                <div className="flex">
                  <ActionButton>
                    <i className="mr-1 fas fa-pen"></i>
                    <span className="font-medium">Edit</span>
                  </ActionButton>
                  {editingComment === comment.identifier && (
                    <button
                      onClick={(e) => updateComment(e.nativeEvent)}
                      className="px-3 py-1 blue button"
                      disabled={
                        updatedComment === comment.body || updatedComment === ''
                      }
                    >
                      Save edits
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;