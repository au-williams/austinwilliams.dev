// probability is the chance for a true value — 0.5 equals 50% chance to be true
export const getRandomBool = (probability = 0.5) => Math.random() < probability;

// max is maximum random value — e.g. max = 5 ... result range 1 through 5
export const getRandomNumber = max => Math.floor(Math.random() * max) + 1;