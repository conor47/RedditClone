import { parseISOWithOptions } from 'date-fns/fp';
import Link from 'next/link';
import { useRouter } from 'next/router';
interface ProfilePageLayoutProps {
  children: JSX.Element[];
}

const ProfilePageLayout: React.FC = ({ children }: ProfilePageLayoutProps) => {
  const router = useRouter();
  const { username } = router.query;
  console.log('name', username);

  return (
    <>
      <div className="w-full h-10 bg-white border-gray-200 border-y">
        <div className="container flex">
          <Link href={`/u/${username}`}>overview</Link>
          <Link href={`/u/${username}/comments`}>comments</Link>
          <Link href={`/u/${username}/posts`}>posts</Link>
        </div>
      </div>

      <div>{children}</div>
    </>
  );
};

export default ProfilePageLayout;
