const lodash = require('lodash');

const ISARR = '$$$';

/**
 * Делает копию {@param val} и удаляет из неё последнюю точку (если таковая есть) и возвращает эту копию
 */
function removePointLast(val) {
  if (!val) return val;
  return val.split('.').filter(Boolean).join('.');
}

/**
 * Рекурсивная функция.
 * Возвращает все *ло-пути (см. [asau217]) из {@param arr} существующие в {@param target}.
 */
function findPaths(arr, target) {

  const pathIndex = arr.findIndex(el => el.includes(ISARR));
  if (pathIndex !== -1) {
    // ^ если в arr есть элемент содержащий подстроку {ISARR}
    const path = arr[pathIndex];
    const pathElems = path.split(ISARR);
    const fPath = removePointLast(pathElems[0]);
    // --- len; кол-во элементов массива fPath; + другие действия
    let len = 0;
    debugger; // del+ 230402130123
    if (!fPath) {
      len = target.length;
    } else {
      const val = lodash.get(target, fPath);
      debugger; // del+ 230402125400
      if (!val) {
        // ^ если на fPath ничего нет
        // удаляем путь из arr
        arr.splice(pathIndex, 1);
      } else {
        len = val.length;
      }
    }
    // ---
    if (len > 0) {
      const sArr = [];
      for (let ix = 0; ix <= len - 1; ix++) {
        const nPath = path.replace(ISARR, ix);
        sArr.push(nPath);
      }
      arr.splice(pathIndex, 1, ...sArr);
    }
    // ---
  }

  if (arr.find(el => el.includes(ISARR))) {
    findPaths(arr, target);
  }

  return arr;
}

/**
 *
 * @param target
 * @param lopPath
 * @param predicate если указан, то значение попадает в результат если удовлетворяет этому предикату
 * @returns {*[]}
 */
function findBy(target, lopPath, predicate) {
  const arr0 = [lopPath];
  const paths = findPaths(arr0, target);
  const res = [];
  paths.forEach(el => {
    const value = lodash.get(target, el);
    if (predicate && predicate(value) || !predicate) {
      res.push({ path: el, value });
    }
  });
  return res;
}

// ---
// ---
// ---

module.exports = {
  lopPathsFind: findBy,
  ISARR,
};