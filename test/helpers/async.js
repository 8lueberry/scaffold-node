//
// Promise helper for tests
//

/**
 * Waits for all the async function to be called
 */
const wait = (waitTime = 0) => new Promise(resolve => setTimeout(resolve, waitTime));

global.wait = wait;
