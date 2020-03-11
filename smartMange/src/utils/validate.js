/**
 * Created by PanJiaChen on 16/11/18.
 * amend by luqiang on 05/07/19
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  if(!str) return false
  return str.trim().length >= 4
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function valiVercode(str) {
  if(!str) return false
  return str.trim().length == 4
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function valiVerselect(str) {
  if(!str) return false
  return str.trim().length > 0
}