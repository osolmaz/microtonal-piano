import React from 'react';

function Header() {
  return (
    <div style={{ background: '#333' }}>
      <div className="container">
        <div className="text-sm-center text-white py-5">
          <h1>microtonal.xyz</h1>
          <p>
            A Microtonal Piano/Keyboard Inspired by the{' '}
            <a target="_blank" href="https://en.wikipedia.org/wiki/Qanun_(instrument)">
              Kanun
            </a>
          </p>
          {/* <div className="mt-4">
            <a
              className="btn btn-outline-light btn-lg"
              href="https://github.com/kevinsqi/react-piano"
            >
              View docs on Github
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Header;
