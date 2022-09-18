
import wordlist from 'bip39-en';
import gn from '@geo-phrase/geo-number';

Object.freeze(wordlist);
const SIZE = wordlist.length;

const word2id = (() => {
  const map = new Map();
  wordlist.map((word, i) => map.set(word, i));
  return word => map.get(word.toLowerCase());
})();

const id2word = id => wordlist[id];

const words2number = words => {
  return words
    .map(word2id)
    .reduce((res, n) => res * SIZE + n, 0);
};

const number2words = number => {
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

export default {
  list: wordlist,
  word2id,
  id2word,
};
