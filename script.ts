const audioContext = new AudioContext();
const volume = audioContext.createGain();
volume.connect(audioContext.destination);
volume.gain.value = .2;

const solfeg = ['do', 're', 'ra', 'me', 'mi', 'fa', 'se', 'so', 'le', 'la', 'te', 'ti'];

function playNotes(which, frequencies) {
  var oscillator = audioContext.createOscillator();
  oscillator.type = "sawtooth";
  oscillator.connect(volume);
  oscillator.frequency.value = frequencies[which[0]];
  oscillator.start();
  which.forEach((note, index) => {
    setTimeout(() => {
      oscillator.frequency.value = frequencies[note];
    }, 500 * index);
  });
  setTimeout(() => oscillator.stop(), 500 * which.length);
}

function getRandom() {
  return solfeg[Math.floor(Math.random() * solfeg.length)];
}

function setUpButtons(guesses, checkCorrect) {
  document.getElementById('buttons').innerHTML = '';
  solfeg.forEach((name, index) => {
    const button = document.createElement('button');
    button.id = name;
    button.innerHTML = name;
    button.onclick = () => {
      guesses.push(name);
      document.getElementById('guess').innerHTML = guesses;
      checkCorrect(guesses);
    };
    button.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          document.getElementById(solfeg[index - 1]).focus();
          break;
        case 'ArrowRight':
          document.getElementById(solfeg[index + 1]).focus();
          break;
        case 'ArrowUp':
          document.getElementById('play').focus();
          break;
      }
    };
    document.getElementById('buttons').appendChild(button);
  });
}

function get_frequencies() {
  const a1 = 110; // A1 is 110 Hz
  const rootPitch = Math.random() * 700 + a1;
  const frequencies = {};
  solfeg.forEach((name, index) => {
    frequencies[name] = rootPitch * Math.pow(2, index/12);
  });
  return frequencies;
}

function main() {
  const frequencies = get_frequencies();
  const guesses = [];
  const musica = ['do', getRandom()];
  setUpButtons(guesses, checkCorrect);
  function checkCorrect(guesses) {
    if (guesses.length < musica.length) { return; }
    const correct = musica.every((note, index) => guesses[index] == note)
      ? "correct" : "try again :^)" ;
    document.getElementById('answer').innerHTML = correct;
    if (!correct) {
      guesses.length = 0;
    }
  }
  document.getElementById('answer').innerHTML = '';
  document.getElementById('guess').innerHTML = '';
  playNotes(musica, frequencies);
}

document.getElementById('play').onclick = main;
document.getElementById('play').focus();
document.getElementById('play').onkeydown = (event) => event.key === 'ArrowDown' ? document.getElementById('do').focus() : null;

document.onkeypress = (event) => event.key === 'Enter' ? main() : null;
