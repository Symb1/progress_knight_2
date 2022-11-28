function initUI() {
    setLayout(gameData.settings.layout)
    setFontSize(gameData.settings.fontSize)
    setNotation(gameData.settings.numberNotation)
    setStickySidebar(gameData.settings.stickySidebar)

    if (!gameData.settings.darkTheme)
        setLightDarkMode()

    if (gameData.completedTimes > 0) {
        var elem = document.getElementById("completedTimes")
        elem.textContent = "You completed the game " + gameData.completedTimes + " " +
            (gameData.completedTimes > 1 ? "times" : "time") + ". Time Boost is x" + format(getCompletedGameSpeedBoost()) +
            ". All progress will be lost if you click this button."
    }
}

function createRequiredRow(categoryName) {
    const requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    const headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    const categoryElement = headerRow.getElementsByClassName("category")[0]

    if (categoryType == itemCategories) {
        categoryElement.getElementsByClassName("name")[0].textContent = categoryName
    } else {
        categoryElement.textContent = categoryName
    }


    if (categoryType == jobCategories || categoryType == skillCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    const row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name

    if (categoryType == itemCategories) {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? () => { setCurrentProperty(name) } : () => { setMisc(name) }
    } 

    return row
}

function createAllRows(categoryType, tableId) {
    const templates = {
        headerRow: document.getElementsByClassName(
            categoryType == itemCategories
                ? "headerRowItemTemplate"
                : (categoryType == milestoneCategories ? "headerRowMilestoneTemplate" : "headerRowTaskTemplate")

        )[0],
        row: document.getElementsByClassName(
            categoryType == itemCategories
                ? "rowItemTemplate"
                : (categoryType == milestoneCategories ? "rowMilestoneTemplate": "rowTaskTemplate"))[0],
    }

    const table = document.getElementById(tableId)

    for (const categoryName in categoryType) {
        const headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        const category = categoryType[categoryName]
        category.forEach(function(name) {
            const row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        const requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay() {
    const task = gameData.currentJob
    const quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    const progressBar = quickTaskDisplayElement.getElementsByClassName("job")[0]
    progressBar.getElementsByClassName("name")[0].textContent = (task.isHero ? "Great " : "") + task.name + " lvl " + task.level
    const progressFill = progressBar.getElementsByClassName("progressFill")[0]

    if (task.isFinished) {
        progressFill.style.width = "100%"
        progressFill.classList.add("progress-fill-finished")
        progressBar.classList.add("progress-bar-finished")
        var time = gameData.realtime / 3
        var x = time - Math.floor(time)
        x = (x < 0.5 ? x : 1 - x) * 2;
        progressFill.style.opacity = x

        progressFill.classList.add("current-hero")
        progressBar.classList.remove("progress-bar-hero")

    } else {
        progressFill.style.opacity = 1
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        progressFill.classList.remove("progress-fill-finished")
        progressBar.classList.remove("progress-bar-finished")

        task.isHero ? progressFill.classList.add("current-hero") : progressFill.classList.remove("current-hero")
        task.isHero ? progressBar.classList.add("progress-bar-hero") : progressBar.classList.remove("progress-bar-hero")
    }
}

function updateRequiredRows(data, categoryType) {
    const requiredRows = document.getElementsByClassName("requiredRow")
    for (const requiredRow of requiredRows) {
        let nextEntity = null
        const category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (let i = 0; i < category.length; i++) {
            const entityName = category[i]
            if (i >= category.length - 1) break

            const requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            const nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            const nextEntityName = category[nextIndex]
            nextEntityRequirements = gameData.requirements[nextEntityName]

            if (!nextEntityRequirements.isCompleted()) {
                nextEntity = data[nextEntityName]
                break
            }       
        }

        if (nextEntity == null) {
            requiredRow.classList.add("hiddenTask")           
        } else {
            requiredRow.classList.remove("hiddenTask")
            const requirementObject = gameData.requirements[nextEntity.name]
            const requirements = requirementObject.requirements

            const coinElement = requiredRow.getElementsByClassName("coins")[0]
            const levelElement = requiredRow.getElementsByClassName("levels")[0]
            const evilElement = requiredRow.getElementsByClassName("evil")[0]
			const essenceElement = requiredRow.getElementsByClassName("essence")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")
			essenceElement.classList.add("hiddenTask")

            let finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"
                } else if (requirementObject instanceof EssenceRequirement) {
                    essenceElement.classList.remove("hiddenTask")
                    essenceElement.textContent = format(requirements[0].requirement) + " essence"
                } else if (requirementObject instanceof AgeRequirement) {
                    essenceElement.classList.remove("hiddenTask")
                    essenceElement.textContent = format(requirements[0].requirement) + " age"
                }
                else {
                    levelElement.classList.remove("hiddenTask")
                    for (const requirement of requirements) {
                        const task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        finalText += " " + requirement.task + " " + task.level + "/" + requirement.requirement + ","
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            }
            else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
            else if (data == gameData.milestoneData) {
                essenceElement.classList.remove("hiddenTask")
                essenceElement.textContent = format(requirements[0].requirement) + " essence"
            }
        }   
    }
}

function updateMilestoneRows() {
    for (const key in gameData.milestoneData) {
        const milestone = gameData.milestoneData[key]
        const row = document.getElementById("row " + milestone.name)
        row.getElementsByClassName("essence")[0].textContent = format(milestone.expense)


        let desc = milestone.description
        if (milestone.getEffect != null)
            desc = "x" + format(milestone.getEffect(), 1) + " " + desc

        if (milestone.baseData.effect != null)
            desc = "x" + format(milestone.baseData.effect, 0) + " " + desc

        row.getElementsByClassName("description")[0].textContent = desc
    }
}


function updateTaskRows() {
    for (const key in gameData.taskData) {
        let task = gameData.taskData[key]
        const row = document.getElementById("row " + task.name)
        row.getElementsByClassName("level")[0].textContent = task.level
        if (task.isFinished) {
            row.getElementsByClassName("xpGain")[0].textContent = "Maximum"
            row.getElementsByClassName("xpLeft")[0].textContent = "0"
        } else {
            row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
            row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())
        }

        let tooltip = tooltips[key]

        if (task instanceof Task && !task.isHero && isHeroesUnlocked()) {
            const requirementObject = gameData.requirements[key]
            const requirements = requirementObject.requirements
            const prev = getPreviousTaskInCategory(key)

            tooltip += "<br> <span style=\"color: red\">Required</span>: <span style=\"color: orange\">"
            let reqlist = ""
            let prevReq = ""

            if (prev != "") {
                var prevTask = gameData.taskData[prev]
                var prevlvl = (prevTask.isHero ? prevTask.level : 0)
                if (prevlvl < 20)
                    prevReq = "Great " + prev + " " + prevlvl + "/20<br>"
            }
            
            if (requirementObject instanceof EvilRequirement) {                
                reqlist += format(requirements[0].requirement) + " evil<br>"
            } else if (requirementObject instanceof EssenceRequirement) {
                reqlist += format(requirements[0].requirement) + " essence<br>"
            } else if (requirementObject instanceof AgeRequirement) {
                reqlist += format(requirements[0].requirement) + " age<br>"
            } else {
                for (const requirement of requirements) {
                    const task_check = gameData.taskData[requirement.task]

                    const reqvalue = (requirement.herequirement == null ? requirement.requirement : requirement.herequirement)

                    if (task_check.isHero && task_check.level >= reqvalue) continue
                    if (prev != "" && task_check.name == prevTask.name) {
                        if (reqvalue <= 20)
                            continue
                        else
                            prevReq = " Great " + requirement.task + " " + (task_check.isHero ? task_check.level : 0) + "/" + reqvalue + "<br>"
                    } else {
                        reqlist += " Great " + requirement.task + " " + (task_check.isHero ? task_check.level : 0) + "/" + reqvalue + "<br>"
                    }
                }                
            }

            reqlist += prevReq
            reqlist = reqlist.substring(0, reqlist.length - 4)                
            tooltip += reqlist + "</span>"
        }

        row.getElementsByClassName("tooltipText")[0].innerHTML = tooltip

        const maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        const progressBar = row.getElementsByClassName("progressBar")[0]
        progressBar.getElementsByClassName("name")[0].textContent = (task.isHero ? "Great " : "") + task.name

        const progressFill = row.getElementsByClassName("progressFill")[0]

        if (task.isFinished) {
            progressFill.style.width = "100%"
            progressFill.classList.add("progress-fill-finished") 
            progressBar.classList.add("progress-bar-finished")
            const time = gameData.realtime / 3
            let x = time - Math.floor(time)
            x = (x < 0.5 ? x : 1 - x) * 2;
            progressFill.style.opacity = x
        }
        else {
            progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
            progressFill.style.opacity = 1
            progressFill.classList.remove("progress-fill-finished")
            progressBar.classList.remove("progress-bar-finished")

            task.isHero ? progressFill.classList.add("progress-fill-hero") : progressFill.classList.remove("progress-fill-hero")
            task.isHero ? progressBar.classList.add("progress-bar-hero") : progressBar.classList.remove("progress-bar-hero")
        }


        task == gameData.currentJob ? progressFill.classList.add(task.isHero ? "current-hero" : "current") : progressFill.classList.remove("current", "current-hero")

        const valueElement = row.getElementsByClassName("value")[0]
        valueElement.getElementsByClassName("income")[0].style.display = task instanceof Job
        valueElement.getElementsByClassName("effect")[0].style.display = task instanceof Skill

        if (task instanceof Job) {
            formatCoins(task.getIncome(), valueElement.getElementsByClassName("income")[0])
        } else {
            valueElement.getElementsByClassName("effect")[0].textContent = task.getEffectDescription()
        }
    }
}

function setStickySidebar(sticky) {
    gameData.settings.stickySidebar = sticky;
    settingsStickySidebar.checked = sticky;
    info.style.position = sticky ? 'sticky' : 'initial';
}

function selectElementInGroup(group, index) {
    const elements = document.getElementsByClassName(group)
    for (const el of elements) {
        el.classList.remove("selected")
    }
    elements[index].classList.add("selected")
}

function setLayout(id) {
    gameData.settings.layout = id
    if (id == 0) {
        document.getElementById("skillsTabButton").classList.add("hidden")
        document.getElementById("shopTabButton").classList.add("hidden")

        document.getElementById("dummyPage1").classList.remove("hidden")
        document.getElementById("dummyPage2").classList.remove("hidden")

        document.getElementById("skills").classList.add("hidden")
        document.getElementById("shop").classList.add("hidden")

        document.getElementById("tabcolumn").classList.add("plain-tab-column")
        document.getElementById("tabcolumn").classList.remove("tabs-tab-column")

        document.getElementById("maincolumn").classList.add("plain-main-column")
        document.getElementById("maincolumn").classList.remove("tabs-main-column")

        document.getElementById("jobs").appendChild(document.getElementById("skillPage"))
        document.getElementById("jobs").appendChild(document.getElementById("itemPage"))

    } else {
        document.getElementById("skillsTabButton").classList.remove("hidden")
        document.getElementById("shopTabButton").classList.remove("hidden")

        document.getElementById("dummyPage1").classList.add("hidden")
        document.getElementById("dummyPage2").classList.add("hidden")

        document.getElementById("skills").classList.remove("hidden")
        document.getElementById("shop").classList.remove("hidden")

        document.getElementById("tabcolumn").classList.add("tabs-tab-column")
        document.getElementById("tabcolumn").classList.remove("plain-tab-column")

        document.getElementById("maincolumn").classList.add("tabs-main-column")
        document.getElementById("maincolumn").classList.remove("plain-main-column")

        document.getElementById("skills").appendChild(document.getElementById("skillPage"))
        document.getElementById("shop").appendChild(document.getElementById("itemPage"))
    }

    selectElementInGroup("Layout", id == 0 ? 1 : 0)
}

function setFontSize(id) {
    const fontSizes = {
        0: "xx-small",
        1: "x-small",
        2: "small",
        3: "medium",
        4: "large",
        5: "x-large",
        6: "xx-large",
        7: "xxx-large",
    }

    if (id < 0) id = 0
    if (id > 7) id = 7

    gameData.settings.fontSize = id
    document.getElementById("body").style.fontSize = fontSizes[id]    
}

function updateItemRows() {
    for (const key in gameData.itemData) {
        const item = gameData.itemData[key]
        const row = document.getElementById("row " + item.name)
        const button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        const name = button.getElementsByClassName("name")[0]

        if (isHeroesUnlocked()) 
            name.classList.add("legendary")        
        else 
            name.classList.remove("legendary")        

        const active = row.getElementsByClassName("active")[0]
        const color = autoBuyEnabled
            ? itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties_Auto"] : headerRowColors["Misc_Auto"]
            : itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]

        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (const categoryName in categories) {
        const className = removeSpaces(categoryName)
        const headerRow = document.getElementsByClassName(className)[0]
        const maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = formatAge(gameData.days)
    document.getElementById("lifespanDisplay").textContent = format(daysToYears(getLifespan()), 0)
    document.getElementById("realtimeDisplay").textContent = formatTime(gameData.realtime)
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = format(getHappiness())

    document.getElementById("evilDisplay").textContent = format(gameData.evil)
    document.getElementById("evilGainDisplay").textContent = format(getEvilGain())
    document.getElementById("evilGainButtonDisplay").textContent = "+" + format(getEvilGain())

    document.getElementById("essenceDisplay").textContent = format(gameData.essence)
    document.getElementById("essenceGainDisplay").textContent = format(getEssenceGain())
    document.getElementById("essenceGainButtonDisplay").textContent = "+" + format(getEssenceGain())

    const timeWarping = gameData.taskData["Time Warping"].getEffect() *
        gameData.taskData["Temporal Dimension"].getEffect() *
        gameData.taskData["Time Loop"].getEffect() *
        (gameData.requirements["Eternal Time"].isCompleted() ? 2 : 1) *
        getChallengeTimeWarpingBonus()

    document.getElementById("timeWarpingDisplay").textContent = "x" + format(
        gameData.active_challenge == "time_does_not_fly" ? Math.pow(timeWarping, 0.7) : timeWarping
    )

    const button = document.getElementById("rebirthButton3").getElementsByClassName("button")[0]
    button.style.background = isNextMilestoneInReach() ? "#065c21" : ""

    // Stats
    const date = new Date(gameData.stats.startDate)
    document.getElementById("startDateDisplay").textContent = date.toLocaleDateString()

    const currentDate = new Date()
    document.getElementById("playedDaysDisplay").textContent = format((currentDate.getTime() - date.getTime()) / (1000 * 3600 * 24), 2)

    if (gameData.rebirthOneCount > 0)
        document.getElementById("statsRebirth1").classList.remove("hidden")
    else
        document.getElementById("statsRebirth1").classList.add("hidden")

    if (gameData.rebirthTwoCount > 0)
        document.getElementById("statsRebirth2").classList.remove("hidden")
    else
        document.getElementById("statsRebirth2").classList.add("hidden")

    if (gameData.rebirthThreeCount > 0)
        document.getElementById("statsRebirth3").classList.remove("hidden")
    else
        document.getElementById("statsRebirth3").classList.add("hidden")

    if (gameData.completedTimes > 0)
        document.getElementById("statsComplete").classList.remove("hidden")
    else
        document.getElementById("statsComplete").classList.add("hidden")

    document.getElementById("rebirthOneCountDisplay").textContent = gameData.rebirthOneCount
    document.getElementById("rebirthTwoCountDisplay").textContent = gameData.rebirthTwoCount
    document.getElementById("rebirthThreeCountDisplay").textContent = gameData.rebirthThreeCount
    document.getElementById("completedTimesDisplay").textContent = gameData.completedTimes
    document.getElementById("completedBoostDisplay").textContent = format(getCompletedGameSpeedBoost())


    document.getElementById("rebirthOneFastestDisplay").textContent = formatTime(gameData.stats.fastest1, true)
    document.getElementById("rebirthTwoFastestDisplay").textContent = formatTime(gameData.stats.fastest2, true)
    document.getElementById("rebirthThreeFastestDisplay").textContent = formatTime(gameData.stats.fastest3, true)
    document.getElementById("completedFastestDisplay").textContent = formatTime(gameData.stats.fastestGame, true)
    document.getElementById("currentRunDisplay").textContent = formatTime(gameData.realtimeRun, true)


    // Challenges
    let challengeTitle = gameData.active_challenge.replaceAll("_", " ")
    challengeTitle = challengeTitle.charAt(0).toUpperCase() + challengeTitle.slice(1)
    document.getElementById("exitChallengeDiv").hidden = gameData.active_challenge == ""
    document.getElementById("activeChallengeName").textContent = challengeTitle
    document.getElementById("challengeName").textContent = challengeTitle
    if (gameData.active_challenge == "") {
        document.getElementById("info").classList.remove("challenge")
        document.getElementById("challengeTitle").classList.add("hidden")
    }
    else {
        document.getElementById("info").classList.add("challenge")
        document.getElementById("challengeTitle").classList.remove("hidden")
    }

    document.getElementById("challengeHappinessBuff").textContent = format(getChallengeHappinessBonus(), 2)
    document.getElementById("challengeIncomeBuff").textContent = format(getChallengeIncomeBonus(), 2)
    document.getElementById("challengeTimewarpingBuff").textContent = format(getChallengeTimeWarpingBonus(), 2)
    document.getElementById("challengeEssenceGainBuff").textContent = format(getChallengeEssenceGainBonus(), 2)

    document.getElementById("evilPerSecondDisplay").textContent = format(gameData.stats.EvilPerSecond,3)
    document.getElementById("maxEvilPerSecondDisplay").textContent = format(gameData.stats.maxEvilPerSecond,3)
    document.getElementById("maxEvilPerSecondRtDisplay").textContent = formatTime(gameData.stats.maxEvilPerSecondRt)

    document.getElementById("essencePerSecondDisplay").textContent = format(gameData.stats.EssencePerSecond,3)
    document.getElementById("maxEssencePerSecondDisplay").textContent = format(gameData.stats.maxEssencePerSecond,3)
    document.getElementById("maxEssencePerSecondRtDisplay").textContent = formatTime(gameData.stats.maxEssencePerSecondRt)
} 


function setSignDisplay() {
    const signDisplay = document.getElementById("signDisplay")

    if (getNet() > -1 && getNet() < 1) {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    } else if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    }
}

function hideCompletedRequirements() {
    for (const key in gameData.requirements) {
        const requirement = gameData.requirements[key]
        for (const element of requirement.elements) {
            if (requirement.isCompleted()) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function getTaskElement(taskName) {
    const task = gameData.taskData[taskName]
    return document.getElementById(task.id)
}

function getItemElement(itemName) {
    const item = gameData.itemData[itemName]
    return document.getElementById(item.id)
}

function getMilestoneElement(milestoneName) {
    const milestone = gameData.milestoneData[milestoneName]
    return document.getElementById(milestone.id)
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateMilestoneRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateRequiredRows(gameData.milestoneData, milestoneCategories)

    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)

    updateQuickTaskDisplay()
    hideCompletedRequirements()
    updateText()  
}

function setTab(selectedTab) {
    const element = document.getElementById(selectedTab + "TabButton")
    gameData.settings.selectedTab = selectedTab

    const tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "flex"

    const tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setTabSettings(tab) {
    const element = document.getElementById(tab + "TabButton")

    const tabs = Array.prototype.slice.call(document.getElementsByClassName("tabSettings"))
    tabs.forEach(function (tab) {
        tab.style.display = "none"
    })
    document.getElementById(tab).style.display = "flex"

    const tabButtons = document.getElementsByClassName("tabButtonSettings")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

// Keyboard shortcuts + Loadouts ( courtesy of Pseiko )
function changeTab(direction){
    const tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    const tabButtons = Array.prototype.slice.call(document.getElementsByClassName("tabButton"))

    let currentTab = 0
    for (const i in tabs) {
        if (!tabs[i].style.display.includes("none") && !tabs[i].classList.contains("hidden"))
             currentTab = i*1
    }
    let targetTab = currentTab + direction
    if (targetTab < 0) {
        setTab("settings")
        return
    }
    targetTab = Math.max(0,targetTab)
    if (targetTab > tabs.length - 1) targetTab = 0
    while (tabButtons[targetTab].style.display.includes("none") || tabButtons[targetTab].classList.contains("hidden")){
        targetTab = targetTab + direction
        targetTab = Math.max(0, targetTab) 
        if (targetTab > tabs.length-1) targetTab = 0
    }

	setTab(tabs[targetTab].id)
}

window.addEventListener('keydown', function(e) {
	if (e.key == " " && !e.repeat ) {
		togglePause()
		if (e.target == document.body) {
			e.preventDefault();
		}
	}	
    if (e.key=="ArrowRight") changeTab(1) 
    if (e.key=="ArrowLeft") changeTab(-1)     
});