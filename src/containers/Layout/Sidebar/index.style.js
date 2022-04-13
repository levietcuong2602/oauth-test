import { SIDEBAR_WIDTH } from '@src/styles/config';
import { styled } from '@mui/material/styles';

export const StyledSidebar = styled('div')`
  .toolbar {
    padding: 10px 19px 10px;
    display: flex;
    justify-content: space-between;
  }
  .toolbar-collapsed {
    justify-content: center;
    padding: 0px;
  }
  .logo {
    cursor: pointer;
  }
  .drawer {
    width: ${SIDEBAR_WIDTH}px;
    flex-shrink: 0;
    height: 100vh;
    white-space: nowrap;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
    border-radius: 0px 12px 12px 0px;
    transition: all 0.25s;
    transition-duration: 0.4s;
    position: fixed;
    z-index: 1;
  }
  .drawer-mobile {
    width: ${SIDEBAR_WIDTH}px;
    flex-shrink: 0;
    white-space: nowrap;
  }
  .drawer-open {
    width: ${SIDEBAR_WIDTH}px;
  }
  .drawer-close {
    overflow: visible;
    width: 64px;
  }
  .header {
    height: 48px;
  }
  .nested {
    padding-left: 32px;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  .hide {
    display: none;
  }
  .menu-button {
    padding: 12px;
    min-width: unset;
  }
  .menu-item {
    display: flex;
    align-items: center;
    text-transform: none;
    justify-content: center;
  }
  .menu-item-level-1 {
    padding-left: 16px;
  }
  .menu-item-level-2 {
    padding-left: 32px;
  }
  .menu-item-level-3 {
    padding-left: 48px;
  }
  .menu-icon {
    min-width: 24px;
    height: 30px;
    font-size: 24px;
    line-height: 30px;
    align-items: center;
    vertical-align: middle;
    color: #6e6b7b;
  }
  .menu-title {
    padding-left: 10px;
    margin: 0px;
    transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1) 0s;
    color: #6e6b7b;
    & span {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .primary {
    color: #fc6634;
  }
  .background-primary {
    background-color: #f5f5f5;
  }
  .menu-submenu {
    position: relative;
    &:hover {
      & > .placement-right-top {
        display: block;
      }
    }
  }
  .placement-right-top {
    background-color: transparent;
    position: absolute;
    display: none;
    top: 0px;
    right: ${-SIDEBAR_WIDTH - 16}px;
    width: ${SIDEBAR_WIDTH}px;
    padding-left: 16px;
  }
  .placement-right-top-sub {
    right: ${-SIDEBAR_WIDTH - 8}px;
    padding-left: 8px;
  }
  .sub-menu {
    padding: 4px 0px;
    border-radius: 4px;
    background-color: #ffffff;
    box-shadow: -4px -4px 4px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    & ul {
      padding: 8px;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    & img {
      height: 30px;
      width: auto;
    }
    & p {
      margin-left: 10px;
      margin-bottom: 0px;
      font-size: 14px;
      line-height: 14px;
      color: #babfc7;
      font-weight: bold;
    }
  }
`;
