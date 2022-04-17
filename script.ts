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

const solfeg: Array<SolfegSound> = ['do', 're', 'ra', 'me', 'mi', 'fa', 'se', 'so', 'le', 'la', 'te', 'ti'];

const songs: Array<Array<SolfegSound>> = [
  ['do', 'mi', 'so', 'mi', 'fa', 'ra', 'do'],
  ['mi', 'fa', 'ra', 'mi', 'do'], // beauty and the beast
  ['mi', 'so', 'ti', 'do', 'fa'], // beauty and the beast
  ['do', 'so', 'do', 'mi', 'so', 'fa', 'ra', 'do'], // beethoven sonata
];

function playNotes(which: Array<SolfegSound>) {
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

function getRandom(from: Array<any>) {
  return from[Math.floor(Math.random() * from.length)];
}

function draw_buttons() {
  const buttons_div = document.getElementById('buttons');
  buttons_div.innerHTML = '';
  solfeg.forEach((name, index) => {
    const button = document.createElement('button');
    button.id = name;
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
    buttons_div.appendChild(button);
  });
}

function setUpButtons(guesses, checkCorrect) {
  solfeg.forEach((name, index) => {
    const button = document.getElementById(name);
    button.onclick = () => {
      guesses.push(name);
      render_guesses();
      checkCorrect(guesses);
    };
    document.getElementById('buttons').appendChild(button);
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

const guesses: Array<SolfegSound> = [];
let musica: Array<SolfegSound> = []
const frequencies = get_frequencies();

function do_interval() {
  musica = ['do', getRandom(solfeg)];
  render_guesses();
  setUpButtons(guesses, checkCorrect);
  function checkCorrect(guesses) {
    if (guesses.length < musica.length) { return; }
    const correct: boolean = musica.every((note, index) =>
                                          guesses[index] == note);
    document.getElementById('answer').innerHTML = correct ?
      "correct" : "try again :^)" ;
  }
  document.getElementById('answer').innerHTML = '';
  playNotes(musica);
}

function do_melody() {
  musica = ['do', ...getRandom(songs)];
  render_guesses();
  setUpButtons(guesses, checkCorrect);
  function checkCorrect(guesses) {
    if (guesses.length < musica.length) { return; }
    const correct: boolean = musica.every((note, index) =>
                                          guesses[index] == note);
    if (correct) {
      document.getElementById('answer').innerHTML = "correct";
      musica.length = 0;
    } else {
      document.getElementById('answer').innerHTML = "try again :^)";
    }
  }
  document.getElementById('answer').innerHTML = '';
  playNotes(musica);
}

function main() {
  guesses.length = 0;
  const mode = (document.querySelector('input[name="mode"]:checked') as HTMLInputElement).value;
  switch (mode) {
    case 'interval':
      do_interval();
      break;
    case 'melody':
      do_melody();
      break;
  }
}

draw_buttons();

document.getElementById('play').onclick = () => musica.length ? playNotes(musica) : main();
document.getElementById('play').focus();
document.getElementById('play').onkeydown = (event) => event.key === 'ArrowDown' ? document.getElementById('do').focus() : null;

document.onkeydown = (event) => {
  switch (event.key) {
    case 'Enter': main();
                  break;
    case 'Backspace': delete_last_guess();
                      break;
    default: console.log("key was pressed: " + event.key)
  }
}
