import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';

import { useAuthDispatch, useAuthState } from '../context/Auth';
import { Actions } from '../../types';

interface errorsState {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<errorsState>({});
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();

  const router = useRouter();

  if (authenticated) {
    router.push('/');
  }

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('auth/login', {
        password,
        username,
      });
      dispatch({ type: Actions.login, payload: res.data });
      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(error.response.data);
      }
      console.log(error);
    }
  };

  return (
    <div>
      <Head>
        <title> Login </title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <div className="flex bg-white">
        <div
          className="h-screen bg-center bg-cover w-36"
          style={{ backgroundImage: "url('/images/pattern.jpeg')" }}
        ></div>
        <div className="flex flex-col justify-center pl-6 ">
          <div className="min-w-90">
            <h1 className="mb-2 text-lg font-medium">Log In</h1>
            <p className="mb-10 text-xs">
              By Continuing, you agree to our User Agreement and Privacy Policy
            </p>
            <form onSubmit={submitForm}>
              <InputGroup
                placeholder="Username"
                type="text"
                value={username}
                className="mb-2"
                setValue={setUsername}
                error={errors.username}
              />
              <InputGroup
                placeholder="Password"
                type="password"
                value={password}
                className="mb-4"
                setValue={setPassword}
                error={errors.password}
              />
              <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                Sign In
              </button>
            </form>
            <small>
              New to Reddit ?
              <Link href={'/register'}>
                <a className="ml-1 text-blue-500 uppercase">Register</a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
