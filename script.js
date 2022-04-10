const audioContext = new AudioContext();
const volume = audioContext.createGain();
volume.connect(audioContext.destination);
volume.gain.value = .2;

const rootPitch = 220; // A3

const solfeg = ['do', 're', 'ra', 'me', 'mi', 'fa', 'se', 'so', 'le', 'la', 'te', 'ti'];
const frequencies = {};
solfeg.forEach((name, index) => {
  frequencies[name] = rootPitch * Math.pow(2, index/12);
  const button = document.createElement('button');
  button.id = name;
  button.innerHTML = name;
  button.onclick = () => console.log(name);
  document.getElementById('buttons').appendChild(button);
});


function playNotes(which) {
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

playNotes(['do', getRandom()]);
