// www.google.com
// 216.58.199.14
// 美国 加利福尼亚州圣克拉拉县山景市谷歌公司
import {start} from './bin/chapters';


const globalConfig = {
  url: 'http://www.google.com',
  isStop: false,
  prevResult: null,
};

window.gameStart = () => {
  document.querySelector('.content').remove();

  start(globalConfig);
};
