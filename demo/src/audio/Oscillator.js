// See e.g. https://github.com/jxnblk/bumpkit/blob/master/src/Bumpkit.js
// for audio org example

class Oscillator {
  constructor(options = {}) {
    console.log(options);
    this.audioContext = options.audioContext;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = options.gain;
    this.gainNode.connect(this.audioContext.destination);

    this.oscillators = {};
  }

  start(freq) {
    if (this.oscillators[freq]) {
      return;
    }

    let oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = freq;
    oscillator.connect(this.gainNode);
    oscillator.start(0);

    // console.log('playing frequency at value', oscillator.frequency.value);

    this.oscillators[freq] = oscillator;
  }

  stop(freq) {
    if (!this.oscillators[freq]) {
      return;
    }

    this.oscillators[freq].stop(0);
    this.oscillators[freq].disconnect();
    delete this.oscillators[freq];
  }
}

export default Oscillator;
