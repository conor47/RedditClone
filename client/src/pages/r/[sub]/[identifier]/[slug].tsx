import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { Post } from '../../../../../types';

const PostPage: React.FC = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;

  const { data: post, error } = useSWR<Post>(
    identifier && slug ? `/posts/${identifier}/${slug}` : null
  );

  if (error) {
    router.push('/');
  }

  return (
    <div>
      {post && (
        <>
          <Head>
            <title>{post.title}</title>
          </Head>
          <Link href={`/r/${sub}`}>
            <a>
              <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                <div className="container flex">
                  {post && <div className="mr-2 rounded-full">
                    <Image 
                    </div>}
                </div>
              </div>
            </a>
          </Link>
        </>
      )}
    </div>
  );
};

export default PostPage;
