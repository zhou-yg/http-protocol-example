import Raphael from 'raphael';

module.exports = function * (pre) {

  let r = Raphael('board', 800, 400);

  let p = r.rect(20, 10)

  let c = r.rect(400, 50, 100, 200);
  c.attr({
    fill: '#fff',
    'stroke-width': 2,
    'stroke': '#000'
  });

  console.log(2);

  console.log(pre);
}
