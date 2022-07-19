import { useRouter } from 'next/router';
import useSWR from 'swr';

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

  return <div></div>;
};

export default User;
