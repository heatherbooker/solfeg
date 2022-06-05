const audioContext = new AudioContext();
const volume = audioContext.createGain();
volume.connect(audioContext.destination);
volume.gain.value = .2;

type SolfegSound = 'do'
                 | 're'
                 | 'ra'
                 | 'me'
                 | 'mi'
                 | 'fa'
                 | 'se'
                 | 'so'
                 | 'le'
                 | 'la'
                 | 'te'
                 | 'ti' ;

const solfeg: Array<SolfegSound> =
  ['do', 're', 'ra', 'me', 'mi', 'fa', 'se', 'so', 'le', 'la', 'te', 'ti'];

const ionian: Array<SolfegSound> =
  ['do', 'ra', 'mi', 'fa', 'so', 'la', 'ti'];

const _: Array<Array<SolfegSound>> = [
  ['do', 'mi', 'so', 'mi', 'fa', 'ra', 'do'],
  ['mi', 'fa', 'ra', 'mi', 'do'], // beauty and the beast
  ['mi', 'so', 'ti', 'do', 'fa'], // beauty and the beast
  ['do', 'so', 'do', 'mi', 'so', 'fa', 'ra', 'do'], // beethoven sonata
  ['la', 'so'],
  ['la', 'do'],
  ['la', 'fa', 'mi', 'do'],
  ['so', 'la'],
  ['fa', 'la', 'so']
];
const songs: Array<Array<SolfegSound>> = [
  ['la', 'so'],
  ['la', 'do'],
  ['la', 'fa', 'mi', 'do'],
  ['so', 'la'],
  ['fa', 'la', 'so']
];

function playNotes(which: Array<SolfegSound>) {
  const oscillator = audioContext.createOscillator();
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

function getRandom(from: Array<any>) {
  return from[Math.floor(Math.random() * from.length)];
}

function draw_buttons() {
  const buttons_div = document.getElementById('buttons');
  solfeg.forEach((name, index) => {
    const button = document.createElement('button');
    button.id = name;
    if (ionian.includes(name)) {
      button.className = "diatonic";
      buttons_div.querySelector('#diatonic-buttons').appendChild(button);
    } else {
      button.className = "chromatic";
      buttons_div.querySelector('#chromatic-buttons').appendChild(button);
    }
    button.innerHTML = name;
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
  });
}

function setUpButtons(guesses, checkCorrect) {
  solfeg.forEach((name, index) => {
    const button = document.getElementById(name);
    button.onclick = () => {
      if (guesses.length === musica.length) {
        guesses.length = 0;
      }
      guesses.push(name);
      render_guesses();
      checkCorrect(guesses);
    };
  });
}

type Frequencies = {
 [key in SolfegSound]: number;
}

function get_frequencies(): Frequencies {
  const a1 = 110; // A1 is 110 Hz
  const rootPitch = Math.random() * 700 + a1;
  const frequencies = solfeg.reduce((all, name, index) => {
    all[name] = rootPitch * Math.pow(2, index/12);
    return all;
  }, {});
  return frequencies as Frequencies;
}

function entered() {
  console.log("enter pressed");
}

function delete_last_guess() {
  guesses.pop();
  render_guesses();
}

function render_guesses() {
  const text = musica.map((note, index) =>
    guesses[index] ? guesses[index] :  "?"
  ) .join(', ');
  document.getElementById('guess').innerHTML = text;
}

let correct: boolean = false;
const guesses: Array<SolfegSound> = [];
let musica: Array<SolfegSound> = ['do', getRandom(solfeg)];
let frequencies = get_frequencies();

function setup_interval() {
  musica = ['do', getRandom(solfeg)];
}

function setup_melody() {
  musica = ['do', ...getRandom(songs)];
}

function play_game() {
  render_guesses();
  setUpButtons(guesses, checkCorrect);
  function checkCorrect(guesses) {
    if (guesses.length < musica.length) { return; }
    correct = musica.every((note, index) =>
                                          guesses[index] == note);
    if (correct) {
      document.getElementById('answer').innerHTML = "correct";
    } else {
      document.getElementById('answer').innerHTML = "try :^)";
    }
  }
  document.getElementById('answer').innerHTML = '';
  playNotes(musica);
  document.getElementById('play').onclick = () => playNotes(musica);
}

function setup_game() {
  frequencies = get_frequencies();
  guesses.length = 0;
  musica.length = 0;
  const mode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement).value;
  switch (mode) {
    case 'interval':
      setup_interval();
      break;
    case 'melody':
      setup_melody();
      break;
  }
}

function new_game() {
  setup_game();
  play_game();
}

draw_buttons();

document.getElementById('new-game').onclick = () => new_game();
document.getElementById('play').onclick = () => play_game();
document.getElementById('play').focus();
document.getElementById('play').onkeydown = (event) => event.key === 'ArrowDown' ? document.getElementById('do').focus() : null;

document.onkeydown = (event) => {
  switch (event.key) {
    case 'Enter': new_game();
                  break;
    case 'Backspace': delete_last_guess();
                      break;
    default: console.log("key was pressed: " + event.key)
  }
}
