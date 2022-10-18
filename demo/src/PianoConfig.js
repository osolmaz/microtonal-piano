import React from 'react';
import { MidiNumbers } from 'react-piano';

class AutoblurSelect extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  onChange = (event) => {
    this.props.onChange(event);
    this.selectRef.current.blur();
  };

  render() {
    const { children, onChange, ...otherProps } = this.props;
    return (
      <select {...otherProps} onChange={this.onChange} ref={this.selectRef}>
        {children}
      </select>
    );
  }
}

function Label(props) {
  return <small className="mb-1 text-muted">{props.children}</small>;
}

class PianoConfig extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    // this.onChangeTuning
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const numNotes = this.props.config.noteRange.last - this.props.config.noteRange.first + 1;
    const minOffset = 0;
    const maxOffset = numNotes - this.props.keyboardShortcuts.length;
    if (event.key === 'ArrowLeft') {
      const reducedOffset = this.props.config.keyboardShortcutOffset - 1;
      if (reducedOffset >= minOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: reducedOffset,
        });
      }
    } else if (event.key === 'ArrowRight') {
      const increasedOffset = this.props.config.keyboardShortcutOffset + 1;
      if (increasedOffset <= maxOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: increasedOffset,
        });
      }
    }
  };

  onChangeFirstNote = (event) => {
    this.props.setConfig({
      noteRange: {
        first: parseInt(event.target.value, 10),
        last: this.props.config.noteRange.last,
      },
    });
  };

  onChangeLastNote = (event) => {
    this.props.setConfig({
      noteRange: {
        first: this.props.config.noteRange.first,
        last: parseInt(event.target.value, 10),
      },
    });
  };

  onChangeInstrument = (event) => {
    this.props.setConfig({
      instrumentName: event.target.value,
    });
  };

  onChangeShowSteps = (event) => {
    this.props.setConfig({
      showSteps: event.target.checked,
    });
  };

  onChangeShowCents = (event) => {
    this.props.setConfig({
      showCents: event.target.checked,
    });
  };

  onChangeShowFrequencies = (event) => {
    this.props.setConfig({
      showFrequencies: event.target.checked,
    });
  };

  onChangeTuning = (event) => {
    this.props.setConfig({
      tuning: this.props.tuningList.find((tuning) => tuning.name === event.target.value),
    });
  };

  render() {
    const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
      obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
      return obj;
    }, {});
    const {
      noteRange,
      instrumentName,
      tuningName,
      showSteps,
      showCents,
      showFrequencies,
    } = this.props.config;

    return (
      <div className="form-row">
        <div className="col-6">
          <Label>Tuning</Label>
          <AutoblurSelect
            className="form-control"
            value={tuningName}
            onChange={this.onChangeTuning}
          >
            {this.props.tuningList.map((value) => (
              <option value={value.name} key={value.name}>
                {value.name}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-3">
          <Label>First note</Label>
          <AutoblurSelect
            className="form-control"
            onChange={this.onChangeFirstNote}
            value={noteRange.first}
          >
            {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} disabled={midiNumber >= noteRange.last} key={midiNumber}>
                {midiNumbersToNotes[midiNumber]}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-3">
          <Label>Last note</Label>
          <AutoblurSelect
            className="form-control"
            onChange={this.onChangeLastNote}
            value={noteRange.last}
          >
            {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} disabled={midiNumber <= noteRange.first} key={midiNumber}>
                {midiNumbersToNotes[midiNumber]}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-12 mt-2">
          <Label>Description</Label>
          <p className="text-muted">{this.props.config.tuning.description}</p>
        </div>
        <div className="col-6">
          <Label>Instrument</Label>
          <AutoblurSelect
            className="form-control"
            value={instrumentName}
            onChange={this.onChangeInstrument}
          >
            {this.props.instrumentList.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-12">
          <Label>Display</Label>
          <div className="form-check">
            <input
              className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={showSteps}
              onChange={this.onChangeShowSteps}
              id="showStepsCheckbox"
            />
            <label className="form-check-label inline-block" for="showStepsCheckbox">
              Steps from base note
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={showCents}
              onChange={this.onChangeShowCents}
              id="showCentsCheckbox"
            />
            <label className="form-check-label inline-block" for="showCentsCheckbox">
              Cents from base note
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={showFrequencies}
              onChange={this.onChangeShowFrequencies}
              id="showFrequenciesCheckbox"
            />
            <label className="form-check-label inline-block" for="showFrequenciesCheckbox">
              Note frequency
            </label>
          </div>
        </div>
        <div className="col mt-2">
          <small className="text-muted">
            Use <strong>left arrow</strong> and <strong>right arrow</strong> to move the keyboard
            shortcuts around.
          </small>
        </div>
      </div>
    );
  }
}

export default PianoConfig;
