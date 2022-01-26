/**
 * null 체크 함수
 * @param {*} obj
 * @returns obj is null : true,
 *          obj it not null : false
 */
export function isNull(obj) {
  if (obj == '' || obj == null || obj == undefined || typeof obj == 'undefined')
    return true;
  else return false;
}
