import Link from 'next/link';
import { useState, useEffect, FormEvent } from 'react';
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
  const [replyComment, setReplyComment] = useState('');
  const [writingReply, setWritingReply] = useState(false);

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
    } catch (error) {}
  };

  const updateComment = async (e: Event) => {
    e.preventDefault();
    try {
      await axios.patch(`/comments/${comment.identifier}`, {
        body: updatedComment,
      }),
        setEditingComment('');
      mutateComment();
    } catch (err) {}
  };

  const submitReply = async (e: Event, parentId: string) => {
    e.preventDefault();

    if (replyComment === '') {
      return;
    }

    try {
      await axios.post(`/comments/${post.identifier}/${post.slug}`, {
        body: replyComment,
        parentId,
      });
      mutateComment();
      setWritingReply(false);
    } catch (error) {}
  };

  const deleteComment = async (e: Event, identifier: string) => {
    e.preventDefault();

    try {
      await axios.delete(`/comments/${identifier}`);
      mutateComment();
    } catch (error) {}
  };

  return (
    <div className="mb-4">
      {comment.body === null ? (
        <div className="text-sm dark:text-slate-50">{`Comment deleted by user • ${dayjs(
          comment.updatedAt
        ).fromNow()}`}</div>
      ) : (
        <div key={comment.identifier} className="flex">
          <div className="py-2 pl-1">
            <p className="mb-1 text-xs leading-none">
              <Link href={`/u/${comment.username}`}>
                <a className="mr-1 font-bold hover:underline dark:text-slate-50">
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
              <p className="dark:text-slate-50">{comment.body}</p>
            )}
            <div className="flex">
              {/* if user is logged and and same user as comment owner then display edit button */}
              <div>
                <div className="flex">
                  <div className="flex items-center justify-start flex-shrink-0 w-10 mt-2 mr-2 rounded-l">
                    <div
                      className="w-6 text-gray-400 transition-all rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
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
                        'text-xs font-bold dark:text-slate-50 transition-all mx-1',
                        {
                          'text-red-500': comment.userVote === 1,
                          'text-blue-500': comment.userVote === -1,
                        }
                      )}
                    >
                      {comment.voteScore}
                    </p>
                    <div
                      className="w-6 text-gray-400 transition-all rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
                      onClick={() => castVote(-1)}
                    >
                      <i
                        className={classNames('icon-arrow-down', {
                          'text-blue-600': comment.userVote === -1,
                        })}
                      ></i>
                    </div>
                  </div>
                  <div
                    className="flex"
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
                    {comment.ownsComment && (
                      <ActionButton>
                        <i className="mr-1 fas fa-pen"></i>
                        <span className="font-medium">Edit</span>
                      </ActionButton>
                    )}
                    {editingComment === comment.identifier && (
                      <button
                        onClick={(e) => updateComment(e.nativeEvent)}
                        className="px-3 py-1 blue button"
                        disabled={
                          updatedComment === comment.body ||
                          updatedComment === ''
                        }
                      >
                        Save edits
                      </button>
                    )}
                  </div>
                  <div
                    className="flex"
                    onClick={() => setWritingReply(!writingReply)}
                  >
                    <ActionButton>
                      <i className="mr-1 fas fa-message"></i>
                      <span className="font-medium">Reply</span>
                    </ActionButton>
                  </div>
                  <div
                    className="flex"
                    onClick={(e) =>
                      deleteComment(e.nativeEvent, comment.identifier)
                    }
                  >
                    {comment.ownsComment && (
                      <ActionButton>
                        <i className="mr-1 fas fa-message"></i>
                        <span className="font-medium">Delete</span>
                      </ActionButton>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {writingReply && (
              <div>
                <p>{`Reply to ${comment.username} as ${user.username}`}</p>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                  onChange={(e) => {
                    e.preventDefault();
                    setReplyComment(e.target.value);
                  }}
                  value={replyComment}
                  placeholder={'What are your thoughts ?'}
                ></textarea>
                <button
                  onClick={(e) =>
                    submitReply(e.nativeEvent, comment.identifier)
                  }
                  className="px-3 py-1 blue button"
                  disabled={replyComment === ''}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
