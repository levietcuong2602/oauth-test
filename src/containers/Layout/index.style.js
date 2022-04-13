import { styled } from '@mui/material/styles';
import { SIDEBAR_WIDTH, BORDER_RADIUS } from '@src/styles/config';

export const StyledLayout = styled('div')`
  display: flex;
  .main {
    flex: 1;
    overflow: hidden;
    padding: 15px 30px;
    margin-left: ${(props) =>
      props.collapsed ? '64px' : `${SIDEBAR_WIDTH}px`};
    transition: all 0.25s;
    transition-duration: 0.4s;
  }
  .navbar {
    margin-bottom: 20px;
    background: #fff;
    border-radius: ${BORDER_RADIUS};
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  }
`;
