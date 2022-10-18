import _ from 'lodash';
import { MidiNumbers } from 'piano-utils';

export const CENTS_IN_OCTAVE = 1200;
export const BASE_MIDI_NOTE_NUMBER = 57;
export const A440 = 440;
const BLACK_KEY_COLOR = '#999999';
const QUARTER_TONE_KEY_COLOR = '#d3d3d3';

// function getFrequencyRatio(note, numOctaves, numSteps) {
//   return Math.pow(2, note * (numOctaves / numSteps));
// }

// function getCustomCentsForNote(note, customCentValues) {
//   const offset = note % customCentValues.length;
//   const centOffset = customCentValues[offset];
//   const octave = Math.floor(note / customCentValues.length);
//   return CENTS_IN_OCTAVE * octave + centOffset;
// }

// export function getFrequency(rootFrequency, note, numOctaves, numSteps) {
//   return rootFrequency * getFrequencyRatio(note, numOctaves, numSteps);
// }

// export function getFrequencyFromCents(rootFrequency, cents) {
//   return rootFrequency * Math.pow(2, cents / CENTS_IN_OCTAVE);
// }

// export function getCentsForNote(config, note) {
//   if (config.useCustomCentValues) {
//     return getCustomCentsForNote(note, config.customCentValues);
//   } else {
//     return ((CENTS_IN_OCTAVE * config.numOctaves) / config.numSteps) * note;
//   }
// }

// TODO: port this to piano-utils
// http://subsynth.sourceforge.net/midinote2freq.html
// function getFrequencyForMidiNumber(midiNumber) {
//   return (A440 / 32) * Math.pow(2, (midiNumber - 9) / 12);
// }

// export function getFrequencyForNote(config, note) {
//   const lowestNoteMidiNumber = MidiNumbers.fromNote(config.lowestNote);
//   const rootFrequency = getFrequencyForMidiNumber(lowestNoteMidiNumber);

//   if (config.useCustomCentValues) {
//     const centValue = getCustomCentsForNote(note, config.customCentValues);
//     return getFrequencyFromCents(rootFrequency, centValue);
//   } else {
//     return getFrequency(rootFrequency, note, config.numOctaves, config.numSteps);
//   }
// }

// export function getStepFrequencies(config) {
//   return _.range(config.numSteps + 1).map((offset) => {
//     const note = getNoteFromOffset(config, offset);
//     return getFrequencyForNote(config, note);
//   });
// }

// Notes are a numeric index into the microtone scale.
// For example, given a standard 12 EDO scale, note 0 corresponds to lowestNote, note 12 corresponds
// to 1200 cents above lowestNote, etc.
//
// Because you can select specific notes to include in the scale with state.config.selectedNotes,
// we have offset which is slightly different from notes.
// For example, if selectedNotes == {0, 3, 6}, offset 0 corresponds to note 0, offset 2 corresponds to note 6,
// and offset 3 corresponds to note 12.
export function getNoteFromOffset(config, offset) {
  const sortedNotes = _.sortBy(Object.keys(config.selectedNotes).map((str) => parseInt(str, 10)));
  const numNotes = sortedNotes.length;
  if (numNotes > 0) {
    const octaves = Math.floor(offset / numNotes);
    const remainder = offset % numNotes;
    return octaves * config.numSteps + sortedNotes[remainder];
  } else {
    return offset;
  }
}

