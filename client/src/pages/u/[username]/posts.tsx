import { useRouter } from 'next/router';
import useSWR from 'swr';

import PostCard from '../../../components/PostCard';
import ProfilePageLayout from '../../../layouts/ProfilePageLayout';
import { Comment, Post } from '../../../../types';
import Link from 'next/link';

const Posts: React.FC = () => {
  const router = useRouter();

  const username = router.query.username;
  const { data, error, mutate } = useSWR<any>(
    username ? `/users/${username}` : null
  );

  if (error) {
    router.push('/');
  }

  if (data) {
  }
  return (
    <div className="container flex pt-5">
      <div className="w-160">
        {data &&
          data.submissions
            .filter((sub: any) => sub.type === 'post')
            .map((sub: any) => {
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
    </div>
  );
};

//@ts-ignore
Posts.layout = ProfilePageLayout;

export default Posts;
