import classNames from 'classnames';
import { useState } from 'react';

interface PopupProps {
  message: string;
  showPopup: boolean;
}

const Popup: React.FC<PopupProps> = ({ message, showPopup }) => {
  console.log('showing popup component', showPopup);

  return (
    <div
      //   hidden={!showPopup}
      className={classNames(
        'fixed  bg-white text-black py-2 px-3 border-2 border-black shadow0 mx-auto inset-x-1/3 flex transition-all -bottom-12 cursor-pointer',
        {
          'bottom-14 ': showPopup,
        }
      )}
    >
      <i className="mr-2 text-xl text-red-500 fa-brands fa-reddit"></i>
      <div>{message}</div>
    </div>
  );
};

export default Popup;
