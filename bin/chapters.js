import chapterDns from './chapters/chapter-dns';
import chapterHttp from './chapters/chapter-http';
import chapterTcp from './chapters/chapter-tcp';

const CHAPTERS = {
  chapterDns,
  chapterHttp,
  chapterTcp,
};

function runFn(fn, arg = {}, cb) {
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

      if (nextValue.value instanceof Promise) {
        nextValue.value.then(v => {
          nextValue.value = v;
          requestAnimationFrame(t);
        });
      }
    } else {
      arg.prevResult = nextValue.value;

      cb && cb(arg);
    }
  }

  requestAnimationFrame(t);
}

export const units = Object.keys(CHAPTERS).map((k, i) => {
  let fn = CHAPTERS[k];
  return {
    [k]: () => runFn(fn),
  };
}).reduce((p, n) => Object.assign(p, n), {});

export const start = Object.values(CHAPTERS).map(fn => {
  return function (arg = {}, next) {

    runFn(fn, arg, (result) => {
      next && next(result);
    });
  };
}).reduceRight((nextFn, fn) => {
  return (arg) => fn(arg, nextFn);
}, null);
