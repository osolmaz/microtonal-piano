import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';

import DimensionsProvider from './DimensionsProvider';
import InstrumentListProvider from './InstrumentListProvider';
import SoundfontProvider from './SoundfontProvider';
import PianoConfig from './PianoConfig';

import audioContext from './audioContext';
import Oscillator from './audio/Oscillator';
import {
  getCentsForNote,
  // getFrequencyForNote,
  getNoteFromOffset,
  getNoteLabel,
  // getMidiNumberForNote,
  TUNINGS,
} from './noteHelpers';

const GAIN_VALUE = 0.1;

class InteractiveDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        // instrumentName: 'choir_aahs',
        // instrumentName: 'acoustic_grand_piano',
        instrumentName: 'acoustic_guitar_steel',
        tuning: TUNINGS[0],
        // tuning: TUNINGS[3],
        noteRange: {
          first: MidiNumbers.fromNote('g2'),
          last: MidiNumbers.fromNote('f5'),
        },
        keyboardShortcutOffset: 0,
        showSteps: false,
        showCents: true,
        showFrequencies: false,
      },
      oscillator: null,
    };

    // this.playbackIntervalFn = null;
    // console.log(props);
    this.oscillator = new Oscillator({
      audioContext: audioContext,
      gain: GAIN_VALUE,
    });
  }

  render() {
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: this.state.config.noteRange.first + this.state.config.keyboardShortcutOffset,
      lastNote: this.state.config.noteRange.last + this.state.config.keyboardShortcutOffset,
      // keyboardConfig: KeyboardShortcuts.HOME_ROW,
      keyboardConfig: KeyboardShortcuts.DOUBLE_ROW,
    });

    return (
      <SoundfontProvider
        audioContext={this.props.audioContext}
        instrumentName={this.state.config.instrumentName}
        hostname={this.props.soundfontHostname}
        render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
          <div>
            <div className="text-center">
              <p className="">Try it by clicking, tapping, or using your keyboard:</p>
              <div style={{ color: '#777' }}>
                <MdArrowDownward size={32} />
              </div>
            </div>
            <div className="mt-4 disable-select disable-touch">
              <DimensionsProvider>
                {({ containerWidth }) => (
                  <Piano
                    noteRange={this.state.config.noteRange}
                    tuning={this.state.config.tuning}
                    keyboardShortcuts={keyboardShortcuts}
                    // playNote={playNote}
                    // stopNote={stopNote}
                    disabled={isLoading}
                    // disabled={false}
                    playNote={(note) => {
                      console.log('Starting', note);
                      // this.oscillator.start(this.getFrequencyForNote(note[0], note[1]));
                      let midiNumber = MidiNumbers.getMidiNumberForNote(note[0], note[1], this.state.config.tuning)
                      playNote(midiNumber);
                      // playNote(midiNumber+7.01955);
                      playNote(midiNumber+12);
                    }}
                    stopNote={(note) => {
                      console.log('Stopping', note);
                      // this.oscillator.stop(this.getFrequencyForNote(note[0], note[1]));
                      let midiNumber = MidiNumbers.getMidiNumberForNote(note[0], note[1], this.state.config.tuning)
                      stopNote(midiNumber);
                      // stopNote(midiNumber+7.01955);
                      stopNote(midiNumber+12);
                    }}
                    showSteps={this.state.config.showSteps}
                    showCents={this.state.config.showCents}
                    showFrequencies={this.state.config.showFrequencies}
                    width={containerWidth}
                    gain={GAIN_VALUE}
                  />
                )}
              </DimensionsProvider>
            </div>
            <div className="row mt-5">
              <div className="col-lg-8 offset-lg-2">
                <InstrumentListProvider
                  hostname={this.props.soundfontHostname}
                  render={(instrumentList) => (
                    <PianoConfig
                      config={this.state.config}
                      setConfig={(config) => {
                        this.setState({
                          config: Object.assign({}, this.state.config, config),
                        });
                        stopAllNotes();
                      }}
                      instrumentList={instrumentList || [this.state.config.instrumentName]}
                      tuningList={TUNINGS}
                      keyboardShortcuts={keyboardShortcuts}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      />
    );
  }
}

export default InteractiveDemo;
