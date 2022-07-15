import { useRouter } from 'next/router';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';

const Sub: React.FC = () => {
  const router = useRouter();

  const subName = router.query.sub;
  console.log('router obj ---------', subName);

  const {
    data: sub,
    error,
    isValidating,
  } = useSWR(subName ? `subs/${subName}` : null);

  if (error) {
    router.push('/');
  }

  let postsMarkup;

  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading ...</p>;
  } else if (sub.posts.length < 1) {
    postsMarkup = <p className="text-lg text-center">It looks empty ...</p>;
  } else {
    postsMarkup = sub.posts.map((post) => {
      return <PostCard key={post.identifier} post={post} />;
    });
  }
  return (
    <div className="container flex pt-5">
      <div className="w-160">{postsMarkup}</div>
      {sub && <SideBar sub={sub} />}
    </div>
  );
};

export default Sub;
