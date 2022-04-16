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
 [key in SolfegSound]: Number;
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

function main() {
  musica = ['do', getRandom()];
  render_guesses();
  const frequencies = get_frequencies();
  setUpButtons(guesses, checkCorrect);
  function checkCorrect(guesses) {
    if (guesses.length < musica.length) { return; }
    const correct: boolean = musica.every((note, index) =>
                                          guesses[index] == note);
    document.getElementById('answer').innerHTML = correct ?
      "correct" : "try again :^)" ;
  }
  document.getElementById('answer').innerHTML = '';
  playNotes(musica, frequencies);
}

draw_buttons();

document.getElementById('play').onclick = main;
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
