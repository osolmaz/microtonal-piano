import React from 'react';

function Footer(props) {
  return (
    <div className="bg-yellow mt-5 py-5">
      <div className="container">
        <div className="text-center text-secondary">
          Made with{' '}
          <span role="img" aria-label="keyboard emoji">
            🎵
          </span>{' '}
          by{' '}
          <a className="text-secondary" href="https://github.com/osolmaz/">
            <strong>@osolmaz</strong>
          </a>{' '}
          building upon{' '}
          <a className="text-secondary" href="https://github.com/kevinqi/react-piano/">
            <strong>react-piano</strong>
          </a>{' '}
          by{' '}
          <a className="text-secondary" href="https://www.kevinqi.com/">
            <strong>@kevinsqi</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
