import React from 'react';
// import fetch from 'fetch';
import SliderCaptcha from '@slider-captcha/react';

const verifiedCallback = (token) => {
  console.log(`Captcha token: ${token}`);
};

const fetchCaptcha = () =>
  fetch('http://localhost:8080/captcha/create', {
    // Use create as API URL for fetch
    method: 'GET',
  }).then((message) => message.json());

const fetchVerifyCaptcha = (response, trail) =>
  fetch('http://localhost:8080/captcha/verify', {
    // Verification API URL provided instead
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      response,
      trail,
    }),
  }).then((message) => message.json());

const Home = () => (
  // React.useEffect(() => {
  //   fetchCaptcha();
  // }, []);
  <div style={{ margin: '300px' }}>
    <div>Captcha</div>
    <SliderCaptcha
      create={fetchCaptcha}
      verify={fetchVerifyCaptcha}
      callback={verifiedCallback}
      text={{ anchor: 'I am human', challenge: 'Slide to finish the puzzle' }}
    />
  </div>
);
export default Home;
