import React from 'react';
import PropTypes from 'prop-types';
import range from 'just-range';
import classNames from 'classnames';

import Key from './Key';
import MidiNumbers from './MidiNumbers';

class Keyboard extends React.Component {
  static propTypes = {
    noteRange: noteRangePropType,
    activeNotes: PropTypes.arrayOf(PropTypes.number),
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    onSwitchChange: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    keyWidthToHeight: PropTypes.number.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    gliss: PropTypes.bool,
    useTouchEvents: PropTypes.bool,
    // switchValues: PropTypes.objectOf(
    //   PropTypes.shape({
    //     midiNumber: PropTypes.number.isRequired,
    //     switchValue: PropTypes.number.isRequired,
    //   }),
    // ),
    // If width is not provided, must have fixed width and height in parent container
    width: PropTypes.number,
  };

  static defaultProps = {
    disabled: false,
    gliss: false,
    useTouchEvents: false,
    keyWidthToHeight: 0.33,
    renderNoteLabel: () => {},
  };

  // Range of midi numbers on keyboard
  getMidiNumbers() {
    return range(this.props.noteRange.first, this.props.noteRange.last + 1);
  }

  getNaturalKeyCount() {
    // return this.props.tuning.keys.length;
    return this.getMidiNumbers().filter((number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      // return !isAccidental;
      return true;
    }).length;
  }

  // Returns a ratio between 0 and 1
  getNaturalKeyWidth() {
    // const midiNumbers = this.getMidiNumbers();
    return 1 / this.getNaturalKeyCount();
  }

  getWidth() {
    return this.props.width ? this.props.width : '100%';
  }

  getHeight() {
    if (!this.props.width) {
      return '100%';
    }
    const keyWidth = this.props.width * this.getNaturalKeyWidth();
    return `1.5*${keyWidth / this.props.keyWidthToHeight}px`;
  }

  render() {
    const naturalKeyWidth = this.getNaturalKeyWidth();
    return (
      <div
        className={classNames('ReactPiano__Keyboard', this.props.className)}
        style={{ width: this.getWidth(), height: this.getHeight() }}
      >
        {this.getMidiNumbers().map((midiNumber) => {
          const { note, isAccidental } = MidiNumbers.getAttributes(midiNumber);
          const { keyIndex, octave } = MidiNumbers.getKeyIndexOctave(midiNumber, this.props.tuning);
          const isActive =
            !this.props.disabled &&
            (this.props.activeNotes.map((note) => note[0]).includes(midiNumber) ||
              this.props.activeNotes.includes(midiNumber));
          return (
            <>
              <Key
                naturalKeyWidth={naturalKeyWidth}
                midiNumber={midiNumber}
                // stepsFromBase={midiNumber - 57}
                noteRange={this.props.noteRange}
                active={isActive}
                // accidental={isAccidental}
                disabled={this.props.disabled}
                onPlayNoteInput={this.props.onPlayNoteInput}
                onStopNoteInput={this.props.onStopNoteInput}
                onSwitchChange={this.props.onSwitchChange}
                switchValues={this.props.switchValues}
                gliss={this.props.gliss}
                useTouchEvents={this.props.useTouchEvents}
                key={midiNumber}
                tuning={this.props.tuning}
                keyInfo={this.props.tuning.keys[keyIndex]}
              >
                {this.props.disabled
                  ? null
                  : this.props.renderNoteLabel({
                      isActive,
                      isAccidental,
                      midiNumber,
                    })}
              </Key>
            </>
          );
        })}
      </div>
    );
  }
}

function isNaturalMidiNumber(value) {
  if (typeof value !== 'number') {
    return false;
  }
  return MidiNumbers.NATURAL_MIDI_NUMBERS.includes(value);
}

function noteRangePropType(props, propName, componentName) {
  const { first, last } = props[propName];
  if (!first || !last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} must be an object with .first and .last values.`,
    );
  }
  if (!isNaturalMidiNumber(first) || !isNaturalMidiNumber(last)) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} values must be valid MIDI numbers, and should not be accidentals (sharp or flat notes).`,
    );
  }
  if (first >= last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName}.first must be smaller than ${propName}.last.`,
    );
  }
}

export default Keyboard;
