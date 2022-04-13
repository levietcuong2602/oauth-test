import React, { useState } from 'react';

import { StyledDropzone } from './index.style';

const Dropzone = (props) => {
  const { className, children, onDrop: handleAddFiles } = props;

  const [dragging, setDragging] = useState(false);

  const onDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const onDrop = (event) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (files && files.length) {
      handleAddFiles(Array.from(files));
    }
    setDragging(false);
  };

  return (
    <StyledDropzone>
      <div
        className={`root ${className !== undefined && className} ${
          dragging && 'drag-active'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {children}
      </div>
    </StyledDropzone>
  );
};

export default Dropzone;
