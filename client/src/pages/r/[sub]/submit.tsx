import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import useSWR from 'swr';
import { Post, Sub } from '../../../../types';
import SideBar from '../../../components/SideBar';

const Submit: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const router = useRouter();
  const { sub: subName } = router.query;

  const {
    data: sub,
    error,
    mutate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  if (error) {
    router.push('/');
  }

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === '') {
      return;
    }
    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: subName,
      });
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="w-160">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 10, right: 10 }}
              >
                {title.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
              value={body}
              placeholder="Text (optional)"
              rows={4}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={title.trim() === ''}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {sub && <SideBar sub={sub} />}
    </div>
  );
};

// using server side rendering to check if the user is logged in with a valid token. If not we perform a redirect to the login page. This is one way of guarding the submit route
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    // extract the cookie header
    const cookie = req.headers.cookie;
    if (!cookie) {
      throw new Error('missing auth token');
    }
    // make a post request to the /auth/me endpoint passing along the cookie
    await axios.get('/auth/me', { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    console.log(error);
    // we return a 307 and perform a redirect to the login page
    res.writeHead(307, { location: '/login' }).end();
  }
};

export default Submit;
