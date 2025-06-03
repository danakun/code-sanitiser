/**
 * Sets up a counter element with click functionality
 * @param {HTMLElement} element - The DOM element to attach counter to
 * @returns {void}
 */
export function setupCounter(element) {
  let counter = 0;
  
  const setCounter = count => {
    counter = count;
    element.innerHTML = `count is ${counter}`;
  };
  
  element.addEventListener('click', () => setCounter(counter + 1));
  
  setCounter(0);
}