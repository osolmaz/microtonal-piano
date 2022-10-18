import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MidiNumbers from './MidiNumbers';
import { Range, Direction } from 'react-range';
import * as tinygradient_ from 'tinygradient';
const tinygradient = tinygradient_;

function getKeyColor(switchVal, minVal, maxVal, color, active) {
  let neutralKeyColor;
  let targetColor;
  let targetInterval;

  if (active) {
    return '#3ac8da';
  }
  if (color) {
    // neutralKeyColor = '#999'; // black
    neutralKeyColor = color;
  } else {
    neutralKeyColor = '#f3f3f3'; // white
  }
  if (switchVal === 0) {
    return neutralKeyColor;
  } else if (switchVal < 0) {
    // targetColor = '#2f4e87'; // blue
    targetColor = '#0000ff'; // blue
    targetInterval = Math.abs(minVal) + 1;
  } else {
    // targetColor = '#872f2f'; // red
    targetColor = '#ff0000'; // red
    targetInterval = maxVal + 1;
  }
  return tinygradient([neutralKeyColor, targetColor]).rgb(targetInterval)[Math.abs(switchVal)];
}

class Key extends React.Component {
  static propTypes = {
    midiNumber: PropTypes.number.isRequired,
    naturalKeyWidth: PropTypes.number.isRequired, // Width as a ratio between 0 and 1
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    accidental: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    onSwitchChange: PropTypes.func.isRequired,
    // switchValues: PropTypes.arrayOf(
    //   PropTypes.shape({
    //     midiNumber: PropTypes.number.isRequired,
    //     switchValue: PropTypes.number.isRequired,
    //   }),
    // ),
    // accidentalWidthRatio: PropTypes.number.isRequired,
    // pitchPositions: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  // static defaultProps = {
  //   accidentalWidthRatio: 0.8,
  //   pitchPositions: {
  //     C: 0 / 7,
  //     Db: 0.55 / 7,
  //     D: 1 / 7,
  //     Eb: 1.8 / 7,
  //     E: 2 / 7,
  //     F: 3 / 7,
  //     Gb: 3.5 / 7,
  //     G: 4 / 7,
  //     Ab: 4.7 / 7,
  //     A: 5 / 7,
  //     Bb: 5.85 / 7,
  //     B: 6 / 7,
  //   },
  // };

  constructor(props) {
    super(props);
    this.switchRef = React.createRef();
  }

  // state = { switchValues: [0] };
  onPlayNoteInput = () => {
    // console.log('Fired onPlayNoteInput', this.state.switchValues[0]);
    // this.switchRef.current.thumbRefs.forEach((ref) => {
    //   ref.current.blur();
    // });
    this.props.onPlayNoteInput([this.props.midiNumber, this.getSwitchVal()]);
    // this.props.onPlayNoteInput(this.props.midiNumber, );
  };

  onStopNoteInput = () => {
    // console.log('Fired onStopNoteInput', this.state.switchValues[0]);
    this.props.onStopNoteInput([this.props.midiNumber, this.getSwitchVal()]);
    // this.props.onStopNoteInput(this.props.midiNumber);
  };

  // Key position is represented by the number of natural key widths from the left
  getAbsoluteKeyPosition(keyNumber) {
    const nKeys = this.props.tuning.keys.length;
    // const OCTAVE_WIDTH = 7;
    const { keyIndex, octave } = MidiNumbers.getKeyIndexOctave(keyNumber, this.props.tuning);
    const pitchPosition = this.props.tuning.keys[keyIndex].position;
    const position = pitchPosition + octave;
    // console.log(keyNumber, keyIndex, octave, pitchPosition, position);
    // const octavePosition = OCTAVE_WIDTH * octave;
    // const octavePosition = (nKeys * octave * this.props.tuning.octaveWidth) / nKeys;
    // return pitchPosition + octavePosition;
    return position;
  }

  getTotalLength() {
    const { keyIndex, octave } = MidiNumbers.getKeyIndexOctave(
      this.props.noteRange.last,
      this.props.tuning,
    );
    const lastWidthRatio = this.props.tuning.keys[keyIndex].widthRatio;
    return (
      this.getAbsoluteKeyPosition(this.props.noteRange.last) -
      this.getAbsoluteKeyPosition(this.props.noteRange.first) +
      lastWidthRatio
    );
  }
  getTotalCount() {
    return this.props.noteRange.last - this.props.noteRange.first;
  }
  getRelativeKeyPosition(midiNumber) {
    return (
      (this.getAbsoluteKeyPosition(midiNumber) -
        this.getAbsoluteKeyPosition(this.props.noteRange.first)) /
      this.getTotalLength()
    );
  }

  getSwitchVal() {
    return this.props.switchValues[this.props.midiNumber];
  }

  render() {
    const {
      naturalKeyWidth,
      accidentalWidthRatio,
      midiNumber,
      gliss,
      useTouchEvents,
      // accidental,
      active,
      disabled,
      children,
    } = this.props;

    const { keyIndex, octave } = MidiNumbers.getKeyIndexOctave(midiNumber, this.props.tuning);
    // const keyInfo = this.props.tuning.keys[keyIndex];
    let widthRatio = this.props.keyInfo.widthRatio || 1;
    // console.log(midiNumber, keyIndex, widthRatio);
    let keyLeft = this.getRelativeKeyPosition(midiNumber); //* naturalKeyWidth;
    let keyWidth = widthRatio / this.getTotalLength();
    // let keyWidth =  naturalKeyWidth;
    let constWidthRatio = this.getTotalLength() / this.getTotalCount();
    let rangeTrackWidth = (0.3 * constWidthRatio) / widthRatio;
    // let rangeTrackWidth = 0.3;
    // let thumbWidth = rangeTrackWidth * 1.2;

    // Need to conditionally include/exclude handlers based on useTouchEvents,
    // because otherwise mobile taps double fire events.
    // let STEP = 1;
    let MIN = -6;
    let MAX = 6;
    return (
      <div
        style={{
          left: ratioToPercentage(keyLeft),
          width: ratioToPercentage(keyWidth),
          height: '17rem',
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        <Range
          className={'ReactPiano__KeyMicrotonalSwitch rounded-lg'}
          step={1}
          min={-6}
          max={6}
          values={[this.getSwitchVal()]}
          // values={[0]}
          onChange={(s) => {
            // this.setState({ switchValues });
            this.props.onSwitchChange(this.props.midiNumber, s[0]);
            // console.log("Called onSwitchChange", this.props.midiNumber, s[0]);
          }}
          renderMark={({ props, index }) => (
            <div
              {...props}
              style={{
                ...props.style,
                // height: index % 2 ? '3px' : '4px',
                // width: index % 2 ? '11px' : '16px',
                height: index === 0 || index === MAX - MIN ? '0px' : '2px',
                width: index === -MIN ? '180%' : '100%',
                backgroundColor: '#999',
                // borderColor: index === -MIN ? '#548BF4' : '#888',
                // borderWidth:'2px',
                // backgroundColor: index * STEP > MAX - this.state.switchValues[0] ? '#548BF4' : '#ccc',
              }}
            />
          )}
          direction={Direction.Up}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '40%',
                width: ratioToPercentage(rangeTrackWidth),
                margin: 'auto',
                backgroundColor: this.props.keyInfo.type === 'accidental1' ? '#555' : '#ccc',
                // backgroundColor: accidental ? '#aaa' : '#ccc',
                marginBottom: '1rem',
                borderRadius: '3px',
                boxShadow: '1px 1px 3px #777',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                // height: ratioToPercentage(thumbWidth),
                // width: ratioToPercentage(thumbWidth),
                height: '8%',
                width: '210%',
                // backgroundColor: '#777',
                backgroundColor: '#478ca6',
                borderRadius: '2px',
                boxShadow: '1px 1px 2px #444',
                // border: '1px solid #fff',
              }}
            />
          )}
          ref={this.switchRef}
        />
        <div
          className={classNames('ReactPiano__Key', {
            'ReactPiano__Key--accidental': this.props.keyInfo.type === 'accidental1',
            'ReactPiano__Key--natural': this.props.keyInfo.type !== 'accidental1',
            'ReactPiano__Key--disabled': disabled,
            'ReactPiano__Key--active': active,
          })}
          style={{
            left: ratioToPercentage(keyLeft),
            // width: accidental ? ratioToPercentage(keyWidth) : '100%',
            width: ratioToPercentage(keyWidth),
            background: getKeyColor(
              this.getSwitchVal(),
              MIN,
              MAX,
              this.props.keyInfo.color,
              active,
            ),
          }}
          onMouseDown={useTouchEvents ? null : this.onPlayNoteInput}
          onMouseUp={useTouchEvents ? null : this.onStopNoteInput}
          onMouseEnter={gliss ? this.onPlayNoteInput : null}
          onMouseLeave={this.onStopNoteInput}
          onTouchStart={useTouchEvents ? this.onPlayNoteInput : null}
          onTouchCancel={useTouchEvents ? this.onStopNoteInput : null}
          onTouchEnd={useTouchEvents ? this.onStopNoteInput : null}
        >
          <div className="ReactPiano__NoteLabelContainer">{children}</div>
        </div>
      </div>
    );
  }
}

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

export default Key;
