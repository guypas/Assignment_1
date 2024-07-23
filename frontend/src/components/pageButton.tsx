import React from 'react';

interface PageButtonProps {
  value: number;
  showButton: boolean;
  onButtonClick: () => void;
  className: string;
}

const PageButton: React.FC<PageButtonProps> = ({ value, showButton, onButtonClick, className }) => {
  if (!showButton) return null;

  return (
    <div className={className}>
      <button name={'page-' + value} onClick={onButtonClick}>
        {value}
      </button>
    </div>
  );
}

export default PageButton;