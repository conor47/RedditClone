import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import Image from 'next/image';
import classNames from 'classnames';

import { Sub } from '../../../types';
import { useAuthState } from '../../context/Auth';
import Axios from 'axios';
import Sidebar from '../../components/SideBar';
import Link from 'next/link';
import axios from 'axios';

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  // Utils
  const router = useRouter();
  const fileInputRef = createRef<HTMLInputElement>();

  const subName = router.query.sub;

  const {
    data: sub,
    error,
    mutate,
  } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

  useEffect(() => {
    if (!sub) return;
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    fileInputRef.current.name = type;
    fileInputRef.current.click();
    console.log('file ref');
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.name);

    try {
      await Axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

  const createSubscription = async (event: Event) => {
    if (!authenticated) {
      return;
    }

    await axios.post(`/subscriptions/${sub.name}`);
    mutate();
  };

  const deleteSubscription = async (event: Event) => {
    if (!authenticated) {
      return;
    }

    await axios.delete(`/subscriptions/${sub.name}`);
    mutate();
  };

  if (error) router.push('/');

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading..</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = <p className="text-lg text-center">No posts submitted yet</p>;
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} revalidate={mutate} />
    ));
  }

  let joinButtonMarkup;
  if (!authenticated) {
    joinButtonMarkup = <Link href={'/login'}>Join</Link>;
  } else if (sub && !sub.isSubscribed) {
    joinButtonMarkup = (
      <button
        className="w-20 h-8 mt-2 ml-5 button black dark:bg-white dark:text-black transistion-all"
        onClick={(e) => createSubscription(e.nativeEvent)}
      >
        Join
      </button>
    );
  } else {
    joinButtonMarkup = (
      <button
        className="w-20 h-8 mt-2 ml-5 transition-all button dark:bg-black dark:text-white dark:border-white"
        onClick={(e) => deleteSubscription(e.nativeEvent)}
      >
        Leave
      </button>
    );
  }

  return (
    <div>
      <Head>
        <title>{sub?.title}</title>
      </Head>
      {sub && (
        <Fragment>
          <input
            type="file"
            hidden={true}
            ref={fileInputRef}
            onChange={uploadImage}
          />
          {/* Sub info and images */}
          <div>
            {/* Banner image */}
            <div
              className={classNames('bg-blue-500', {
                'cursor-pointer': ownSub,
              })}
              onClick={() => openFileInput('banner')}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 bg-blue-500 "
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500 dark:bg-black"></div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white dark:bg-black">
              <div className="container relative flex">
                <div
                  className="absolute w-20 h-20 border-2 borer-white dark:border-black"
                  style={{
                    top: -15,
                    borderRadius: '9999px',
                  }}
                >
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    layout="fill"
                    className={classNames('rounded-full border-2', {
                      'cursor-pointer': ownSub,
                    })}
                    onClick={() => openFileInput('image')}
                    width={70}
                    height={70}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold dark:text-white">
                      {sub.title}
                    </h1>
                  </div>
                  <p className="text-sm font-bold text-gray-500">
                    /r/{sub.name}
                  </p>
                </div>
                {joinButtonMarkup}
              </div>
            </div>
          </div>
          {/* Posts & Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postsMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </Fragment>
      )}
    </div>
  );
}