// In 12EDO, 0 -> 1, 11 -> 12, 12 -> 1, 13 -> 2
export function getNoteLabel(config, note) {
  return (note % config.numSteps) + 1;
}
const PIANO_KEYS = [
  {
    // A
    type: 'main',
    widthRatio: 1 / 7,
    position: 0 / 7,
  },
  {
    // A#
    type: 'accidental1',
    widthRatio: 0.8 / 7,
    position: 0.85 / 7,
    color: BLACK_KEY_COLOR,
  },
  {
    // B
    type: 'main',
    widthRatio: 1 / 7,
    position: 1 / 7,
  },
  {
    // C
    type: 'main',
    widthRatio: 1 / 7,
    position: 2 / 7,
  },
  {
    // C#
    type: 'accidental1',
    widthRatio: 0.8 / 7,
    position: 2.55 / 7,
    color: BLACK_KEY_COLOR,
  },
  {
    // D
    type: 'main',
    widthRatio: 1 / 7,
    position: 3 / 7,
  },
  {
    // D#
    type: 'accidental1',
    widthRatio: 0.8 / 7,
    position: 3.8 / 7,
    color: BLACK_KEY_COLOR,
  },
  {
    // E
    type: 'main',
    widthRatio: 1 / 7,
    position: 4 / 7,
  },
  {
    // F
    type: 'main',
    widthRatio: 1 / 7,
    position: 5 / 7,
  },
  {
    // F#
    type: 'accidental1',
    widthRatio: 0.8 / 7,
    position: 5.5 / 7,
    color: BLACK_KEY_COLOR,
  },
  {
    // G
    type: 'main',
    widthRatio: 1 / 7,
    position: 6 / 7,
  },
  {
    // G#
    type: 'accidental1',
    widthRatio: 0.8 / 7,
    position: 6.7 / 7,
    color: BLACK_KEY_COLOR,
  },
];

