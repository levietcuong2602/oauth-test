import { styled, keyframes } from '@mui/material/styles';

const fadeKeyframe = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.25;
  }
`;

export const StyledSpinner = styled('div')`
  position: relative;
  width: ${(props) => `${props.size || 44}px`};
  height: ${(props) => `${props.size || 44}px`};
  display: inline-block;

  & .spinner-blade {
    width: 7%;
    height: 20%;
    background: ${(props) => props.color || '#323232'};
    position: absolute;
    left: 49%;
    top: 43%;
    opacity: 0;
    border-radius: 50%;
    animation: ${fadeKeyframe} 1s linear infinite;
  }

  & .spinner-blade:nth-child(1) {
    transform: rotate(0deg) translate(0, -130%);
    animation-delay: 0s;
  }

  & .spinner-blade:nth-child(2) {
    transform: rotate(30deg) translate(0, -130%);
    animation-delay: -0.9167s;
  }

  & .spinner-blade:nth-child(3) {
    transform: rotate(60deg) translate(0, -130%);
    animation-delay: -0.833s;
  }

  & .spinner-blade:nth-child(4) {
    transform: rotate(90deg) translate(0, -130%);
    animation-delay: -0.7497s;
  }

  & .spinner-blade:nth-child(5) {
    transform: rotate(120deg) translate(0, -130%);
    animation-delay: -0.667s;
  }

  & .spinner-blade:nth-child(6) {
    transform: rotate(150deg) translate(0, -130%);
    animation-delay: -0.5837s;
  }

  & .spinner-blade:nth-child(7) {
    transform: rotate(180deg) translate(0, -130%);
    animation-delay: -0.5s;
  }

  & .spinner-blade:nth-child(8) {
    transform: rotate(210deg) translate(0, -130%);
    animation-delay: -0.4167s;
  }

  & .spinner-blade:nth-child(9) {
    transform: rotate(240deg) translate(0, -130%);
    animation-delay: -0.333s;
  }

  & .spinner-blade:nth-child(10) {
    transform: rotate(270deg) translate(0, -130%);
    animation-delay: -0.2497s;
  }

  & .spinner-blade:nth-child(11) {
    transform: rotate(300deg) translate(0, -130%);
    animation-delay: -0.167s;
  }

  & .spinner-blade:nth-child(12) {
    transform: rotate(330deg) translate(0, -130%);
    animation-delay: -0.0833s;
  }
`;
