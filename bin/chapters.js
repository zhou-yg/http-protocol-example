import chapterDns from './chapters/chapter-dns';
import chapterHttp from './chapters/chapter-http';

export const start = [
  chapterDns,
  chapterHttp,
].map(fn => {
  return function (arg = {}, next) {

    let gen = fn(arg);
    let nextValue = {
      value: null,
      done: false,
    };

    function t() {

      if (!arg.isStop) {
        nextValue = gen.next(nextValue.value);
      }

      if (!nextValue.done) {
        requestAnimationFrame(t);
      } else {
        arg.prevResult = nextValue.value;

        next && next(arg);
      }
    }

    requestAnimationFrame(t);
  };
}).reduceRight((nextFn, fn) => {
  return (arg) => fn(arg, nextFn);
}, null);
