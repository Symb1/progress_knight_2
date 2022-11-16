class Task {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.level = 0
        this.maxLevel = 0 
        this.xp = 0
        this.isHero = false

        this.xpMultipliers = [
        ]
    }

    getMaxXp() {
        var maxXp = Math.round((this.isHero ? heroMaxXpMult : 1) * this.baseData.maxXp * (this.level + 1) * Math.pow(this.isHero ? 1.1 : 1.01, this.level))

        return maxXp
    }

    getXpLeft() {
        return Math.round(this.getMaxXp() - this.xp)
    }

    getMaxLevelMultiplier() {
        var maxLevelMultiplier = 1 + this.maxLevel / 10
        return maxLevelMultiplier
    }

    getXpGain() {
        var xpGain = (this.isHero ? getHeroXpGainMultipliers(this) : 1) * applyMultipliers(10, this.xpMultipliers)
        return xpGain
    }

    increaseXp() {
        this.xp += applySpeed(this.getXpGain())
        if (this.xp >= this.getMaxXp()) {
            var excess = this.xp - this.getMaxXp()
            while (excess >= 0) {
                this.level += 1
                excess -= this.getMaxXp()
            }
            this.xp = this.getMaxXp() + excess
        }
    }
}

class Milestone {
    constructor(baseData) {
        this.baseData = baseData
        this.name = baseData.name
        this.tier = baseData.tier
        this.expense = baseData.expense
        this.description = baseData.description
    }

    getTier() { return this.tier }
}

class Job extends Task {
    constructor(baseData) {
        super(baseData)   
        this.incomeMultipliers = [
        ]
    }

    getLevelMultiplier() {
        var levelMultiplier = 1 + Math.log10(this.level + 1)
        return levelMultiplier
    }
    
    getIncome() {
        return (this.isHero ? heroIncomeMult : 1) * applyMultipliers(this.baseData.income, this.incomeMultipliers) 
    }
}

class Skill extends Task {
    constructor(baseData) {
        super(baseData)
    }

    getEffect() {
        var effect = 1 + this.baseData.effect * (this.isHero ? 1000 * this.level + 8000 : this.level)
        return effect
    }

    getEffectDescription() {
        var description = this.baseData.description
        var text = "x" + String(this.getEffect().toFixed(2)) + " " + description
        return text
    }
}

class Item {
    constructor(baseData) {  
        this.baseData = baseData
        this.name = baseData.name
        this.expenseMultipliers = [
         
        ]
        this.isHero = false
    }

    getEffect() {
        var effect = this.baseData.effect        

        if (this.isHero) {
            if (itemCategories["Misc"].includes(this.name))
            {
                if (gameData.currentMisc.includes(this))
                    effect *= 10        
            }

            if (itemCategories["Properties"].includes(this.name))
            {
                if (gameData.currentProperty == this)
                    effect *= 2000000
                else
                    effect = 1
            }
        }
        else
        {
            if (gameData.currentProperty != this && !gameData.currentMisc.includes(this)) return 1
        }

        return effect
    }

    getEffectDescription() {
        var description = this.baseData.description
        var effect = this.baseData.effect

        if (this.isHero) {
            if (itemCategories["Misc"].includes(this.name)) {
                    effect *= 10
            }

            if (itemCategories["Properties"].includes(this.name)) {
                description = "Happiness"
                effect *= 2000000
            }
        }
        else {
            if (itemCategories["Properties"].includes(this.name)) description = "Happiness"
        }

        var text = "x" + format(effect) + " " + description
        return text
    }

    getExpense() {
        var heromult = this.baseData.heromult
        return (this.isHero ? 4 * Math.pow(10, heromult) * heroIncomeMult : 1) * applyMultipliers(this.baseData.expense, this.expenseMultipliers) 
    }
}

class Requirement {
    constructor(elements, requirements) {
        this.elements = elements
        this.requirements = requirements
        this.completed = false
    }

    isCompleted() {
        if (this.completed) {return true}
        for (var requirement of this.requirements) {
            if (!this.getCondition(requirement)) {
                return false
            }
        }
        this.completed = true
        return true
    }

    isCompletedActual() {
        for (var requirement of this.requirements) {
            if (!this.getCondition(requirement)) {
                return false
            }
        }
        return true
    }
}

class TaskRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "task"
    }

    getCondition(requirement) {
        return gameData.taskData[requirement.task].level >= requirement.requirement
    }
}

class CoinRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "coins"
    }

    getCondition(requirement) {
        return gameData.coins >= requirement.requirement
    }
}

class AgeRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "age"
    }

    getCondition(requirement) {
        return daysToYears(gameData.days) >= requirement.requirement
    }
}

class EvilRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "evil"
    }

    getCondition(requirement) {
        return gameData.evil >= requirement.requirement
    }    
}

class EssenceRequirement extends Requirement {
    constructor(elements, requirements) {
        super(elements, requirements)
        this.type = "essence"
    }

    getCondition(requirement) {
        return gameData.essence >= requirement.requirement
    }    
}