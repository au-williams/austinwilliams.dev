import { animatorConfig } from "./_config";

// 1, 5
// export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const getRandomNumber = max => Math.floor(Math.random() * max) + 1;

// probability is the chance for a true value - 0.5 equals 50% chance to be true
export const getRandomBool = (probability = 0.5) => Math.random() < probability;

// export const getRandomSize = (maxSize = animatorConfig.codeBlockMaxSize) => {
//   if (maxSize > animatorConfig.codeBlockMaxSize)
//     maxSize = animatorConfig.codeBlockMaxSize;
//   return getRandomNumber(animatorConfig.codeBlockMinSize, maxSize);
// }