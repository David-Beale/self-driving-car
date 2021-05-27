/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("sim.js");
importScripts("genetics.js");

const sim = new Sim();

const genetics = new Genetics();

self.onmessage = () => {
  let bestDNA;
  let bestScore = 0;
  let progress = 10;
  genetics.totalScores = 0;

  genetics.arrayOfDNA.forEach((DNA, index) => {
    DNA.fitness = sim.simulate(DNA);

    genetics.totalScores += DNA.fitness;

    if (DNA.fitness > bestScore) {
      bestScore = DNA.fitness;
      bestDNA = DNA;
    }
    if ((100 * index) / genetics.arrayOfDNA.length >= progress) {
      self.postMessage({ progress });
      progress += 10;
    }
  });

  genetics.createNewGeneration();

  self.postMessage({
    bestDNA: sim.translateDNA(bestDNA),
    bestScore,
    avgScore: genetics.totalScores / genetics.arrayOfDNA.length,
  });
};
