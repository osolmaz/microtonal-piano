import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import Keyboard from './Keyboard';
import range from 'just-range';
import {MidiNumbers} from 'react-piano';
// import { getCentValueForNote, getFrequencyForNote } from '../demo/src/noteHelpers';

class ControlledPiano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
    // switchValues: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     midiNumber: PropTypes.number.isRequired,
    //     switchVal: PropTypes.number.isRequired,
    //   }),
    // ),
  };

  // static defaultProps = {
  //   renderNoteLabel: ({ keyboardShortcut, midiNumber, isActive, isAccidental }) => {
  //     let keyNumber = (midiNumber - 57) % 12;
  //     if (keyNumber < 0) {
  //       keyNumber += 12;
  //     }
  //     // console(this.po)
  //     // this.props.tuning.keySteps[keyNumber];
  //     return (
  //       <div
  //         className={classNames('ReactPiano__NoteLabel', {
  //           'ReactPiano__NoteLabel--active': isActive,
  //           'ReactPiano__NoteLabel--accidental': isAccidental,
  //           'ReactPiano__NoteLabel--natural': !isAccidental,
  //         })}
  //       >
  //         {keyNumber} <br />
  //         {keyboardShortcut ? keyboardShortcut : null}
  //       </div>
  //     );
  //   },
  // };

  constructor(props) {
    super(props);
    let switchValues = {};
    // for (let number of this.getMidiNumbers()) {
    for (let number of range(0, 1000)) {
      switchValues[number] = 0;
    }
    this.state = {
      isMouseDown: false,
      useTouchEvents: false,
      switchValues: switchValues,
      initialSwitchValues: props.initialSwitchValues,
    };
  }

  onSwitchChange = (midiNumber, newVal) => {
    let newSwitchValues = this.state.switchValues;
    for (const num in newSwitchValues) {
      if ((num - midiNumber) % this.props.tuning.keys.length === 0) {
        newSwitchValues[num] = newVal;
      }
    }
    this.setState({
      switchValues: newSwitchValues,
    });
  };

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    if (this.props.initialSwitchValues) {
      this.setSwitchValues(this.props.initialSwitchValues);
      console.log(this.props.initialSwitchValues);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges({
        prevActiveNotes: prevProps.activeNotes || [],
        nextActiveNotes: this.props.activeNotes || [],
      });
    }
    if (this.state.initialSwitchValues !== this.props.initialSwitchValues) {
      this.setSwitchValues(this.props.initialSwitchValues);
      this.setState({ initialSwitchValues: this.props.initialSwitchValues });
    }
  }

  setSwitchValues(newSwitchValues) {
    let switchValues = {};
    for (let number of this.getMidiNumbers()) {
      switchValues[number] = 0;
    }
    for (const [key, value] of Object.entries(newSwitchValues)) {
      for (let number of this.getMidiNumbers()) {
        if (key % this.props.tuning.keys.length === number % this.props.tuning.keys.length) {
          switchValues[number] = value;
        }
      }
    }
    console.log('SWITCH VALUES:', switchValues);
    this.setState({ switchValues: switchValues });
  }
  // This function is responsible for diff'ing activeNotes
  // and playing or stopping notes accordingly.
  handleNoteChanges = ({ prevActiveNotes, nextActiveNotes }) => {
    if (this.props.disabled) {
      return;
    }
    const notesStopped = difference(prevActiveNotes, nextActiveNotes);
    const notesStarted = difference(nextActiveNotes, prevActiveNotes);
    // console.log('Notes started:', notesStarted);
    // console.log('Notes stopped:', notesStopped);
    notesStarted.forEach((midiNumber) => {
      // Check if midiNumber is int and if so, convert it into an array and append a 0
      if (midiNumber % 1 === 0) {
        midiNumber = [midiNumber, this.state.switchValues[midiNumber]];
      }
      this.props.playNote(midiNumber);
    });
    notesStopped.forEach((midiNumber) => {
      if (midiNumber % 1 === 0) {
        midiNumber = [midiNumber, this.state.switchValues[midiNumber]];
      }
      this.props.stopNote(midiNumber);
    });
  };

  getMidiNumberForKey = (key) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.key === key);
    return shortcut && shortcut.midiNumber;
  };

  getKeyForMidiNumber = (midiNumber) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.midiNumber === midiNumber);
    return shortcut && shortcut.key;
  };

  onKeyDown = (event) => {
    // Don't conflict with existing combinations like ctrl + t
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) {
      return;
    }
    console.log('Pressed', event);
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onPlayNoteInput([midiNumber, this.state.switchValues[midiNumber]]);
    }
  };

  onKeyUp = (event) => {
    // This *should* also check for event.ctrlKey || event.metaKey || event.ShiftKey like onKeyDown does,
    // but at least on Mac Chrome, when mashing down many alphanumeric keystrokes at once,
    // ctrlKey is fired unexpectedly, which would cause onStopNote to NOT be fired, which causes problematic
    // lingering notes. Since it's fairly safe to call onStopNote even when not necessary,
    // the ctrl/meta/shift check is removed to fix that issue.
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onStopNoteInput([midiNumber, this.state.switchValues[midiNumber]]);
    }
  };

  onPlayNoteInput = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onPlayNoteInput(midiNumber, this.props.activeNotes);
  };

  onStopNoteInput = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onStopNoteInput(midiNumber, this.props.activeNotes);
  };

  onMouseDown = () => {
    this.setState({
      isMouseDown: true,
    });
  };

  onMouseUp = () => {
    this.setState({
      isMouseDown: false,
    });
  };

  onTouchStart = () => {
    this.setState({
      useTouchEvents: true,
    });
  };

  renderNoteLabel = ({ midiNumber, isActive, isAccidental }) => {
    const keyboardShortcut = this.getKeyForMidiNumber(midiNumber);
    const switchVal = this.state.switchValues[midiNumber];
    // let keyNumber = (midiNumber - 57) % 12;
    // if (keyNumber < 0) {
    //   keyNumber += 12;
    // }
    const {keyIndex} = MidiNumbers.getKeyIndexOctave(midiNumber, this.props.tuning);
    let keyStep;
    let key = this.props.tuning.keys[keyIndex];
    if (key.step) {
      keyStep = key.step + switchVal;
    }
    let centVal = MidiNumbers.getCentValueForNote(midiNumber, switchVal, this.props.tuning);
    let freqVal = MidiNumbers.getFrequencyForNote(midiNumber, switchVal, this.props.tuning).toFixed(1);

    return (
      <div
        className={classNames('ReactPiano__NoteLabel', {
          'ReactPiano__NoteLabel--active': isActive,
          'ReactPiano__NoteLabel--accidental': isAccidental,
          'ReactPiano__NoteLabel--natural': !isAccidental,
        })}
      >
        {this.props.showSteps ? <div className="text-xs">{keyStep}</div> : null}
        {this.props.showCents ? <div className="text-xs">{Math.round(centVal)}</div> : null}
        {this.props.showFrequencies ? <div className="text-xxs">{freqVal}</div> : null}
        {keyboardShortcut ? keyboardShortcut : null}
      </div>
    );
    // return this.props.renderNoteLabel({ keyboardShortcut, midiNumber, isActive, isAccidental });
  };

  getMidiNumbers() {
    return range(this.props.noteRange.first, this.props.noteRange.last + 1);
  }

  render() {
    return (
      <div
        style={{ width: '100%', height: '100%' }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onTouchStart={this.onTouchStart}
        data-testid="container"
      >
        <Keyboard
          noteRange={this.props.noteRange}
          onPlayNoteInput={this.onPlayNoteInput}
          onStopNoteInput={this.onStopNoteInput}
          onSwitchChange={this.onSwitchChange}
          switchValues={this.state.switchValues}
          activeNotes={this.props.activeNotes}
          className={this.props.className}
          disabled={this.props.disabled}
          width={this.props.width}
          keyWidthToHeight={this.props.keyWidthToHeight}
          gliss={this.state.isMouseDown}
          useTouchEvents={this.state.useTouchEvents}
          renderNoteLabel={this.renderNoteLabel}
          tuning={this.props.tuning}
        />
      </div>
    );
  }
}

export default ControlledPiano;
