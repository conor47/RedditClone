import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChangeEvent, Fragment, useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import classNames from 'classnames';

import PostCard from '../../components/PostCard';
import SideBar from '../../components/SideBar';
import { Sub } from '../../../types';
import Image from 'next/image';
import { useAuthState } from '../../context/Auth';
import axios from 'axios';

const Sub: React.FC = () => {
  const { authenticated, user } = useAuthState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ownSub, setOwnSub] = useState(false);
  const router = useRouter();

  const subName = router.query.sub;
  const {
    data: sub,
    error,
    isValidating,
  } = useSWR<Sub>(subName ? `subs/${subName}` : null);

  useEffect(() => {
    if (!sub) {
      return;
    }
    setOwnSub(authenticated && user.username === sub.username);
  }, [sub]);

  if (error) {
    router.push('/');
  }

  const openFileInput = (type: string): void => {
    if (!ownSub) {
      return;
    }
    fileInputRef.current.name = type;
    fileInputRef.current.click();
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current.type);

    try {
      const res = await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data ' },
      });
    } catch (error) {
      console.log(error);
    }
  };

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
            {/* banner image */}
            <div
              className={classNames('bg-blue-500', {
                'cursor-pointer': ownSub,
              })}
              onClick={() => openFileInput('banner')}
            >
              {sub.bannerUrl ? (
                <div
                  className="h-56 "
                  style={{
                    backgroundImage: `url(${sub.bannerUrl})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                ></div>
              ) : (
                <div className="h-20 bg-blue-500"></div>
              )}
            </div>
            {/* Sub meta data */}
            <div className="h-20 bg-white">
              <div className="container relative flex">
                <div className="absolute" style={{ top: -15 }}>
                  <Image
                    src={sub.imageUrl}
                    alt="Sub"
                    width={70}
                    height={70}
                    className={classNames('rounded-full', {
                      'cursor-pointer': ownSub,
                    })}
                    onClick={() => openFileInput('image')}
                  />
                </div>
                <div className="pt-1 pl-24">
                  <div className="flex items-center">
                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                  </div>
                  <p className="text-sm font-bold text-grey-500">
                    /r/{sub.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Posts and Sidebar */}
          <div className="container flex pt-5">
            <div className="w-160">{postsMarkup}</div>
            <SideBar sub={sub} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default Sub;
