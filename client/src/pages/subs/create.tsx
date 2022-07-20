import Head from 'next/head';
import { useState } from 'react';

const Create: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Partial<any>>({});

  return (
    <div className="flex bg-white">
      <Head>
        <title>Create a community</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/pattern.jpeg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="98">
          <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
        </div>
      </div>
    </div>
  );
};

export default Create;
