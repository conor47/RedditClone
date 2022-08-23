import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import ProfilePageLayout from '../../layouts/ProfilePageLayout';
import { Comment, Post } from '../../../types';
import PostCard from '../../components/PostCard';

dayjs.extend(relativeTime);

const User: React.FC = () => {
  const router = useRouter();

  const username = router.query.username;
  const { data, error, mutate } = useSWR<any>(
    username ? `/users/${username}` : null
  );

  if (error) {
    router.push('/');
  }

  if (data) {
    console.log(data);
  }

  return (
    <>
      <Head>{data?.user.username}</Head>
      {data && (
        <div className="container flex pt-5">
          <div className="w-160">
            {data.submissions.map((sub: any) => {
              if (sub.type === 'post') {
                const post: Post = sub;

                return <PostCard key={post.identifier} post={post} />;
              } else {
                const comment: Comment = sub;
                return (
                  <div
                    key={comment.identifier}
                    className="flex my-4 bg-white rounded"
                  >
                    <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                      <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                    </div>
                    <div className="w-full p-2">
                      <p className="mb-2 text-xs text-gray-500">
                        {comment.username}
                        <span> commented on </span>
                        <Link href={comment.post.url}>
                          <a className="font-semibold hover:underline cursor:pointer">
                            {comment.post.title}
                          </a>
                        </Link>
                        <span className="mx-1">•</span>
                        <Link href={`/r/${comment.post.subName}`}>
                          <a className="text-black hover:underline cursor:pointer">
                            /r/{comment.post.subName}
                          </a>
                        </Link>
                      </p>
                      <hr />
                      <p>{comment.body}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="ml-6 w-80">
            <div className="bg-white rounded">
              <div className="p-3 bg-blue-500 rounded-t">
                <div className="relative w-16 h-16 mx-auto border-2 border-white rounded-full">
                  <Image
                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y/"
                    alt="user photo"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="p-3 text-center">
                <h1 className="mb-3 text-xl text-center">
                  {data.user.username}
                </h1>
                <hr />
                <p className="mt-3">
                  Joined {dayjs(data.user.createdAt).format('MMM YYYY')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

//@ts-ignore
User.layout = ProfilePageLayout;

export default User;
