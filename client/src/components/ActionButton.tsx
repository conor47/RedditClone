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
      className={`px-1 py-1 mr-1 text-xs text-gray-400 transition-all rounded cursor-pointer hover:bg-gray-200 ${
        selected ? 'text-blue-400' : ''
      }`}
    >
      {children}
    </div>
  );
};

export default ActionButton;
