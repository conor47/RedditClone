import Image from 'next/image';

const ImageOfTheDay: React.FC = () => {
  return (
    <div className="mt-2 rounded w-80 bg-gray-50 h-160">
      <div className="p-4 border-b-2">
        <p className="text-lg font-semibold text-center">Image of the day</p>
      </div>
      <Image
        src={'https://api.unsplash.com/photos/random'}
        alt="Image of the day"
      />
    </div>
  );
};

export default ImageOfTheDay;
