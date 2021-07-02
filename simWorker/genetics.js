class Genetics {
  constructor() {
    this.mutationRate = 0.01;
    this.reset = true;
    this.populationSize = 100;
    this.arrayOfDNA = [];
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
    if (this.reset) {
      this.resetPopulation();
      return;
    }
    const newArrayOfDNA = [];
    for (let i = 0; i < this.populationSize; i++) {
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

  resetPopulation() {
    this.arrayOfDNA = this.randomiseDNA(this.populationSize);
    this.reset = false;
  }
}
