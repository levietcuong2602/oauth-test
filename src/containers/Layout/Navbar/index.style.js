import { MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledNavbar = styled('div')`
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .content-container {
    flex: 1;
  }
  .menu {
    transform: translateX(10px) translateY(50px);
  }
  .button {
    color: #fff;
    font-weight: bold;
  }
  .lang-btn {
    color: #000;
    min-width: 0;
  }
  .lang-text {
    font-size: 14px;
  }
  .content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .right-container {
    gap: 20px;
    margin-right: 20px;
  }
  .balance-box {
    margin-left: 30px;
    display: flex;
    flex-direction: row;
  }
  .text {
    color: #323232;
    size: 14px;
  }
  .title-text {
    margin-right: 5px;
  }
  .value-text {
    font-weight: bold;
  }
  .name-text {
    font-weight: bold;
  }
  .phone {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .phone-image {
    width: 18px;
    height: 18px;
  }
  .avatar-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    position: relative;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    position: absolute;
    right: 0;
    bottom: 0;
    background: #28c76f;
    border-radius: 50%;
    border: 2px solid #fff;
  }
  .avatar {
    width: 40px;
    height: 40px;
    font-weight: 500;
  }
  .profile-text {
    color: #6e6b7b;
  }
  .badge {
    color: #fff;
    background-color: #ea5455;
    width: 14px;
    height: 18px;
    border-radius: 50%;
    top: 0px;
    right: 0px;
  }
  .account {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .menu-item-icon {
    margin-right: 5px;
    min-width: 0;
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  .MuiSvgIcon-root {
    margin-right: 7px;
    font-size: 20px;
  }
  .MuiTypography-root {
    color: #6e6b7b;
    font-weight: 500;
  }
  .info-icon {
    color: #babfc7;
  }
  .logout-icon {
    color: #ea5455;
  }
`;
