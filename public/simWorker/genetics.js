class Genetics {
  constructor() {
    this.mutationRate = 0.01;
    this.arrayOfDNA = this.randomiseDNA(100);
    this.totalScores = 0;
  }

  randomiseDNA(num) {
    const arrayOfDNA = [];
    for (let i = 0; i < num; i++) {
      const newDNA = [];
      for (let j = 0; j < 6; j++) {
        newDNA.push(this.randomNumber());
      }
      // const newDNA = {
      //   testingData: true
      //   steerVal: 0.875,
      //   maxForce: 1000,
      //   maxBrakeForce: 20,
      //   maxSpeed: 18,
      //   stoppingDistance: 35,
      //   slowDistance: 20,
      // };
      arrayOfDNA.push(newDNA);
    }
    return arrayOfDNA;
  }

  randomNumber() {
    return Math.random() * 2 - 1;
  }

  createNewGeneration() {
    if (this.newPopulationSize) this.updatePopulationSize();
    if (this.reset) this.resetPopulation();
    if (!this.arrayOfDNA[0].fitness) return; //array is random

    const newArrayOfDNA = [];
    for (let i = 0; i < this.arrayOfDNA.length; i++) {
      const parent1 = this.pickRandom();
      const parent2 = this.pickRandom();
      const child = this.bonk(parent1, parent2);
      newArrayOfDNA.push(child);
    }
    this.arrayOfDNA = newArrayOfDNA;
  }

  pickRandom() {
    let index = 0;
    let rand = Math.random() * this.totalScores;
    while (rand > 0) {
      rand -= this.arrayOfDNA[index].fitness;
      index++;
    }
    return this.arrayOfDNA[index - 1];
  }

  bonk(parent1, parent2) {
    const child = [];
    parent1.forEach((value, index) => {
      //1% chance of mutation
      if (Math.random() < this.mutationRate) {
        child[index] = this.randomNumber();
      }
      //otherwise 50% chance of inheriting from each parent
      else {
        child[index] = Math.random() < 0.5 ? parent1[index] : parent2[index];
      }
    });
    return child;
  }
  updatePopulationSize() {
    if (this.newPopulationSize < this.arrayOfDNA.length) {
      this.arrayOfDNA = this.arrayOfDNA.slice(0, this.newPopulationSize);
    } else {
      const diff = this.newPopulationSize - this.arrayOfDNA.length;
      const newPopualtion = this.randomiseDNA(diff);
      this.arrayOfDNA = [...this.arrayOfDNA, ...newPopualtion];
    }
    this.newPopulationSize = false;
  }
  resetPopulation() {
    this.arrayOfDNA = this.randomiseDNA(this.arrayOfDNA.length);
    this.reset = false;
  }
}
