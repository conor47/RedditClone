import { parseISOWithOptions } from 'date-fns/fp';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
interface ProfilePageLayoutProps {
  children: JSX.Element[];
}

const ProfilePageLayout: React.FC = ({ children }: ProfilePageLayoutProps) => {
  const router = useRouter();
  const { username } = router.query;
  const paths = router.asPath.split('/');
  const path = paths[paths.length - 1];
  console.log('path', path);

  console.log('name', username);

  return (
    <>
      <div className="flex items-center justify-center w-full h-10 leading-9 bg-white border-gray-200 border-y">
        <div className="container flex h-full">
          <Link href={`/u/${username}`}>
            <span
              className={classNames(
                'px-2 text-center cursor-pointer transition-all',
                {
                  'text-blue-300  border-b-blue-300 border-b-2':
                    path === username,
                }
              )}
            >
              Overview
            </span>
          </Link>
          <Link href={`/u/${username}/comments`}>
            <span
              className={classNames(
                'px-2 text-center cursor-pointer transition-all h-full',
                {
                  'text-blue-300 border-b-blue-300 border-b-2':
                    path === 'comments',
                }
              )}
            >
              Comments
            </span>
          </Link>
          <Link href={`/u/${username}/posts`}>
            <span
              className={classNames(
                'px-2 text-center cursor-pointer transition-all',
                {
                  'text-blue-300 border-b-blue-300 border-b-2':
                    path === 'posts',
                }
              )}
            >
              Posts
            </span>
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </>
  );
};

export default ProfilePageLayout;
