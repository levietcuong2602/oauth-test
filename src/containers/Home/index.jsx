import React from 'react';
import SliderCaptcha from '@slider-captcha/react';

const Home = () => {
  const verifiedCallback = (token) => {
    // eslint-disable-next-line no-console
    console.log(`Captcha token: ${token}`);
  };

  const fetchCaptcha = () =>
    fetch('http://localhost:8080/captcha/create', {
      // Use create as API URL for fetch
      method: 'GET',
      credentials: 'include',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }).then((message) => message.json());

  const fetchVerifyCaptcha = (response, trail) =>
    fetch('http://localhost:8080/captcha/verify', {
      // Verification API URL provided instead
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      credentials: 'include',
      body: JSON.stringify({
        response,
        trail,
      }),
    }).then((message) => message.json());

  return (
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
};
export default Home;
