import dayjs from 'dayjs';
import Link from 'next/link';
import { Sub } from '../../types';
import { useAuthState } from '../context/Auth';

interface SideBarProps {
  sub: Sub;
}

const SideBar: React.FC<SideBarProps> = ({ sub }) => {
  const { authenticated } = useAuthState();

  return (
    <div className="ml-6 w-80">
      <div className="transition-all bg-white rounded dark:bg-slate-900">
        <div className="p-3 transition-all bg-blue-500 rounded-t dark:bg-slate-900">
          <p className="font-semibold text-white ">About Community</p>
        </div>
        <div className="p-3">
          <p className="mb-3 text-base dark:text-white">{sub.description}</p>
          <div className="flex mb-3 text-sm font-medium">
            <div className="w-1/2 dark:text-white">
              <p>5.2k</p>
              <p>Members</p>
            </div>
            <div className="w-1/2 dark:text-white">
              <p>100</p>
              <p>Online</p>
            </div>
          </div>
          <p className="my-3 dark:text-white">
            <i className="mr-2 fas fa-birthday-cake"></i>
            Created {dayjs(sub.createdAt).format('D MMM YYYY')}
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
  );
};

export default SideBar;
