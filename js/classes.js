/* eslint-disable no-unused-vars */
"use strict";

class Task {
  constructor(baseData) {
    this.baseData = baseData;
    this.name = baseData.name;
    this.level = 0;
    this.maxLevel = 0;
    this.xp = 0;

    this.xpMultipliers = [
    ];
  }

  getMaxXp() {
    const maxXp = Math.round(this.baseData.maxXp * (this.level + 1) * Math.pow(1.01, this.level));
    return maxXp;
  }

  getXpLeft() {
    return Math.round(this.getMaxXp() - this.xp);
  }

  getMaxLevelMultiplier() {
    const maxLevelMultiplier = 1 + this.maxLevel / 10;
    return maxLevelMultiplier;
  }

  getXpGain() {
    return applyMultipliers(10, this.xpMultipliers);
  }

  increaseXp() {
    this.xp += applySpeed(this.getXpGain());
    if (this.xp >= this.getMaxXp()) {
      let excess = this.xp - this.getMaxXp();
      while (excess >= 0) {
        this.level += 1;
        excess -= this.getMaxXp();
      }
      this.xp = this.getMaxXp() + excess;
    }
  }
}

class Job extends Task {
  constructor(baseData) {
    super(baseData);
    this.incomeMultipliers = [
    ];
  }

  getLevelMultiplier() {
    const levelMultiplier = 1 + Math.log10(this.level + 1);
    return levelMultiplier;
  }

  getIncome() {
    return applyMultipliers(this.baseData.income, this.incomeMultipliers);
  }
}

class Skill extends Task {
  getEffect() {
    const effect = 1 + this.baseData.effect * this.level;
    return effect;
  }

  getEffectDescription() {
    const description = this.baseData.description;
    const text = `x${String(this.getEffect().toFixed(2))} ${description}`;
    return text;
  }
}

class Item {
  constructor(baseData) {
    this.baseData = baseData;
    this.name = baseData.name;
    this.expenseMultipliers = [

    ];
  }

  getEffect() {
    if (gameData.currentProperty !== this && !gameData.currentMisc.includes(this)) return 1;
    const effect = this.baseData.effect;
    return effect;
  }

  getEffectDescription() {
    let description = this.baseData.description;
    if (itemCategories.Properties.includes(this.name)) description = "Happiness";
    const text = `x${this.baseData.effect.toFixed(1)} ${description}`;
    return text;
  }

  getExpense() {
    return applyMultipliers(this.baseData.expense, this.expenseMultipliers);
  }
}

class Requirement {
  constructor(elements, requirements) {
    this.elements = elements;
    this.requirements = requirements;
    this.completed = false;
  }

  isCompleted() {
    if (this.completed) return true;
    for (const requirement of this.requirements) {
      if (!this.getCondition(requirement)) {
        return false;
      }
    }
    this.completed = true;
    return true;
  }
}

class TaskRequirement extends Requirement {
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "task";
  }

  getCondition(requirement) {
    return gameData.taskData[requirement.task].level >= requirement.requirement;
  }
}

class CoinRequirement extends Requirement {
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "coins";
  }

  getCondition(requirement) {
    return gameData.coins >= requirement.requirement;
  }
}

class AgeRequirement extends Requirement {
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "age";
  }

  getCondition(requirement) {
    return daysToYears(gameData.days) >= requirement.requirement;
  }
}

class EvilRequirement extends Requirement {
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "evil";
  }

  getCondition(requirement) {
    return gameData.evil >= requirement.requirement;
  }
}

class EssenceRequirement extends Requirement {
  constructor(elements, requirements) {
    super(elements, requirements);
    this.type = "essence";
  }

  getCondition(requirement) {
    return gameData.essence >= requirement.requirement;
  }
}