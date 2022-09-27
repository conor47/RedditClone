import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, createRef, Fragment, useEffect, useState } from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';
import Image from 'next/image';
import classNames from 'classnames';
import dayjs from 'dayjs';

import Popup from '../../components/popup';
import { Sub } from '../../../types';
import { useAuthState } from '../../context/Auth';
import {
  useGlobalStateDispatch,
  useGlobalStateContext,
} from '../../context/GlobalState';
import Axios from 'axios';
import Sidebar from '../../components/SideBar';
import Link from 'next/link';
import axios from 'axios';

export default function SubPage() {
  // Local state
  const [ownSub, setOwnSub] = useState(false);
  // Global state
  const { authenticated, user } = useAuthState();
  const { showPopup, popup, popupMessage } = useGlobalStateContext();
  const globalDispatch = useGlobalStateDispatch();
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
    } catch (err) {}
  };

  const createSubscription = async (event: Event) => {
    if (!authenticated) {
      return;
    }

    await axios.post(`/subscriptions/${sub.name}`);
    mutate();
    showPopup(`Successfully joined r/${sub.name}`);
  };

  const deleteSubscription = async (event: Event) => {
    if (!authenticated) {
      return;
    }

    await axios.delete(`/subscriptions/${sub.name}`);
    mutate();
    showPopup(`Successfully left r/${sub.name}`);
  };

  if (error) router.push('/');

  let postsMarkup;
  if (!sub) {
    postsMarkup = <p className="text-lg text-center">Loading..</p>;
  } else if (sub.posts.length === 0) {
    postsMarkup = (
      <p className="text-lg text-center dark:text-white">
        No posts submitted yet
      </p>
    );
  } else {
    postsMarkup = sub.posts.map((post) => (
      <PostCard key={post.identifier} post={post} revalidate={mutate} />
    ));
  }

  let joinButtonMarkup;
  if (!authenticated) {
    joinButtonMarkup = (
      <Link href={'/login'}>
        <button className="w-20 h-8 mt-5 ml-5 mr-5 sm:mr-0 sm:mt-2 button black dark:bg-white dark:text-black transistion-all">
          Join
        </button>
      </Link>
    );
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
        className="w-20 h-8 mt-2 ml-5 transition-all button dark:bg-black dark:text-slate-50 dark:border-white"
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
              className={classNames('bg-blue-500 h-40 relative w-screen', {
                'cursor-pointer': ownSub,
              })}
              onClick={() => openFileInput('banner')}
            >
              {sub.bannerUrl ? (
                <Image
                  src={sub.bannerUrl}
                  layout="fill"
                  objectFit="cover"
                  alt="sub image"
                />
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
                    <h1 className="mb-1 text-3xl font-bold dark:text-slate-50">
                      {sub.title}
                    </h1>
                  </div>
                  <p className="hidden text-sm font-bold text-gray-500 sm:block">
                    /r/{sub.name}
                  </p>
                </div>
                {joinButtonMarkup}
              </div>
            </div>
          </div>
          {/* Posts & Sidebar */}
          <div className="px-2 mt-3 sm:hidden">
            <div className="transition-all bg-white rounded dark:bg-customDark">
              <div className="p-3 transition-all bg-blue-500 rounded-t dark:bg-customDark">
                <p className="font-semibold text-white ">About Community</p>
              </div>
              <div className="p-3">
                <p className="mb-3 text-base dark:text-slate-50">
                  {sub.description}
                </p>
                <div className="flex mb-3 text-sm font-medium">
                  <div className="w-1/2 dark:text-slate-50">
                    <p>{sub.subCount}</p>
                    <p>Members</p>
                  </div>
                  <div className="w-1/2 dark:text-slate-50">
                    <p>100</p>
                    <p>Online</p>
                  </div>
                </div>
                <p className="my-3 dark:text-slate-50">
                  <i className="mr-2 fas fa-birthday-cake"></i>
                  Created {dayjs(sub.createdAt).format('D MMM YYYY')}
                </p>
                <p className="my-3 dark:text-slate-50">
                  <i className="mr-2 fas fa-user"></i>
                  <Link href={`/u/${sub.username}`}>
                    <a className="">Owned by /u/{sub.username}</a>
                  </Link>
                </p>
                {authenticated ? (
                  <Link href={`/r/${sub.name}/submit`}>
                    <a className="w-full px-2 py-1 text-sm button blue">
                      Create Post
                    </a>
                  </Link>
                ) : (
                  <Link href={`/login`}>
                    <a className="w-full px-2 py-1 text-sm button blue">
                      Create Post
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="container flex pt-5">
            <div className="px-2 w-160 sm:px-0">{postsMarkup}</div>
            <Sidebar sub={sub} />
          </div>
        </Fragment>
      )}
      <Popup message={popupMessage} showPopup={popup} />
    </div>
  );
}
