import React from 'react';

interface NavigationButtonProps {
  value: string;
  disable: boolean;
  onNavigationClick: () => void;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ value, disable, onNavigationClick}) => {
  return (
    <div className="navigation">
      <button name={value} onClick={onNavigationClick} disabled={disable}>
        {value}
      </button>
    </div>
  );
}

export default NavigationButton;