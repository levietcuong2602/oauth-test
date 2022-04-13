import React from 'react';
import { StyledSpinner } from './index.style';

const Spinner = (props) => (
  <StyledSpinner {...props}>
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
    <div className="spinner-blade" />
  </StyledSpinner>
);

export default Spinner;
