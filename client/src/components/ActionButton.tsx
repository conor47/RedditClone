import React from 'react';
import { Filters } from '../../types';

interface ActionButtonProps {
  children?: React.ReactNode;
  selected?: boolean;
  type?: Filters;
  clickHandler?: (e: Event, type: Filters) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  selected,
  clickHandler,
  type,
}) => {
  return (
    <div
      onClick={(e) => clickHandler(e.nativeEvent, type)}
      className={`px-2 py-2 mr-1 text-xs text-gray-400 transition-all cursor-pointer hover:bg-gray-200 rounded-xl ${
        selected ? 'text-blue-500 bg-gray-200 rounded-xl' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default ActionButton;
