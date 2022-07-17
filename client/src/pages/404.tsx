import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="flex ">
        <h1 className="py-2 text-4xl ">Page not found</h1>
        <div className="w-0.5  mx-7 bg-gray-700"></div>
        <Link href="/">
          <a className="py-2 mb-1 text-3xl transition-all hover:underline">
            Home
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
