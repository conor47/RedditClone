import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';

interface errorsState {
  username?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<errorsState>({});

  const router = useRouter();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('auth/login', {
        password,
        username,
      });
      router.push('/home');
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

      <div className="flex">
        <div
          className="h-screen bg-center bg-cover w-36"
          style={{ backgroundImage: "url('/images/pattern.jpeg')" }}
        ></div>
        <div className="flex flex-col justify-center pl-6">
          <div className="w-min-70">
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
                <a href="" className="ml-1 text-blue-500 uppercase">
                  Register
                </a>
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
