import React from 'react';
import YouTube from 'react-youtube';
import { Piano, MidiNumbers } from 'react-piano';
import classNames from 'classnames';

import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';

// import audioContext from './audioContext';
// import Oscillator from './audio/Oscillator';
import {
  getCentsForNote,
  getFrequencyForNote,
  getNoteFromOffset,
  getNoteLabel,
  CENTS_IN_OCTAVE,
  TUNINGS,
  // getMidiNumberForNote,
} from './noteHelpers';

// const GAIN_VALUE = 0.1;
const KARA_TOPRAK_SWITCHES = { 56: -2, 63: -2 };

class PlaybackDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNotesIndex: 0,
      isPlaying: false,
      stopAllNotes: () => console.warn('stopAllNotes not yet loaded'),
      initialSwitchValues: KARA_TOPRAK_SWITCHES,
      // oscillator: null,
    };

    this.playbackIntervalFn = null;
    this.piano = React.createRef();
    // console.log(props);
    // this.oscillator = new Oscillator({
    //   audioContext: audioContext,
    //   gain: props.gain,
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isPlaying !== this.state.isPlaying) {
      if (this.state.isPlaying) {
        this.playbackIntervalFn = setInterval(() => {
          this.setState({
            activeNotesIndex: (this.state.activeNotesIndex + 1) % this.props.song.length,
          });
        }, 80);
      } else {
        clearInterval(this.playbackIntervalFn);
        this.state.stopAllNotes();
        this.setState({
          activeNotesIndex: 0,
        });
      }
    }
  }

  setPlaying = (value) => {
    this.setState({ isPlaying: value });
  };

  render() {
    const noteRange = {
      first: MidiNumbers.fromNote('c3'),
      last: MidiNumbers.fromNote('f5'),
    };
    const tuning = TUNINGS[0];
    return (
      <div>
        <div className="text-center">
          <h2>Can you hear the difference?</h2>
          <p>
            Microtones can help composers add more emotional depth to songs.
            <br /> Try to hear the difference in the popular Anatolian folk song{' '}
            <a target="_blank" href="https://www.youtube.com/watch?v=2cGANgDZPj8">
              Kara Toprak by Aşık Veysel
            </a>{' '}
            with and without microtones:
          </p>
          <div>
            <button
              className={'btn btn-outline-info mr-3'}
              onClick={() => {
                this.setState({ initialSwitchValues: {} });
                this.setPlaying(true);
              }}
              hidden={this.state.isPlaying}
            >
              {this.state.isPlaying ? 'Stop' : 'Play without microtones'}
            </button>
            <button
              className={'btn btn-outline-info'}
              onClick={() => {
                this.setState({ initialSwitchValues: KARA_TOPRAK_SWITCHES });
                this.setPlaying(true);
              }}
              hidden={this.state.isPlaying}
            >
              {this.state.isPlaying ? 'Stop' : 'Play with microtones'}
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                this.setPlaying(false);
              }}
              hidden={!this.state.isPlaying}
            >
              Stop
            </button>
          </div>
        </div>
        <div className="mt-4">
          <SoundfontProvider
            audioContext={this.props.audioContext}
            instrumentName="acoustic_guitar_steel"
            // instrumentName="electric_piano_2"
            // instrumentName="banjo"
            // instrumentName="clarinet"
            hostname={this.props.soundfontHostname}
            onLoad={({ stopAllNotes }) => this.setState({ stopAllNotes })}
            render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
              <DimensionsProvider>
                {({ containerWidth }) => (
                  <Piano
                    activeNotes={
                      this.state.isPlaying ? this.props.song[this.state.activeNotesIndex] : []
                    }
                    noteRange={noteRange}
                    tuning={tuning}
                    width={containerWidth}
                    initialSwitchValues={this.state.initialSwitchValues}
                    playNote={(note) => {
                      let midiNumber = MidiNumbers.getMidiNumberForNote(note[0], note[1], tuning);
                      playNote(midiNumber);
                      // playNote(midiNumber + 7.01955);
                      playNote(midiNumber + 12);
                    }}
                    stopNote={(note) => {
                      let midiNumber = MidiNumbers.getMidiNumberForNote(note[0], note[1], tuning);
                      stopNote(midiNumber);
                      // stopNote(midiNumber + 7.01955);
                      stopNote(midiNumber + 12);
                    }}
                    showCents={true}
                    disabled={isLoading}
                    ref={this.piano}
                    // gain={GAIN_VALUE}
                  />
                )}
              </DimensionsProvider>
            )}
          />
        </div>
        <div className={'text-center'}>
          <p className="mt-5">
            You can listen to the instrumental arrangement by{' '}
            <a target="_blank" href="https://tolgahancogulu.com/">
              Tolgahan Çoğulu
            </a>{' '}
            and{' '}
            <a target="_blank" href="https://www.sinancemeroglu.com/">
              Sinan Cem Eroğlu
            </a>{' '}
            on YouTube:
          </p>
          <YouTube
            iframeClassName={'video-container'}
            videoId={'vvSHpxwxVkM'}
            style={{ display: 'block', margin: '0 auto' }}
            opts={{ height: '280', width: '480' }}
          />
        </div>
      </div>
    );
  }
}

export default PlaybackDemo;