const SMALL_KEY_RATIO = 0.75;
const BAGLAMA_WIDTH = 17 - 5 * (1 - SMALL_KEY_RATIO);
const BAGLAMA_KEYS = [
  {
    // A
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: 0 / BAGLAMA_WIDTH,
  },
  {
    // A#
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: 1 / BAGLAMA_WIDTH,
    color: BLACK_KEY_COLOR,
  },
  {
    //
    type: 'main',
    widthRatio: SMALL_KEY_RATIO / BAGLAMA_WIDTH,
    position: 2 / BAGLAMA_WIDTH,
    color: QUARTER_TONE_KEY_COLOR,
  },
  {
    // B
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (3 - (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    // C
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (4 - (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    //
    type: 'main',
    widthRatio: SMALL_KEY_RATIO / BAGLAMA_WIDTH,
    position: (5 - (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: QUARTER_TONE_KEY_COLOR,
  },
  {
    // C#
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (6 - 2 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: BLACK_KEY_COLOR,
  },
  {
    // D
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (7 - 2 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    // D#
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (8 - 2 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: BLACK_KEY_COLOR,
  },
  {
    //
    type: 'main',
    widthRatio: SMALL_KEY_RATIO / BAGLAMA_WIDTH,
    position: (9 - 2 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: QUARTER_TONE_KEY_COLOR,
  },
  {
    // E
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (10 - 3 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    // F
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (11 - 3 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    //
    type: 'main',
    widthRatio: SMALL_KEY_RATIO / BAGLAMA_WIDTH,
    position: (12 - 3 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: QUARTER_TONE_KEY_COLOR,
  },
  {
    // F#
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (13 - 4 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: BLACK_KEY_COLOR,
  },
  {
    // G
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (14 - 4 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
  },
  {
    // G#
    type: 'main',
    widthRatio: 1 / BAGLAMA_WIDTH,
    position: (15 - 4 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: BLACK_KEY_COLOR,
  },
  {
    //
    type: 'main',
    widthRatio: SMALL_KEY_RATIO / BAGLAMA_WIDTH,
    position: (16 - 4 * (1 - SMALL_KEY_RATIO)) / BAGLAMA_WIDTH,
    color: QUARTER_TONE_KEY_COLOR,
  },
];

const TRADITIONAL_BAGLAMA_PITCHES = [
  0, // A
  99, // A#
  151,
  204, // B
  303, // C
  355, //
  408, // C#
  498, // D
  597, // D#
  649,
  702, // E
  801, // F
  853,
  906, // F#
  996, // G
  1095, // G#
  1147,
];

const URMAVI_PITCHES = [
  0,
  90,
  180,
  204,
  294,
  384,
  408,
  498,
  588,
  678,
  702,
  792,
  882,
  906,
  996,
  1086,
  1177,
];

const BAGLAMA_24TET_PITCHES = [
  0, // A
  100, // A#
  150,
  200, // B
  300, // C
  350, //
  400, // C#
  500, // D
  600, // D#
  650,
  700, // E
  800, // F
  850,
  900, // F#
  1000, // G
  1100, // G#
  1150,
];

const BAGLAMA_72TET_PITCHES = [
  0,
  100,
  150,
  200,
  300,
  367,
  400,
  500,
  600,
  667,
  700,
  800,
  867,
  900,
  1000,
  1100,
  1150,
];

const STEPS_72 = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66];
const STEPS_53 = [0, 4, 9, 13, 18, 22, 27, 31, 35, 40, 44, 49];
const STEPS_106 = [0, 8, 18, 26, 36, 44, 54, 62, 70, 80, 88, 98];

export const TUNINGS = [
  {
    name: '72-TET',
    description:
      'Western 12-TET scale further subdivided 6 times. Since 72 is divisible by 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, and 72, 72-TET includes all those equal temperaments.',
    keys: PIANO_KEYS.map((key, index) => {
      return {
        pitch: (STEPS_72[index] * CENTS_IN_OCTAVE) / 72,
        step: STEPS_72[index],
        ...key,
      };
    }),
    switchInterval: CENTS_IN_OCTAVE / 72,
  },
  {
    name: '53-TET',
    description:
      'Used to describe the intervals of Classical Turkish Music according to the Arel-Ezgi-Uzdilek System, although discrepancies have been observed between theory and practice. This temperament is known to approximate Pythagorean tuning very closely, and the default places of the switches are equivalent to an A-based Pythagorean tuning.',
    keys: PIANO_KEYS.map((key, index) => {
      return {
        pitch: (STEPS_53[index] * CENTS_IN_OCTAVE) / 53,
        step: STEPS_53[index],
        ...key,
      };
    }),
    switchInterval: CENTS_IN_OCTAVE / 53,
  },
  {
    name: '106-TET',
    description: 'A two-fold division of 53-TET.',
    keys: PIANO_KEYS.map((key, index) => {
      return {
        pitch: (STEPS_106[index] * CENTS_IN_OCTAVE) / 106,
        step: STEPS_106[index],
        ...key,
      };
    }),
    switchInterval: CENTS_IN_OCTAVE / 106,
  },
  {
    name: 'Traditional Baglama Scale',
    description: 'As reported by Tura.',
    keys: BAGLAMA_KEYS.map((key, index) => {
      return {
        pitch: TRADITIONAL_BAGLAMA_PITCHES[index],
        ...key,
      };
    }),
    switchInterval: 10,
  },
  {
    name: "Urmawi's 17-tone Pythagorean Scale",
    description: 'As described in Kitab al-Adwar.',
    keys: BAGLAMA_KEYS.map((key, index) => {
      return {
        pitch: URMAVI_PITCHES[index],
        ...key,
      };
    }),
    switchInterval: 10,
  },
  {
    name: '24-TET Baglama Scale',
    description: 'A 24-TET modification of the Baglama scale according to contemporary practice.',
    keys: BAGLAMA_KEYS.map((key, index) => {
      return {
        pitch: BAGLAMA_24TET_PITCHES[index],
        ...key,
      };
    }),
    switchInterval: 10,
  },
  {
    name: '72-TET Baglama Scale',
    description:
      'Similar to 24-TET Baglama Scale, but certain frets are modified to produce the traditional mujannab interval.',
    keys: BAGLAMA_KEYS.map((key, index) => {
      return {
        pitch: BAGLAMA_72TET_PITCHES[index],
        ...key,
      };
    }),
    switchInterval: 10,
  },
];

// export function getAttributes(keyNumber, tuning) {
//   let midiDistance = keyNumber - BASE_MIDI_NOTE_NUMBER;
//   let nKeys = tuning.keys.length;
//   let keyIndex = midiDistance % nKeys;
//   if (keyIndex < 0) {
//     keyIndex = keyIndex + nKeys;
//   }
//   let octaves = Math.floor(midiDistance / nKeys);
//   return keyIndex, octaves;
// }
