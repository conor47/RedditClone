import Image from 'next/image';
import { useEffect, useState } from 'react';

import content from '../../content/tutorial';
import useLocalStorage from '../../hooks/useLocalStorage';

const Modal: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const updateIndex = (update: number) => {
    let newIndex = index + update;
    if (newIndex == -1) {
      newIndex = content.length - 1;
    }

    setIndex(newIndex % content.length);
  };

  useEffect(() => {
    const item = localStorage.getItem('showModal');
    if (!item) {
      setShowModal(true);
    }
  }, []);

  const closeModal = () => {
    setShowModal(false);
    localStorage.setItem('showModal', 'false');
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-10 flex items-center justify-center transition-all bg-black bg-opacity-30">
        <div className="relative z-20 flex items-center justify-center w-1/2 p-6 m-auto transition-all bg-white rounded-lg opacity-100 h-3/4">
          <i
            className="absolute w-6 text-lg text-center bg-white rounded-full cursor-pointer -top-2 fa-solid fa-x -right-2"
            onClick={closeModal}
          ></i>
          <i
            className="absolute w-8 text-lg text-center bg-white rounded-full cursor-pointer -right-2 fa-solid fa-arrow-right top-1/2"
            onClick={() => updateIndex(1)}
          ></i>
          <i
            className="absolute w-8 text-lg text-center bg-white rounded-full cursor-pointer -left-2 fa-solid fa-arrow-left top-1/2"
            onClick={() => updateIndex(-1)}
          ></i>
          <span className="absolute bottom-0">
            {index + 1}/{content.length}
          </span>
          <div className="flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-4xl">{content[index].title}</h1>
            <p>{content[index].text1}</p>
            {content[index].image && (
              <div className="my-6">
                <Image
                  src={content[index].image}
                  width="400"
                  height="200"
                  alt="placeholder"
                ></Image>
              </div>
            )}
            <p>{content[index].text2}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default Modal;
