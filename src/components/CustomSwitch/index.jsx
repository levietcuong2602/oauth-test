import React, { useState } from 'react';
import { StyledSwitch } from './index.style';

const CustomSwitch = ({ noneCheckedColor, checkedColor, onChange }) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setChecked(e.target.checked);
    if (onChange) onChange(e.target.checked);
  };

  return (
    <StyledSwitch
      noneCheckedColor={noneCheckedColor}
      checkedColor={checkedColor}
      checked={checked}
      onChange={handleChange}
    />
  );
};

export default CustomSwitch;
