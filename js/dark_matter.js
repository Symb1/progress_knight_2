// Costs Dark Matter
function getDarkOrbGeneratorCost() {
    return 1 + 3 * gameData.dark_matter_shop.dark_orb_generator
}

function buyDarkOrbGenerator() {
    if (gameData.dark_matter >= getDarkOrbGeneratorCost()) {
        gameData.dark_matter -= getDarkOrbGeneratorCost()
        gameData.dark_matter_shop.dark_orb_generator += 1
    }
}

// Costs Dark Orbs
function getADealWithTheChairmanCost() {
    return Math.pow(1e3, gameData.dark_matter_shop.a_deal_with_the_chairman + 1)
}

function buyADealWithTheChairman() {
    if (gameData.dark_orbs >= getADealWithTheChairmanCost()) {
        gameData.dark_orbs -= getADealWithTheChairmanCost()
        gameData.dark_matter_shop.a_deal_with_the_chairman += 1
    }
}

function getAGiftFromGodCost() {
    return Math.pow(1e5, gameData.dark_matter_shop.a_gift_from_god + 1)
}

function buyAGiftFromGod() {
    if (gameData.dark_orbs >= getAGiftFromGodCost()) {
        gameData.dark_orbs -= getAGiftFromGodCost()
        gameData.dark_matter_shop.a_gift_from_god += 1
    }
}

function getLifeCoachCost() {
    return Math.pow(1e10, gameData.dark_matter_shop.life_coach + 1)
}

function buyLifeCoach() {
    if (gameData.dark_orbs >= getLifeCoachCost()) {
        gameData.dark_orbs -= getLifeCoachCost()
        gameData.dark_matter_shop.life_coach += 1
    }
}

// Rewards
function getDarkOrbGeneration() {
    if (gameData.dark_matter_shop.dark_orb_generator == 0) return 0
    return Math.pow(1000, gameData.dark_matter_shop.dark_orb_generator - 1)
}

function getTaaAndMagicXpGain() {
    return gameData.dark_matter_shop.a_deal_with_the_chairman + 1
}

function getAGiftFromGodEssenceGain() {
    return gameData.dark_matter_shop.a_gift_from_god + 1
}

function getLifeCoachIncomeGain() {
    return Math.pow(10, gameData.dark_matter_shop.life_coach)
}