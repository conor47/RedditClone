import { useState } from 'react';

const Modal: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  const closeModal = () => {
    setShowModal(!showModal);
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center transition-all bg-black bg-opacity-30">
        <div className="relative z-20 w-1/2 m-auto transition-all bg-white rounded-lg opacity-100 h-3/4">
          <i
            className="absolute w-6 text-lg text-center bg-white rounded-full cursor-pointer -top-2 fa-solid fa-x -right-2"
            onClick={closeModal}
          ></i>
          <i className="absolute w-8 text-lg text-center bg-white rounded-full cursor-pointer -right-2 fa-solid fa-arrow-right top-1/2"></i>
          <i className="absolute w-8 text-lg text-center bg-white rounded-full cursor-pointer -left-2 fa-solid fa-arrow-left top-1/2"></i>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Modal;
