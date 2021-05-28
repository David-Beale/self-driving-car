/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
importScripts("sim.js");
importScripts("genetics.js");

const sim = new Sim();

const genetics = new Genetics();

self.onmessage = (e) => {
  if (e.data.mutationRate) {
    genetics.mutationRate = e.data.mutationRate;
    return;
  }
  if (e.data.populationSize) {
    genetics.populationSize = e.data.populationSize;
    return;
  }
  if (e.data.reset) {
    genetics.reset = true;
    return;
  }
  let bestDNA;
  let bestScore = 0;
  let progress = 10;

  genetics.createNewGeneration();

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

  const allDNA = genetics.arrayOfDNA.map((dna, index) => {
    const newDNA = sim.translateDNA(dna);
    newDNA.id = `${Date.now()}${index}`;
    return newDNA;
  });

  self.postMessage({
    bestDNA: sim.translateDNA(bestDNA),
    bestScore,
    avgScore: genetics.totalScores / genetics.arrayOfDNA.length,
    allDNA,
  });
};
