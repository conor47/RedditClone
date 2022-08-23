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

import { Post, Comment } from '../../../../../types';
import SideBar from '../../../../components/SideBar';
import { useAuthState } from '../../../../context/Auth';
import ActionButton from '../../../../components/ActionButton';
import { FormEvent, useEffect, useState } from 'react';
const PostPage: React.FC = () => {
  const router = useRouter();
  const { authenticated, user } = useAuthState();
  // state for post editing
  const [editingPost, setEditingPost] = useState(false);
  const [updatedPost, setUpdatedPost] = useState('');
  // state for new comments and comment editing
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState('');
  const [updatedComment, setUpdatedComment] = useState('');
  const { identifier, sub, slug } = router.query;

  // fetch post
  const {
    data: post,
    error: postError,
    mutate: mutatePost,
  } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

  // fetch comments
  const {
    data: comments,
    error: commentError,
    mutate: mutateComment,
  } = useSWR<Comment[]>(
    identifier && slug ? `/comments/${identifier}/${slug}/comments` : null
  );

  console.log('comments', comments);

  if (postError) {
    router.push('/');
  }

  const castVote = async (value: number, comment?: Comment) => {
    // note logged in
    if (!authenticated) {
      router.push('/login');
    }

    // vote is the same
    if (
      (!comment && value === post.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }
    try {
      // we pass the commentIdentifier. If this is null then it's value wont be included. This allows us to differentiate between voting on a post or comment
      const res = await axios.post('/votes/vote', {
        identifier: identifier,
        slug,
        commentIdentifier: comment?.identifier,
        value,
      });
      setNewComment('');
      if (comment) {
        mutateComment();
      } else {
        mutatePost();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const submitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (newComment.trim() === '') {
      return;
    }

    try {
      await axios.post(`/comments/${post.identifier}/${post.slug}`, {
        body: newComment,
      });
      mutateComment();
      setNewComment('');
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (e: Event) => {
    e.preventDefault();
    try {
      await axios.patch(`/posts/${post.identifier}/${post.slug}`, {
        body: updatedPost,
      }),
        setEditingPost(false);
      mutatePost();
    } catch (err) {
      console.log(err);
    }
  };

  const updateComment = async (e: Event, identifier: String) => {
    e.preventDefault();
    try {
      await axios.patch(`/comments/${identifier}`, {
        body: updatedComment,
      }),
        setEditingComment('');
      mutateComment();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      {post && (
        <>
          <Head>
            <title>{post.title}</title>
          </Head>
          {/* banner */}
          <Link href={`/r/${sub}`}>
            <a>
              <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                <div className="container flex">
                  {post && (
                    <div className="w-8 h-8 mr-2 overflow-hidden rounded-full ">
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
          {/* Post  */}
          <div className="container flex pt-5">
            <div className="w-160">
              <div className="bg-white rounded">
                {post && (
                  <>
                    <div className="flex">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center justify-start flex-shrink-0 w-10 rounded-l">
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
                      <div className="py-2 pl-1">
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
                          {post.createdAt !== post.updatedAt && (
                            <span>
                              - last edit : {dayjs(post.updatedAt).fromNow()}
                            </span>
                          )}
                        </p>
                        {/* post title */}
                        <h1 className="my-1 text-xl font-medium">
                          {post.title}
                        </h1>
                        {/* post body */}
                        {editingPost ? (
                          <textarea
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            onChange={(e) => setUpdatedPost(e.target.value)}
                            value={updatedPost}
                            placeholder={post.body}
                          ></textarea>
                        ) : (
                          <p className="my-3 text-sm">{post.body}</p>
                        )}
                        {/* actions  */}
                        <div className="flex">
                          <Link href={post.url}>
                            <a>
                              <ActionButton>
                                <i className="mr-1 fas fa-comment-alt "></i>
                                <span className="font-bold">
                                  {post.commentCount}
                                </span>
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
                          {/* if the user is logged in and the post belongs to the user then display the button */}
                          {user && post.username === user.username && (
                            <div
                              onClick={() => {
                                setUpdatedPost(post.body);
                                setEditingPost(!editingPost);
                              }}
                            >
                              <ActionButton>
                                <i className="mr-1 fas fa-pen"></i>
                                <span className="font-medium">Edit</span>
                              </ActionButton>
                            </div>
                          )}
                          {editingPost && (
                            <button
                              onClick={(e) => updatePost(e.nativeEvent)}
                              className="px-3 py-1 blue button"
                              disabled={updatedPost === post.body}
                            >
                              Save edits
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Comment input */}
                    <div className="pl-10 pr-6 mb-4">
                      {authenticated ? (
                        <div>
                          <p className="mb-1 text-xs">
                            Comment as{' '}
                            <Link href={`/r/${user.username}`}>
                              <a className="font-semibold text-blue-500">
                                {user.username}
                              </a>
                            </Link>
                          </p>
                          <form onSubmit={submitComment}>
                            <textarea
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                              onChange={(e) => setNewComment(e.target.value)}
                              value={newComment}
                            ></textarea>
                            <div className="flex justify-end">
                              <button
                                className="px-3 py-1 blue button"
                                disabled={newComment.trim() === ''}
                              >
                                Comment
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                          <p className="font-semibold text-gray-400">
                            Log in or Sign up to leave a comment !
                          </p>
                          <div>
                            <Link href="/login">
                              <a className="w-24 px-2 py-2 mr-1 hollow blue button w-30">
                                Login
                              </a>
                            </Link>
                            <Link href="/register">
                              <a className="w-24 px-2 py-2 blue button">
                                Register
                              </a>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                    <hr />
                    {/* comments*/}
                    {comments &&
                      comments.map((comment) => (
                        <div key={comment.identifier} className="flex">
                          <div className="flex flex-col items-center justify-start flex-shrink-0 w-10 rounded-l">
                            <div
                              className="w-6 mt-2 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500 hover:bg-transparent"
                              onClick={() => castVote(1, comment)}
                            >
                              <i
                                className={classNames('icon-arrow-up', {
                                  'text-red-500': comment.userVote === 1,
                                })}
                              ></i>
                            </div>
                            <p
                              className={classNames('text-xs font-bold ', {
                                'text-red-500': comment.userVote === 1,
                                'text-blue-500': comment.userVote === -1,
                              })}
                            >
                              {comment.voteScore}
                            </p>
                            <div
                              className="w-6 text-gray-400 transition-all translate-x-1 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-500 hover:bg-transparent"
                              onClick={() => castVote(-1, comment)}
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
                                <a className="mr-1 font-bold hover:underline">
                                  {comment.username}
                                </a>
                              </Link>
                              <span className="text-gray-600">{`${
                                comment.voteScore
                              } Points • ${dayjs(
                                comment.createdAt
                              ).fromNow()}`}</span>
                              {comment.createdAt !== comment.updatedAt && (
                                <span className="text-gray 600">
                                  {` - last edit : ${dayjs(
                                    comment.updatedAt
                                  ).fromNow()}`}
                                </span>
                              )}
                            </p>

                            {editingComment === comment.identifier &&
                            editingComment !== '' ? (
                              <textarea
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                onChange={(e) =>
                                  setUpdatedComment(e.target.value)
                                }
                                value={updatedComment}
                                placeholder={comment.body}
                              ></textarea>
                            ) : (
                              <p>{comment.body}</p>
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
                                        onClick={(e) =>
                                          updateComment(
                                            e.nativeEvent,
                                            comment.identifier
                                          )
                                        }
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
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </>
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
