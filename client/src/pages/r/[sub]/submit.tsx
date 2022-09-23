import axios from 'axios';
import classNames from 'classnames';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, createRef, FormEvent, useState } from 'react';
import useSWR from 'swr';

import { Post, Sub } from '../../../../types';
import SideBar from '../../../components/SideBar';

const Submit: React.FC = () => {
  const [textTitle, setTextTitle] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [tab, setTab] = useState(0);
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const fileInputRef = createRef<HTMLInputElement>();

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

  const submitTextPost = async (e: FormEvent) => {
    e.preventDefault();

    if (textTitle.trim() === '') {
      return;
    }
    try {
      const { data: post } = await axios.post<Post>('/posts/textPost', {
        title: textTitle.trim(),
        body,
        sub: subName,
      });
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (error) {
      console.log(error);
    }
  };

  const submitImagePost = async (e: FormEvent) => {
    e.preventDefault();
    setDisableSubmit(true);
    if (imageTitle.trim() === '') {
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);
    formData.append('title', imageTitle);
    formData.append('sub', subName as string);

    try {
      const { data: post } = await axios.post<Post>(
        `/posts/imagePost`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setDisableSubmit(false);
      router.push(`/r/${sub.name}/${post.identifier}/${post.slug}`);
    } catch (err) {
      console.log(err);
    }
  };

  const changeTab = (e: Event, newTab) => {
    e.preventDefault();
    setTab(newTab);
  };

  const storeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="container flex pt-5">
      <Head>
        <title>Submit to Reddit</title>
      </Head>
      <div className="w-160">
        <div className="flex p-2 mb-2 transition-all bg-white rounded dark:bg-customDark dark:text-white">
          <div
            className={classNames('mr-4 cursor-pointer transition-all ', {
              'text-blue-500': tab === 0,
            })}
            onClick={(e) => changeTab(e.nativeEvent, 0)}
          >
            Text
          </div>
          <div
            onClick={(e) => changeTab(e.nativeEvent, 1)}
            className={classNames('mr-4 cursor-pointer transition-all ', {
              'text-blue-500': tab === 1,
            })}
          >
            Image
          </div>
        </div>
        <div
          className="p-4 bg-white rounded dark:bg-customDark dark:text-slate-50"
          hidden={tab !== 0}
        >
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitTextPost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600 dark:text-black"
                placeholder="Title"
                onChange={(e) => setTextTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 10, right: 10 }}
              >
                {textTitle.trim().length}/300
              </div>
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600 dark:text-black"
              value={body}
              placeholder="Text (optional)"
              rows={4}
              onChange={(e) => setBody(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={textTitle.trim() === '' || disableSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
        {/* image tab */}
        <div
          className="p-4 bg-white rounded dark:bg-customDark dark:text-slate-50"
          hidden={tab !== 1}
        >
          <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
          <form onSubmit={submitImagePost}>
            <div className="relative mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-600 dark:text-black"
                placeholder="Title"
                onChange={(e) => setImageTitle(e.target.value)}
              />
              <div
                className="absolute mb-2 text-sm text-gray-500 select-none"
                style={{ top: 10, right: 10 }}
              >
                {imageTitle.trim().length}/300
              </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={storeFile} />
            <div className="flex justify-end mt-2">
              <button
                className="px-3 py-1 blue button"
                type="submit"
                disabled={imageTitle.trim() === '' || disableSubmit}
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
