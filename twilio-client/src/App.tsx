import React from 'react';
import VideoChat from './component/video-chat';
import './App.css';

function App() {
  return (
    <div className="app">
    <header>
      <h1>Video Chat</h1>
    </header>
    <main>
      <VideoChat />
    </main>
    <footer>
      <p>
        Made with{' '}
        <span role="img" aria-label="React">
          ⚛️
        </span>{' '}
        by Kanti Vekariya
      </p>
    </footer>
  </div>
  );
}

export default App;
