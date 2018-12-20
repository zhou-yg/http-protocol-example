// www.google.com
// 216.58.199.14
// 美国 加利福尼亚州圣克拉拉县山景市谷歌公司
import './bin/utils'
import {units} from './bin/chapters';

const listDom = document.querySelector('#list');

listDom.innerHTML = '';

Object.keys(units).forEach(k => {

  let b = document.createElement('button');
  b.className = 'unit-btn';
  b.innerText = k;
  b.onclick = units[k];
  listDom.appendChild(b);
});
