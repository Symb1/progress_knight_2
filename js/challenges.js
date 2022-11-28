function enterChallenge(challengeName) {
    rebirthReset(false)
    gameData.active_challenge = challengeName

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = 0
    }
}

function exitChallenge() {
    rebirthReset(false)
    gameData.active_challenge = ""

    for (const taskName in gameData.taskData) {
        const task = gameData.taskData[taskName]
        task.maxLevel = 0
    }
}

function setChallengeProgress() {
    if (gameData.active_challenge == "an_unhappy_life") {
        gameData.challenges.an_unhappy_life = Math.max(gameData.challenges.an_unhappy_life, getHappiness())
    }
    if (gameData.active_challenge == "rich_and_the_poor") {
        gameData.challenges.rich_and_the_poor = Math.max(gameData.challenges.rich_and_the_poor, getIncome())
    }
    if (gameData.active_challenge == "time_does_not_fly") {
        gameData.challenges.time_does_not_fly = Math.max(gameData.challenges.time_does_not_fly, getGameSpeed())
    }
    if (gameData.active_challenge == "dance_with_the_devil") {
        gameData.challenges.dance_with_the_devil = Math.max(gameData.challenges.dance_with_the_devil, Math.max(0, getEvilGain() - 10))
    }
}

function getChallengeHappinessBonus() {
    return softcap(Math.pow(gameData.challenges.an_unhappy_life + 1, 0.22), 100)
}

function getChallengeIncomeBonus() {
    return softcap(Math.pow(gameData.challenges.rich_and_the_poor + 1, 0.18), 10)
}

function getChallengeTimeWarpingBonus() {
    return softcap(Math.pow(gameData.challenges.time_does_not_fly + 1, 0.05), 2)
}

function getChallengeEssenceGainBonus() {
    return softcap(Math.pow(gameData.challenges.dance_with_the_devil + 1, 0.1), 2, 0.15)
}