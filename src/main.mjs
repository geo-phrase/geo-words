
import wordlist from 'bip39-en';
import gn from '@geo-phrase/geo-number';

Object.freeze(wordlist);
const SIZE = wordlist.length;

const word2id = (() => {
  const map = new Map();
  wordlist.map((word, i) => map.set(word, i));
  return word => map.get(word.toLowerCase()) ?? -1;
})();

const id2word = id => wordlist[id];

const words2num = words => {
  return words
    .map(word2id)
    .reduce((res, n) => res * SIZE + n, 0);
};

const num2words = number => {
  const res = [];
  while (number > 0) {
    const idx = number % SIZE;
    res.unshift(id2word(idx));
    number = (number - idx) / SIZE;
  }
  return res;
};

// console.log(words2number(['adapt', 'announce', 'arch', 'armor']));
// console.log(number2words(206468989023));

const hex2num = hex => {
  hex = hex.replace(/^0x/, '');
  return parseInt(hex, 16);
};

const num2hex = (num, prefix = '0x') => {
  return `${prefix}${num.toString(16)}`;
};

const bits2num = bits => {
  return parseInt(bits.join(''), 2);
};

const GeoWords = () => {
  let num, lat, lon, bitsLen;

  const recalc = setter => {
    num = setter();
    const coords = gn.number2coords(num);
    lat = coords.latitude;
    lon = coords.longitude;
    bitsLen = coords.sigBits.length;
  }

  return {
    set num(n) { recalc(() => n); },
    set hex(hex) { reclc(() => hex2num(hex)); },
    set bits(bits) {
      if (typeof bits === 'number') {
        recalc(() => bits2num(new Array(bits).fill(0)));
      } else {
        recalc(() => bits2num(bits));
      }
    },
    set words(words) { recalc(() => words2num(words)); },
    set latitude(latitude) { recalc(() => gn.coords2number(latitude, lon, bitsLen)); },
    set longitude(longitude) { recalc(() => gn.coords2number(lat, longitude, bitsLen)); },

    get num() { return num; },
    get bitsLen() { return bitsLen; },
    get hex() { return num2hex(num); },
    get bits() { return gn.number2coords(num).sigBits; },
    get words() { return num2words(num); },
    get latitude() { return gn.number2coords(num).latitude; },
    get longitude() { return gn.number2coords(num).longitude; },
    get locDetails() { return gn.number2coords(num); },
  };
};

GeoWords.wordlist = wordlist;
GeoWords.word2id = word2id;
GeoWords.id2word = id2word;

export {
  wordlist,
  word2id,
  id2word,
};
export default GeoWords;
