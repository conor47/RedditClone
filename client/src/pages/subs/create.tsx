import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

const Create: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<any>>({});
  const router = useRouter();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/subs', { name, title, description });
      router.push(`/r/${res.data.name}`);
    } catch (error) {
      console.log(error);
      setErrors(error.response.data);
    }
  };

  return (
    <div className="flex transition-all bg-white dark:bg-black">
      <Head>
        <title>Create a community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/pattern.jpeg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6 transition-all dark:text-slate-50">
        <div className="98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
          <hr />
          <form onSubmit={(e) => submitForm(e)}>
            <div className="my-6">
              <p className="font-medium">Name</p>
              <p className="mb-2 text-xs text-gray-500 dark:text-slate-50">
                Community names including capitalization cannot be changed.
              </p>
              <input
                type="text"
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-blue-300 outline-none focus:border-blue-500 dark:text-black',
                  { 'border-red-600': errors.name }
                )}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Community name"
              />
              <small className="font-medium text-red-600">{errors.name}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Title</p>
              <p className="mb-2 text-xs text-gray-500 dark:text-slate-50">
                Give your community an interesting title. Can be changed at any
                time.
              </p>
              <input
                type="text"
                className={classNames(
                  'w-full p-3 border border-gray-200 rounded hover:border-blue-300 outline-none focus:border-blue-500 dark:text-black',
                  { 'border-red-600': errors.title }
                )}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Community title"
              />
              <small className="font-medium text-red-600">{errors.title}</small>
            </div>
            <div className="my-6">
              <p className="font-medium">Description</p>
              <p className="mb-2 text-xs text-gray-500 dark:text-slate-50">
                This is how new members come to understand what your community
                is about !
              </p>
              <textarea
                className="w-full p-3 border border-gray-200 rounded outline-none hover:border-blue-300 focus:border-blue-300 dark:text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Community description"
              />
              <small className="font-medium text-red-600">
                {errors.description}
              </small>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 text-lg capitalize font-sm blue button">
                Create Community
              </button>
            </div>
          </form>
        </div>
      </div>
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

export default Create;
