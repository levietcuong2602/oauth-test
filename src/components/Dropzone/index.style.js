import { styled } from '@mui/material/styles';

export const StyledDropzone = styled('div')`
  .root {
    border: 1px dashed transparent;
  }
  .drag-active {
    opacity: 0.5;
    border: 1px dashed #b9b9c3;
    box-sizing: border-box;
  }
`;
