function getHypercubeGeneration() {
    if (gameData.rebirthFiveCount == 0) return 0   

    return 0.03 * gameData.metaverse.hypercube_gain_modifier * (gameData.perks.hypercube_boost == 1 ? 10 : 1)
        * (gameData.perks.hyper_speed == 1 ? 1000 : 1)

}

function getBoostTimeSeconds() {
    let defaultTime = 60.0 * gameData.metaverse.boost_timer_modifier

    return defaultTime
}

function getBoostCooldownSeconds() {
    let defaultTime = 60.0 * 10.0 / gameData.metaverse.boost_cooldown_modifier

    return defaultTime
}

function canApplyBoost() {
    return gameData.boost_cooldown <= 0 && !gameData.boost_active;
}

function applyBoost() {
    if (canApplyBoost()) {
        gameData.boost_timer = getBoostTimeSeconds();
        gameData.boost_active = true;
    }
}

// shop
function reduceBoostCooldownCost() {
    return 1000 * Math.pow(3, gameData.metaverse.boost_cooldown_modifier - 1)
}

function canBuyReduceBoostCooldown() {
    return gameData.hypercubes >= reduceBoostCooldownCost()
}

function buyReduceBoostCooldown() {
    if (canBuyReduceBoostCooldown()) {
        gameData.hypercubes -= reduceBoostCooldownCost()
        gameData.metaverse.boost_cooldown_modifier += 1        
    }
}


function boostDurationCost() {
    return 5000 * Math.pow(5, gameData.metaverse.boost_timer_modifier - 1)
}

function canBuyBoostDuration() {
    return gameData.hypercubes >= boostDurationCost()
}

function buyBoostDuration() {
    if (canBuyBoostDuration()) {
        gameData.hypercubes -= boostDurationCost()
        gameData.metaverse.boost_timer_modifier += 1
    }
}


function hypercubeGainCost() {
    return 800 * Math.pow(1.5, gameData.metaverse.hypercube_gain_modifier - 1)
}

function canBuyHypercubeGain() {
    return gameData.hypercubes >= hypercubeGainCost()
}

function buyHypercubeGain() {
    if (canBuyHypercubeGain()) {
        gameData.hypercubes -= hypercubeGainCost()
        gameData.metaverse.hypercube_gain_modifier += 1
    }
}

function evilTranGain() {
    return (gameData.metaverse.evil_tran_gain == 0) ? 0 : 250000 * Math.pow(10, gameData.metaverse.evil_tran_gain)
}

function evilTranCost() {
    return 100000000 * Math.pow(10, gameData.metaverse.evil_tran_gain)
}

function canBuyEvilTran() {
    return gameData.hypercubes >= evilTranCost()
}

function buyEvilTran() {
    if (canBuyEvilTran()) {
        gameData.hypercubes -= evilTranCost()
        gameData.metaverse.evil_tran_gain += 1
    }
}

function essenceMultGain() {
    return (gameData.metaverse.essence_gain_modifier == 0) ? 1 : Math.pow(10, gameData.metaverse.essence_gain_modifier)
}

function essenceMultCost() {
    return 1e9 * Math.pow(10, gameData.metaverse.essence_gain_modifier)
}

function canBuyEssenceMult() {
    return gameData.hypercubes >= essenceMultCost()
}

function buyEssenceMult() {
    if (canBuyEssenceMult()) {
        gameData.hypercubes -= essenceMultCost()
        gameData.metaverse.essence_gain_modifier += 1
    }
}


function challengeAltarCost() {
    return 1e17
}

function canBuyChallengeAltar() {
    return gameData.metaverse.challenge_altar == 0 && gameData.hypercubes >= challengeAltarCost()
}

function buyChallengeAltar() {
    if (canBuyChallengeAltar()) {
        gameData.hypercubes -= essenceMultCost()
        gameData.metaverse.challenge_altar = 1
    }
}


function darkMaterMultGain() {
    return (gameData.metaverse.dark_mater_gain_modifer == 0) ? 1 : Math.pow(10, gameData.metaverse.dark_mater_gain_modifer)
}

function darkMaterMultCost() {
    return 1e19 * Math.pow(10, gameData.metaverse.dark_mater_gain_modifer)
}

function canBuyDarkMaterMult() {
    return gameData.hypercubes >= darkMaterMultCost()
}

function buyDarkMaterMult() {
    if (canBuyDarkMaterMult()) {
        gameData.hypercubes -= darkMaterMultCost()
        gameData.metaverse.dark_mater_gain_modifer += 1
    }
}

// perks

function getMetaversePerkPointsGain() {
    if (gameData.essence >= 1e85)
        return (gameData.perks.double_perk_points_gain == 1 ? 2 : 1) * (Math.floor(Math.log10(gameData.essence)) - 84)

    return 0
}

function getPerkCost(perkName) {
    switch (perkName) {
        case "auto_dark_orb":
            return 1
        case "auto_dark_shop":
            return 1
        case "auto_boost":
            return 1
        case "instant_evil":
            return 2
        case "instant_essence":
            return 3
        case "hypercube_boost":
            return 4
        case "super_dark_mater_skills":
            return 5
        case "save_challenges":
            return 6
        case "auto_sacrifice":
            return 8
        case "double_perk_points_gain":
            return 10
        case "instant_dark_matter":
            return 15
        case "keep_dark_mater_skills":
            return 20
        case "hyper_speed":
            return 100
        case "the_last_of_us":
            return 10000
        default:
            return Infinity
    }
}

function canBuyPerk(perkName) {
    return gameData.perks_points >= getPerkCost(perkName)
}

function buyPerk(perkName) {
    if (gameData.perks[perkName] == 0) {
        if (canBuyPerk(perkName)) {
            gameData.perks_points -= getPerkCost(perkName)
            gameData.perks[perkName] = 1
        }
    }
    else {
        gameData.perks[perkName] = 0
        gameData.perks_points += getPerkCost(perkName)
    }
}

function getTotalPerkPoints() {
    let total = gameData.perks_points
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == 1)
            total += getPerkCost(key)
    }
    return total
}

function collectPerkPoints(value) {
    for (const key of Object.keys(gameData.perks)) {
        if (gameData.perks[key] == value) {
            buyPerk(key)
        }        
    }
}
