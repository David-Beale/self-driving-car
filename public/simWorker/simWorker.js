/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("sim.js");
importScripts("genetics.js");

const sim = new Sim();

const genetics = new Genetics();

self.onmessage = () => {
  let bestDNA;
  let bestScore = 0;
  genetics.totalScores = 0;

  genetics.arrayOfDNA.forEach((DNA) => {
    DNA.fitness = sim.simulate(DNA);

    genetics.totalScores += DNA.fitness;

    if (DNA.fitness > bestScore) {
      bestScore = DNA.fitness;
      bestDNA = DNA;
    }
  });

  genetics.createNewGeneration();

  self.postMessage([sim.translateDNA(bestDNA), bestScore]);
};
