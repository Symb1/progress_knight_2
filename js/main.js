var gameData = {
    taskData: {},
    itemData: {},

    coins: 0,
    days: 365 * 14,
    evil: 0,
	essence: 0,
    paused: false,
    timeWarpingEnabled: false,

    rebirthOneCount: 0,
    rebirthTwoCount: 0,
	rebirthThreeCount: 0,

    currentJob: null,
    currentSkill: null,
    currentProperty: null,
    currentMisc: null,

    settings: {
        stickySidebar: false
    }
}

var tempData = {}

var skillWithLowestMaxXp = null

const autoPromoteElement = document.getElementById("autoPromote")
const autoLearnElement = document.getElementById("autoLearn")

const updateSpeed = 20

const baseLifespan = 365 * 70

const baseGameSpeed = 4

const permanentUnlocks = ["Scheduling", "Automation", "Quick task display"]

const jobBaseData = {
    "Beggar": {name: "Beggar", maxXp: 50, income: 5},
    "Farmer": {name: "Farmer", maxXp: 100, income: 9},
    "Fisherman": {name: "Fisherman", maxXp: 200, income: 15},
    "Miner": {name: "Miner", maxXp: 400, income: 40},
    "Blacksmith": {name: "Blacksmith", maxXp: 800, income: 80},
    "Merchant": {name: "Merchant", maxXp: 1600, income: 150},

    "Squire": {name: "Squire", maxXp: 100, income: 5},
    "Footman": {name: "Footman", maxXp: 1000, income: 50},
    "Veteran footman": {name: "Veteran footman", maxXp: 10000, income: 120},
    "Centenary": {name: "Centenary", maxXp: 100000, income: 300},
    "Knight": {name: "Knight", maxXp: 1000000, income: 1000},
    "Veteran Knight": {name: "Veteran Knight", maxXp: 7500000, income: 3000},
    "Holy Knight": {name: "Holy Knight", maxXp: 40000000, income: 5000},
    "Lieutenant General": {name: "Lieutenant General", maxXp: 150000000, income: 50000},

    "Student": {name: "Student", maxXp: 100000, income: 100},
    "Apprentice Mage": {name: "Apprentice Mage", maxXp: 1000000, income: 1000},
    "Adept Mage": {name: "Adept Mage", maxXp: 10000000, income: 9500},
    "Master Wizard": {name: "Master Wizard", maxXp: 100000000, income: 70000},
    "Archmage": {name: "Archmage", maxXp: 10000000000, income: 350000},
	"Chronomancer": {name: "Chronomancer", maxXp: 2000000000000, income: 1000000},
    "Chairman": {name: "Chairman", maxXp: 20000000000000, income: 10000000},
	"Imperator": {name: "Imperator", maxXp: 9000000000000000, income: 60000000},
	
	"Corrupted": {name: "Corrupted", maxXp: 100000000000000, income: 25000000},
    "Void Slave": {name: "Void Slave", maxXp: 650000000000000, income: 200000000}, 
    "Void Fiend": {name: "Void Fiend", maxXp: 18000000000000000, income: 600000000}, 
    "Abyss Anomaly": {name: "Abyss Anomaly", maxXp: 18000000000000000, income: 1200000000}, 
	"Void Wraith": {name: "Void Wraith", maxXp: 180000000000000000, income: 5000000000}, 
    "Void Reaver": {name: "Void Reaver", maxXp: 2600000000000000000, income: 25000000000}, 
	"Void Lord": {name: "Void Lord", maxXp: 28000000000000000000, income: 100000000000},
	"Abyss God": {name: "Abyss God", maxXp: 400000000000000000000, income: 1000000000000},




	"Eternal Wanderer": {name: "Eternal Wanderer", maxXp: 55000000000000000000, income: 1000000000000},
    "Nova": {name: "Nova", maxXp: 51000000000000000000, income: 3000000000000},
    "Sigma Proioxis": {name: "Sigma Proioxis", maxXp: 500000000000000000000, income: 25000000000000},
	"Acallaris": {name: "Acallaris", maxXp: 50000000000000000000000, income: 215000000000000},
	"One Above All": {name: "One Above All", maxXp: 5000000000000000000000000000, income: 25000000000000000},
	
	
	
}

const skillBaseData = {
    "Concentration": {name: "Concentration", maxXp: 100, effect: 0.01, description: "Ability XP"},
    "Productivity": {name: "Productivity", maxXp: 100, effect: 0.01, description: "Class XP"},
    "Bargaining": {name: "Bargaining", maxXp: 100, effect: -0.01, description: "Reduced Expenses"},
    "Meditation": {name: "Meditation", maxXp: 100, effect: 0.01, description: "Happiness"},

    "Strength": {name: "Strength", maxXp: 100, effect: 0.01, description: "Military Pay"},
    "Battle Tactics": {name: "Battle Tactics", maxXp: 100, effect: 0.01, description: "Military XP"},
    "Muscle Memory": {name: "Muscle Memory", maxXp: 100, effect: 0.01, description: "Strength XP"},

    "Mana Control": {name: "Mana Control", maxXp: 100, effect: 0.01, description: "T.A.A. XP"},
    "Life Essence": {name: "Life Essence", maxXp: 100, effect: 0.01, description: "Longer Lifespan"},
    "Time Warping": {name: "Time Warping", maxXp: 100, effect: 0.01, description: "Gamespeed"},
    "Astral Body": {name: "Astral Body", maxXp: 100, effect: 0.0035, description: "Longer lifespan"},
	"Temporal Dimension": {name: "Temporal Dimension", maxXp: 100, effect: 0.025, description: "Gamespeed"},
	"All Seeing Eye": {name: "All Seeing Eye", maxXp: 100, effect: 0.0027, description: "T.A.A Pay"},
	"Brainwashing": {name: "Brainwashing", maxXp: 100, effect: -0.01, description: "Reduced Expenses"},
	
	"Absolute Wish": {name: "Absolute Wish", maxXp: 100, effect: 0.005, description: "Evil Gain"},
    "Void Amplification": {name: "Void Amplification", maxXp: 100, effect: 0.01, description: "The Void XP"},
    "Mind Seize": {name: "Mind Seize", maxXp: 100, effect: 0.0006, description: "Reduced Happiness"},
	"Ceaseless Abyss": {name: "Ceaseless Abyss", maxXp: 100, effect: 0.000585, description: "Longer Lifespan"},
	"Void Symbiosis": {name: "Void Symbiosis", maxXp: 100, effect: 0.0015, description: "Ability XP"},
    "Void Embodiment": {name: "Void Embodiment", maxXp: 100, effect: 0.0025, description: "Evil Gain"},
	"Abyss Manipulation": {name: "Abyss Manipulation", maxXp: 100, effect: -0.01, description: "Reduced Expenses"},
	
	
	"Cosmic Longevity": {name: "Cosmic Longevity", maxXp: 100, effect: 0.0015, description: "Longer Lifespan"},
    "Cosmic Recollection": {name: "Cosmic Recollection", maxXp: 100, effect: 0.00065, description: "Max Lvl Multiplier"},
	"Essence Collector": {name: "Essence Collector", maxXp: 100, effect: 0.01, description: "Essence Gain"},
	"Galactic Command": {name: "Galactic Command", maxXp: 100, effect: -0.01, description: "Reduced Expenses"},
	
	
    "Dark Influence": {name: "Dark Influence", maxXp: 100, effect: 0.01, description: "All XP"},
    "Evil Control": {name: "Evil Control", maxXp: 100, effect: 0.01, description: "Evil Gain"},
    "Intimidation": {name: "Intimidation", maxXp: 100, effect: -0.01, description: "Reduced Expenses"},
    "Demon Training": {name: "Demon Training", maxXp: 100, effect: 0.01, description: "All XP"},
    "Blood Meditation": {name: "Blood Meditation", maxXp: 100, effect: 0.01, description: "Evil Gain"},
    "Demon's Wealth": {name: "Demon's Wealth", maxXp: 100, effect: 0.002, description: "Class Pay"},
	"Dark Knowledge": {name: "Dark Knowledge", maxXp: 100, effect: 0.003, description: "Class XP"},
	"Void Influence": {name: "Void Influence", maxXp: 100, effect: 0.0028, description: "All XP"},
	"Time Loop": {name: "Time Loop", maxXp: 100, effect: 0.001, description: "Gamespeed"},
	"Evil Incarnate": {name: "Evil Incarnate", maxXp: 100, effect: 0.0004, description: "Ability XP"},
	

    "Yin Yang": {name: "Yin Yang", maxXp: 100, effect: 0.020, description: "Essence + Evil Gain"},
	"Parallel Universe": {name: "Parallel Universe", maxXp: 100, effect: 0.02, description: "All XP"},
	"Higher Dimensions": {name: "Higher Dimensions", maxXp: 100, effect: 0.001, description: "Longer Lifespan"},
	"Epiphany": {name: "Epiphany", maxXp: 100, effect: 0.012, description: "Galactic Council XP"},

}

const itemBaseData = {
    "Homeless": {name: "Homeless", expense: 0, effect: 1},
    "Tent": {name: "Tent", expense: 15, effect: 1.4},
    "Wooden Hut": {name: "Wooden Hut", expense: 100, effect: 2},
    "Cottage": {name: "Cottage", expense: 750, effect: 3.5},
    "House": {name: "House", expense: 3000, effect: 6},
    "Large House": {name: "Large House", expense: 25000, effect: 12},
    "Small Palace": {name: "Small Palace", expense: 300000, effect: 25},
    "Grand Palace": {name: "Grand Palace", expense: 5000000, effect: 60},
	"Town Ruler": {name: "Town Ruler", expense: 35000000, effect: 120},
	"City Ruler": {name: "City Ruler", expense: 1100000000, effect: 500},
	"Nation Ruler": {name: "Nation Ruler", expense: 13000000000, effect: 1200},
	"Pocket Dimension": {name: "Pocket Dimension", expense: 49000000000, effect: 5000},
    "Void Realm": {name: "Void Realm", expense: 121000000000, effect: 15000},
	"Void Universe": {name: "Void Universe", expense: 2000000000000, effect: 30000},
	"Astral Realm": {name: "Astral Realm", expense: 160000000000000, effect: 150000},
	"Galactic Throne": {name: "Galactic Throne", expense: 5000000000000000, effect: 300000},


    "Book": {name: "Book", expense: 10, effect: 1.5, description: "Ability XP"},
    "Dumbbells": {name: "Dumbbells", expense: 50, effect: 1.5, description: "Strength XP"},
    "Personal Squire": {name: "Personal Squire", expense: 200, effect: 2, description: "Class XP"},
    "Steel Longsword": {name: "Steel Longsword", expense: 1000, effect: 2, description: "Military XP"},
    "Butler": {name: "Butler", expense: 7500, effect: 1.5, description: "Happiness"},
    "Sapphire Charm": {name: "Sapphire Charm", expense: 50000, effect: 3, description: "Magic XP"},
    "Study Desk": {name: "Study Desk", expense: 1000000, effect: 2, description: "Ability XP"},
    "Library": {name: "Library", expense: 10000000, effect: 2, description: "Ability XP"},
	"Observatory": {name: "Observatory", expense: 140000000, effect: 5, description: "Magic XP"},
	"Mind's Eye": {name: "Mind's Eye", expense: 3250000000, effect: 10, description: "Fundamentals XP"},
	"Void Necklace": {name: "Void Necklace", expense: 28050000000, effect: 3, description: "Void Manipulation XP"},
    "Void Armor": {name: "Void Armor", expense: 197050000000, effect: 3, description: "The Void XP"},
	"Void Blade": {name: "Void Blade", expense: 502050000000, effect: 3, description: "Ability XP"},
	"Void Orb": {name: "Void Orb", expense: 1202050000000, effect: 3, description: "Void Manipulation XP"},
	"Void Dust": {name: "Void Dust", expense: 25002050000000, effect: 3, description: "The Void XP"},
	"Celestial Robe": {name: "Celestial Robe", expense: 300002050000000, effect: 5, description: "Galactic Council XP"},
	"Universe Fragment": {name: "Universe Fragment", expense: 18500002050000000, effect: 3, description: "Ability XP"},
	"Multiverse Fragment": {name: "Multiverse Fragment", expense: 200500002050000000, effect: 5, description: "Happiness"},

}

const jobCategories = {
    "Common work"            : ["Beggar", "Farmer", "Fisherman", "Miner", "Blacksmith", "Merchant"],
    "Military"               : ["Squire", "Footman", "Veteran footman", "Centenary", "Knight", "Veteran Knight", "Holy Knight", "Lieutenant General"],
    "The Arcane Association" : ["Student", "Apprentice Mage", "Adept Mage", "Master Wizard", "Archmage", "Chronomancer", "Chairman", "Imperator"],
	"The Void"               : ["Corrupted", "Void Slave", "Void Fiend", "Abyss Anomaly", "Void Wraith", "Void Reaver", "Void Lord", "Abyss God"],
    "Galactic Council"       : ["Eternal Wanderer", "Nova", "Sigma Proioxis", "Acallaris", "One Above All"]

}

const skillCategories = {
    "Fundamentals"           : ["Concentration", "Productivity", "Bargaining", "Meditation"],
    "Combat"                 : ["Strength", "Battle Tactics", "Muscle Memory"],
    "Magic"                  : ["Mana Control", "Life Essence", "Time Warping", "Astral Body", "Temporal Dimension", "All Seeing Eye", "Brainwashing"],
    "Dark Magic"             : ["Dark Influence", "Evil Control", "Intimidation", "Demon Training", "Blood Meditation", "Demon's Wealth", "Dark Knowledge", "Void Influence", "Time Loop", "Evil Incarnate"],
	"Void Manipulation"      : ["Absolute Wish", "Void Amplification", "Mind Seize", "Ceaseless Abyss", "Void Symbiosis", "Void Embodiment", "Abyss Manipulation"],
	"Celestial Powers"       : ["Cosmic Longevity", "Cosmic Recollection", "Essence Collector", "Galactic Command"],
	"Almightiness"           : ["Yin Yang", "Parallel Universe", "Higher Dimensions", "Epiphany"]
	
}

const itemCategories = {
    "Properties"             : ["Homeless", "Tent", "Wooden Hut", "Cottage", "House", "Large House", "Small Palace", "Grand Palace", "Town Ruler", "City Ruler", "Nation Ruler", "Pocket Dimension", "Void Realm", "Void Universe", "Astral Realm", "Galactic Throne"],
    "Misc"                   : ["Book", "Dumbbells", "Personal Squire", "Steel Longsword", "Butler", "Sapphire Charm", "Study Desk", "Library", "Observatory", "Mind's Eye", "Void Necklace", "Void Armor", "Void Blade", "Void Orb", "Void Dust", "Celestial Robe", "Universe Fragment", "Multiverse Fragment"]
}

const headerRowColors = {
    "Common work": "#55a630",
    "Military": "#e63946",
    "The Arcane Association": "#C71585",
	"The Void": "#762B91",
    "Galactic Council": "#D5C010",
    "Fundamentals": "#55a630",
    "Combat": "#e63946",
    "Magic": "#C71585",
    "Dark Magic": "#73000f",
	"Almightiness": "#18d2d9",
	"Void Manipulation": "#762B91",
	"Celestial Powers": "#D5C010",
    "Properties": "#219ebc",
    "Misc": "#b56576",
}

const tooltips = {
	//Common work
    "Beggar": "Struggle day and night for a couple of copper coins. It feels like you are at the brink of death each day.",
    "Farmer": "Plow the fields and grow the crops. It's not much but it's honest work.",
    "Fisherman": "Reel in various fish and sell them for a handful of coins. A relaxing but still a poor paying job.",
    "Miner": "Delve into dangerous caverns and mine valuable ores. The pay is quite meager compared to the risk involved.",
    "Blacksmith": "Smelt ores and carefully forge weapons for the military. A respectable and OK paying commoner job.",
    "Merchant": "Travel from town to town, bartering fine goods. The job pays decently well and is a lot less manually-intensive.",
	
    //Military
    "Squire": "Carry around your knight's shield and sword along the battlefield. Very meager pay but the work experience is quite valuable.",
    "Footman": "Put down your life to battle with enemy soldiers. A courageous, respectable job but you are still worthless in the grand scheme of things.",
    "Veteran footman": "More experienced and useful than the average footman, take out the enemy forces in battle with your might. The pay is not that bad.",
    "Centenary": "By proving your skills with a bow, you were appointed to lead a small group of archers to ambush your enemies from a distance.",
    "Knight": "Slash and pierce through enemy soldiers with ease, while covered in steel from head to toe. A decently paying and very respectable job.",
    "Veteran Knight": "Utilising your unmatched combat ability, slaugher enemies effortlessly. Most footmen in the military would never be able to acquire such a well paying job like this.",
    "Holy Knight": "Obliterate squadrons of enemy soldiers in one go with extraordinary proficiency, while equipped magically imbued blade. Such a feared unit on the battlefield is paid extremely well.",
    "Lieutenant General": "Feared by nations, obliterate entire armies in a blink of an eye. Roughly every century, only one holy knight is worthy of receiving such an esteemed title.",

    //The Arcane Association
    "Student": "Study the theory of mana and practice basic spells. There is minor pay to cover living costs, however, this is a necessary stage in becoming a mage.",
    "Apprentice Mage": "Under the supervision of a skilled mage, perform basic spells against enemies in battle. Generous pay will be provided to cover living costs.",
    "Adept Mage": "Turn the tides of battle through casting intermediate spells and mentor other apprentices. The pay for this particular job is extremely high.",
    "Master Wizard": "Utilise advanced spells to ravage and destroy entire legions of enemy soldiers. Only a small percentage of mages deserve to attain this role and are rewarded with an insanely high pay.",
    "Archmage": "Blessed with unparalleled talent, perform unbelievable feats with magic at will. It is said that an archamge has enough destructive power to wipe an empire off the map.",
	"Chronomancer": "Specialize in harnessing temporal energies that alter the flow of time with supernatural divinations and otherwordly expertise.",
    "Chairman": "Spend your days administrating The Arcane Association and investigate the concepts of true immortality. The chairman receives ludicrous amounts of pay daily.",
	"Imperator": "You wield an unlimited power, making you unstoppable. By ruling with an iron fist, everyone in the Arcane Association has to obey your commands.",

    //The Void
    "Corrupted": "Corrupted by Void, you are slowly turning into a slave with no free will, just to serve the Void for the rest of eternity... Can you resist it, or will it consume you forever?",
    "Void Slave": "Each day you are succumbing to the Void more and more, can you hold to your humanity for a bit longer, or will you let it devour you?",
    "Void Fiend": "You become an inquisitive yet putrid creature that siphons life from everything around you.",
	"Abyss Anomaly": "Screaming into existence, you become a manifestation of the unknowable nothingness that lies beyond.",
	"Void Wraith": "Damned soul... a shadow of your former self, lingering between realms and consumed by void... can you ever find peace?",
	"Void Reaver": "There are few who may tread the paths between worlds, these powers grant you an ability to generate fields of void energy that devour all living things.",
	"Void Lord": "You gazed into the dark heart of the Void long enough to become one of the most powerful and feared beings, all lesser void creatures are at your command.",
	"Abyss God": "Creator of the Void, a vast canvas of blackness and nothingness, in which the concept of its existence defies all logic, nothing will escape you.",
 
    //Galactic Council
    "Eternal Wanderer": "With the powers bestowed upon you by an unknown entity you wander around, visiting places revered and feared in search of answers.",
    "Nova": "Extremely powerful being with tremedous telekinetic powers and the ability to rearrange the molecular structure of matter and energy, even up to cosmic scale.",
	"Sigma Proioxis": "A nigh-omnipotent cosmological entity, with vast matter and energy manipulation abilities that help you push the boundaries of the Universe itself.",
    "Acallaris": "Primordial being that predate the universe, involved with the creation of life and powerful beyond mortal comprehension, existing as myths to the oldest species in the universe.",
	"One Above All": "Creator of everything.",
	

    //Fundamentals
    "Concentration": "Improve your learning speed through practising intense concentration activities.",
    "Productivity": "Learn to procrastinate less at work and receive more job experience per day.",
    "Bargaining": "Study the tricks of the trade and persuasive skills to lower any type of expense.",
    "Meditation": "Fill your mind with peace and tranquility to tap into greater happiness from within.",

    //Combat
    "Strength": "Condition your body and strength through harsh training. Stronger individuals are paid more in the military.",
    "Battle Tactics": "Create and revise battle strategies, improving experience gained in the military.",
    "Muscle Memory": "Strengthen your neurons through habit and repetition, improving strength gains throughout the body.",

    //Magic
    "Mana Control": "Strengthen your mana channels throughout your body, aiding you in becoming a more powerful magical user.",
    "Life Essence": "Lengthen your lifespan through the means of magic. However, is this truly the immortality you have tried seeking for...?",
    "Time Warping": "Bend space and time through forbidden techniques, speeding up your learning processes.",
    "Astral Body": "Lengthen your lifespan drastically beyond comprehension by harnessing ethereal energy.",
	"Temporal Dimension": "Creating your own pocket dimension where centuries go by in mere seconds.",
	"All Seeing Eye": "As the highest rank of T.A.A, all funds go directly to you.",
	"Brainwashing": "A technique designed to manipulate human thought and action against their desire.",

     //Dark magic - Evil Required
    "Dark Influence": "Encompass yourself with formidable power bestowed upon you by evil, allowing you to pick up and absorb any job or skill with ease.",
    "Evil Control": "Tame the raging and growing evil within you, improving evil gain in-between rebirths.",
    "Intimidation": "Learn to emit a devilish aura which strikes extreme fear into other merchants, forcing them to give you heavy discounts.",
    "Demon Training": "A mere human body is too feeble and weak to withstand evil. Train with forbidden methods to slowly manifest into a demon, capable of absorbing knowledge rapidly.",
    "Blood Meditation": "Grow and culture the evil within you through the sacrifise of other living beings, drastically increasing evil gain.",
    "Demon's Wealth": "Through the means of dark magic, multiply the raw matter of the coins you receive from your job.",
	"Dark Knowledge": "Sealed for a very long time, you utilized these forbidden texts for your own personal gain.",
	"Void Influence": "Tapping into the powers of the Void while combining them with evil grants you an ulimited potential.",
	"Time Loop": "Mastery is achieved when 'telling time' becomes 'telling time what to do'.",
	"Evil Incarnate": "You have became the very thing you swore to destroy.",
	
	//Void Manipulation
	"Absolute Wish": "The power to fulfill absolutely any and all wishes without any limitations.",
    "Void Amplification": "You surrender yourself to the Void, making it easier to take control of you.",
    "Mind Seize": "In a trance like state, you feel the Void controlling your thoughts, perception, memories, emotions and personality.",
	"Ceaseless Abyss": "Never ending torture, you swore to serve the Void for the rest of your existence.",
	"Void Symbiosis": "A symbiotic relationship that helps you become one with the Void.",
	"Void Embodiment": "If thou gaze long into an abyss, the abyss will also gaze into thee.",
	"Abyss Manipulation": "Allows you to shape your own reality within the Void itself.",
	
	//Celestial Powers - Endgame
	"Cosmic Longevity": "You have seen it all, from the very beginning to the very end.",
	"Cosmic Recollection": "Being able to exist in multiple parallel timelines and manipulating you parallel selves, influencing their lives as you see fit.",
	"Essence Collector": "Exploit the unlimited potential of multiverse energies and collect its resources.",
	"Galactic Command": "Absolute power corrupts absolutely.",
	
	//Almightiness
	"Yin Yang": "Born from chaos when the universe was first created, believed to exist in harmony, balancing evil and good.",
	"Parallel Universe": "Self-contained plane of existence, co-existing with one's own, helping you restore fragments of your forgotten power.",
	"Higher Dimensions": "By possesing the power to partially alter the laws of physics and transceding lower dimensional spaces, your existence becomes never-ending.",
	"Epiphany": "You become one with everything.",
	
    //Properties
    "Homeless": "Sleep on the uncomfortable, filthy streets while almost freezing to death every night. It cannot get any worse than this.",
    "Tent": "A thin sheet of tattered cloth held up by a couple of feeble, wooden sticks. Horrible living conditions but at least you have a roof over your head.",
    "Wooden Hut": "Shabby logs and dirty hay glued together with horse manure. Much more sturdy than a tent, however, the stench isn't very pleasant.",
    "Cottage": "Structured with a timber frame and a thatched roof. Provides decent living conditions for a fair price.",
    "House": "A building formed from stone bricks and sturdy timber, which contains a few rooms. Although quite expensive, it is a comfortable abode.",
    "Large House": "Much larger than a regular house, which boasts even more rooms and multiple floors. The building is quite spacious but comes with a hefty price tag.",
    "Small Palace": "A very rich and meticulously built structure rimmed with fine metals such as silver. Extremely high expenses to maintain for a lavish lifestyle.",
    "Grand Palace": "A grand residence completely composed of gold and silver. Provides the utmost luxurious and comfortable living conditions possible for a ludicrous price.",
	"Town Ruler": "You rule your very own community in your small town, owning multiple establishments.",
    "City Ruler": "As the highest ranking official, you manage and oversee everything that happens, while your pay is astronomical, so are your expenses.",
	"Nation Ruler": "You reign the whole nation, while your riches may be corrupted, everything you see belongs to you.",
	"Pocket Dimension": "A Dimension just for you, that can be summoned at will. What happens there stays there.",
	"Void Realm": "Unknown how or when the Void realm came into existence, containing elements which don’t exist outside of its dimensional plane are now all to your disposal",
	"Void Universe": "Predating our own universe, the Void has an ulimited amount of space for your belongings, if you are willing to submit to it.",
	"Astral Realm": "Beneath personality and ego lays the source of our deep character, our personhood. Here are the psychic senses, our deep mind and emotions, symbols and inner reality.",
	"Galactic Throne": "You sit on your throne, overseeing the existence itself.", 

    //Misc
    "Book": "A place to write down all your thoughts and discoveries, allowing you to learn a lot more quickly.",
    "Dumbbells": "Heavy tools used in strenuous exercise to toughen up and accumulate strength even faster than before. ",
    "Personal Squire": "Assists you in completing day to day activities, giving you more time to be productive at work.",
    "Steel Longsword": "A fine blade used to slay enemies even quicker in combat and therefore gain more experience.",
    "Butler": "Keeps your household clean at all times and also prepares three delicious meals per day, leaving you in a happier, stress-free mood.",
    "Sapphire Charm": "Embedded with a rare sapphire, this charm activates more mana channels within your body, providing a much easier time learning magic.",
    "Study Desk": "A dedicated area which provides many fine stationary and equipment designed for furthering your progress in research.",
    "Library": "Stores a collection of books, each containing vast amounts of information from basic life skills to complex magic spells.",
	"Observatory": "Used for observing terrestrial, marine and celestial events.",
	"Mind's Eye": "Lets you see memories, remember images, and even see new pictures and ideas.",
	"Void Necklace": "Helps you shape and manipulate void matter, even transmute it and rebuild into anything of your choosing.",
	"Void Armor": "Generates an innate armor as a part of you body, which is resistant to attacks, harm or pain.",
	"Void Blade": "Forged from void dust and dark matter, can slash through dimensional barriers. It's a weapon of choice for every Void Reaver.",
	"Void Orb": "When the orb touches non void entities, it instantly disintegrate them. Harnessing its power from Void realm.",
	"Void Dust": "Purest version of void created material, a teaspoon of it is as heavy as a small planet. ",
	"Celestial Robe": "The most powerful and essential equipment of any Celestial. Acts as a source of infinite power.",
	"Universe Fragment": "From the time the universe was born. Can create another small universes.",
	"Multiverse Fragment": "Came into existance long before our universe was created, this strange looking object with no shape radiates unlimited energy.",
}

const units = ["", "k", "M", "B", "T", "q", "Q", "Sx", "Sp", "Oc", "Nv", "Vg", "Uv", "Dv", "Tv", "Qt", "Qv", "Sv", "Oc", "Nd", "Tg", "OMG"];

const jobTabButton = document.getElementById("jobTabButton")

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}
  
function getBindedTaskEffect(taskName) {
    var task = gameData.taskData[taskName]
    return task.getEffect.bind(task)
}

function getBindedItemEffect(itemName) {
    var item = gameData.itemData[itemName]
    return item.getEffect.bind(item)
}

function addMultipliers() {
    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]

        task.xpMultipliers = []
        if (task instanceof Job) task.incomeMultipliers = []

        task.xpMultipliers.push(task.getMaxLevelMultiplier.bind(task))
        task.xpMultipliers.push(getHappiness)
        task.xpMultipliers.push(getBindedTaskEffect("Dark Influence"))
        task.xpMultipliers.push(getBindedTaskEffect("Demon Training"))
		task.xpMultipliers.push(getBindedTaskEffect("Void Influence"))
		task.xpMultipliers.push(getBindedTaskEffect("Parallel Universe"))

        if (task instanceof Job) {
            task.incomeMultipliers.push(task.getLevelMultiplier.bind(task))
            task.incomeMultipliers.push(getBindedTaskEffect("Demon's Wealth"))
            task.xpMultipliers.push(getBindedTaskEffect("Productivity"))
			task.xpMultipliers.push(getBindedTaskEffect("Dark Knowledge"))
            task.xpMultipliers.push(getBindedItemEffect("Personal Squire"))    
        } else if (task instanceof Skill) {
            task.xpMultipliers.push(getBindedTaskEffect("Concentration"))
            task.xpMultipliers.push(getBindedItemEffect("Book"))
            task.xpMultipliers.push(getBindedItemEffect("Study Desk"))
            task.xpMultipliers.push(getBindedItemEffect("Library"))
			task.xpMultipliers.push(getBindedItemEffect("Void Blade"))
			task.xpMultipliers.push(getBindedTaskEffect("Void Symbiosis"))
			task.xpMultipliers.push(getBindedItemEffect("Universe Fragment"))
			task.xpMultipliers.push(getBindedTaskEffect("Evil Incarnate"))
			

		
		
        }

        if (jobCategories["Military"].includes(task.name)) {
            task.incomeMultipliers.push(getBindedTaskEffect("Strength"))
            task.xpMultipliers.push(getBindedTaskEffect("Battle Tactics"))
            task.xpMultipliers.push(getBindedItemEffect("Steel Longsword"))
        } else if (task.name == "Strength") {
            task.xpMultipliers.push(getBindedTaskEffect("Muscle Memory"))
            task.xpMultipliers.push(getBindedItemEffect("Dumbbells"))
        } else if (skillCategories["Magic"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Sapphire Charm"))
			task.xpMultipliers.push(getBindedItemEffect("Observatory"))
	    } else if (skillCategories["Void Manipulation"].includes(task.name)) {
            task.xpMultipliers.push(getBindedItemEffect("Void Necklace"))
			task.xpMultipliers.push(getBindedItemEffect("Void Orb"))
        } else if (jobCategories["The Arcane Association"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Mana Control"))
			task.incomeMultipliers.push(getBindedTaskEffect("All Seeing Eye"))	
	    } else if (jobCategories["The Void"].includes(task.name)) {
            task.xpMultipliers.push(getBindedTaskEffect("Void Amplification"))
			task.xpMultipliers.push(getBindedItemEffect("Void Armor"))
			task.xpMultipliers.push(getBindedItemEffect("Void Dust"))
		} else if (jobCategories["Galactic Council"].includes(task.name)) {
			task.xpMultipliers.push(getBindedItemEffect("Celestial Robe"))
			task.xpMultipliers.push(getBindedTaskEffect("Epiphany"))
        } else if (skillCategories["Dark Magic"].includes(task.name)) {
            task.xpMultipliers.push(getEvil)
        } else if (skillCategories["Almightiness"].includes(task.name)) {
			task.xpMultipliers.push(getEssence)
        } else if (skillCategories["Fundamentals"].includes(task.name)) {
			task.xpMultipliers.push(getBindedItemEffect("Mind's Eye"))
		}	
    }

    for (itemName in gameData.itemData) {
        var item = gameData.itemData[itemName]
        item.expenseMultipliers = []
        item.expenseMultipliers.push(getBindedTaskEffect("Bargaining"))
        item.expenseMultipliers.push(getBindedTaskEffect("Intimidation"))
		item.expenseMultipliers.push(getBindedTaskEffect("Brainwashing"))
		item.expenseMultipliers.push(getBindedTaskEffect("Abyss Manipulation"))
		item.expenseMultipliers.push(getBindedTaskEffect("Galactic Command"))
    }
}

function setCustomEffects() {
    var bargaining = gameData.taskData["Bargaining"]
    bargaining.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, bargaining.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var intimidation = gameData.taskData["Intimidation"]
    intimidation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, intimidation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }
	
	var brainwashing = gameData.taskData["Brainwashing"]
    brainwashing.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, brainwashing.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }
	
	var abyssManipulation = gameData.taskData["Abyss Manipulation"]
    abyssManipulation.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, abyssManipulation.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }

    var galacticCommand = gameData.taskData["Galactic Command"]
    galacticCommand.getEffect = function() {
        var multiplier = 1 - getBaseLog(7, galacticCommand.level + 1) / 10
        if (multiplier < 0.1) {multiplier = 0.1}
        return multiplier
    }


    var timeWarping = gameData.taskData["Time Warping"]
    timeWarping.getEffect = function() {
        var multiplier = 1 + getBaseLog(13, timeWarping.level + 1) 
        return multiplier
    }

    var immortality = gameData.taskData["Life Essence"]
    immortality.getEffect = function() {
        var multiplier = 1 + getBaseLog(33, immortality.level + 1) 
        return multiplier
    }
	
	var unholyRecall = gameData.taskData["Cosmic Recollection"];
    unholyRecall.getEffect = function()
    {
        var multiplier = unholyRecall.level * 0.00065;
        return multiplier;
    }
}

function getHappiness() {
    var meditationEffect = getBindedTaskEffect("Meditation")
    var butlerEffect = getBindedItemEffect("Butler")
	var mindseizeEffect = getBindedTaskEffect("Mind Seize")
	var multiverseFragment = getBindedItemEffect("Multiverse Fragment")
    var happiness = meditationEffect() * butlerEffect() / mindseizeEffect() * multiverseFragment() * gameData.currentProperty.getEffect()
    return happiness
}

function getEvil() {
    return gameData.evil
}

function getEssence() {
    return gameData.essence
}

function applyMultipliers(value, multipliers) {
    var finalMultiplier = 1
    multipliers.forEach(function(multiplierFunction) {
        var multiplier = multiplierFunction()
        finalMultiplier *= multiplier
    })
    var finalValue = Math.round(value * finalMultiplier)
    return finalValue
}

function applySpeed(value) {
    finalValue = value * getGameSpeed() / updateSpeed
    return finalValue
}

function getEvilGain() {
    var evilControl = gameData.taskData["Evil Control"]
    var bloodMeditation = gameData.taskData["Blood Meditation"]
	var absoluteWish = gameData.taskData ["Absolute Wish"]
	var oblivionEmbodiment = gameData.taskData ["Void Embodiment"]
	var yingYang = gameData.taskData ["Yin Yang"]
    var evil = evilControl.getEffect() * bloodMeditation.getEffect() * absoluteWish.getEffect() * oblivionEmbodiment.getEffect() * yingYang.getEffect()
    return evil
}

function getEssenceGain() {
    var essenceControl = gameData.taskData["Yin Yang"]
	var essenceCollector = gameData.taskData["Essence Collector"]
    var essence = essenceControl.getEffect() * essenceCollector.getEffect()
    return essence
	
}


function getGameSpeed() {
    var timeWarping = gameData.taskData["Time Warping"]
	var temporalDimension = gameData.taskData["Temporal Dimension"]
	var timeLoop = gameData.taskData["Time Loop"]
    var timeWarpingSpeed = gameData.timeWarpingEnabled ? timeWarping.getEffect() + temporalDimension.getEffect() * timeLoop.getEffect() : 1
    var gameSpeed = baseGameSpeed * +!gameData.paused * +isAlive() * timeWarpingSpeed
    return gameSpeed
}

function applyExpenses() {
    var coins = applySpeed(getExpense())
    gameData.coins -= coins
    if (gameData.coins < 0) {    
        goBankrupt()
    }
}

function getExpense() {
    var expense = 0
    expense += gameData.currentProperty.getExpense()
    for (misc of gameData.currentMisc) {
        expense += misc.getExpense()
    }
    return expense
}

function goBankrupt() {
    gameData.coins = 0
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []
}

function initUI() {
    setStickySidebar(gameData.settings.stickySidebar);
}

function setTab(element, selectedTab) {

    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    tabs.forEach(function(tab) {
        tab.style.display = "none"
    })
    document.getElementById(selectedTab).style.display = "flex"

    var tabButtons = document.getElementsByClassName("tabButton")
    for (tabButton of tabButtons) {
        tabButton.classList.remove("w3-blue-gray")
    }
    element.classList.add("w3-blue-gray")
}

function setPause() {
    gameData.paused = !gameData.paused
}

function setTimeWarping() {
    gameData.timeWarpingEnabled = !gameData.timeWarpingEnabled
}

function setTask(taskName) {
    var task = gameData.taskData[taskName]
    task instanceof Job ? gameData.currentJob = task : gameData.currentSkill = task
}

function setProperty(propertyName) {
    var property = gameData.itemData[propertyName]
    gameData.currentProperty = property
}

function setMisc(miscName) {
    var misc = gameData.itemData[miscName]
    if (gameData.currentMisc.includes(misc)) {
        for (i = 0; i < gameData.currentMisc.length; i++) {
            if (gameData.currentMisc[i] == misc) {
                gameData.currentMisc.splice(i, 1)
            }
        }
    } else {
        gameData.currentMisc.push(misc)
    }
}

function createData(data, baseData) {
    for (key in baseData) {
        var entity = baseData[key]
        createEntity(data, entity)
    }
}

function createEntity(data, entity) {
    if ("income" in entity) {data[entity.name] = new Job(entity)}
    else if ("maxXp" in entity) {data[entity.name] = new Skill(entity)}
    else {data[entity.name] = new Item(entity)}
    data[entity.name].id = "row " + entity.name
}

function createRequiredRow(categoryName) {
    var requiredRow = document.getElementsByClassName("requiredRowTemplate")[0].content.firstElementChild.cloneNode(true)
    requiredRow.classList.add("requiredRow")
    requiredRow.classList.add(removeSpaces(categoryName))
    requiredRow.id = categoryName
    return requiredRow
}

function createHeaderRow(templates, categoryType, categoryName) {
    var headerRow = templates.headerRow.content.firstElementChild.cloneNode(true)
    headerRow.getElementsByClassName("category")[0].textContent = categoryName
    if (categoryType != itemCategories) {
        headerRow.getElementsByClassName("valueType")[0].textContent = categoryType == jobCategories ? "Income/day" : "Effect"
    }

    headerRow.style.backgroundColor = headerRowColors[categoryName]
    headerRow.style.color = "#ffffff"
    headerRow.classList.add(removeSpaces(categoryName))
    headerRow.classList.add("headerRow")
    
    return headerRow
}

function createRow(templates, name, categoryName, categoryType) {
    var row = templates.row.content.firstElementChild.cloneNode(true)
    row.getElementsByClassName("name")[0].textContent = name
    row.getElementsByClassName("tooltipText")[0].textContent = tooltips[name]
    row.id = "row " + name
    if (categoryType != itemCategories) {
        row.getElementsByClassName("progressBar")[0].onclick = function() {setTask(name)}
    } else {
        row.getElementsByClassName("button")[0].onclick = categoryName == "Properties" ? function() {setProperty(name)} : function() {setMisc(name)}
    }

    return row
}

function createAllRows(categoryType, tableId) {
    var templates = {
        headerRow: document.getElementsByClassName(categoryType == itemCategories ? "headerRowItemTemplate" : "headerRowTaskTemplate")[0],
        row: document.getElementsByClassName(categoryType == itemCategories ? "rowItemTemplate" : "rowTaskTemplate")[0],
    }

    var table = document.getElementById(tableId)

    for (categoryName in categoryType) {
        var headerRow = createHeaderRow(templates, categoryType, categoryName)
        table.appendChild(headerRow)
        
        var category = categoryType[categoryName]
        category.forEach(function(name) {
            var row = createRow(templates, name, categoryName, categoryType)
            table.appendChild(row)       
        })

        var requiredRow = createRequiredRow(categoryName)
        table.append(requiredRow)
    }
}

function updateQuickTaskDisplay(taskType) {
    var currentTask = taskType == "job" ? gameData.currentJob : gameData.currentSkill
    var quickTaskDisplayElement = document.getElementById("quickTaskDisplay")
    var progressBar = quickTaskDisplayElement.getElementsByClassName(taskType)[0]
    progressBar.getElementsByClassName("name")[0].textContent = currentTask.name + " lvl " + currentTask.level
    progressBar.getElementsByClassName("progressFill")[0].style.width = currentTask.xp / currentTask.getMaxXp() * 100 + "%"
}

function updateRequiredRows(data, categoryType) {
    var requiredRows = document.getElementsByClassName("requiredRow")
    for (requiredRow of requiredRows) {
        var nextEntity = null
        var category = categoryType[requiredRow.id] 
        if (category == null) {continue}
        for (i = 0; i < category.length; i++) {
            var entityName = category[i]
            if (i >= category.length - 1) break
            var requirements = gameData.requirements[entityName]
            if (requirements && i == 0) {
                if (!requirements.isCompleted()) {
                    nextEntity = data[entityName]
                    break
                }
            }

            var nextIndex = i + 1
            if (nextIndex >= category.length) {break}
            var nextEntityName = category[nextIndex]
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
            var requirementObject = gameData.requirements[nextEntity.name]
            var requirements = requirementObject.requirements

            var coinElement = requiredRow.getElementsByClassName("coins")[0]
            var levelElement = requiredRow.getElementsByClassName("levels")[0]
            var evilElement = requiredRow.getElementsByClassName("evil")[0]
			var essenceElement = requiredRow.getElementsByClassName("essence")[0]

            coinElement.classList.add("hiddenTask")
            levelElement.classList.add("hiddenTask")
            evilElement.classList.add("hiddenTask")
			essenceElement.classList.add("hiddenTask")

            var finalText = ""
            if (data == gameData.taskData) {
                if (requirementObject instanceof EvilRequirement) {
                    evilElement.classList.remove("hiddenTask")
                    evilElement.textContent = format(requirements[0].requirement) + " evil"	
                } else if (requirementObject instanceof EssenceRequirement) {
                           essenceElement.classList.remove("hiddenTask")
                           essenceElement.textContent = format(requirements[0].requirement) + " essence"
                } else {
                    levelElement.classList.remove("hiddenTask")
                    for (requirement of requirements) {
                        var task = gameData.taskData[requirement.task]
                        if (task.level >= requirement.requirement) continue
                        var text = " " + requirement.task + " level " + format(task.level) + "/" + format(requirement.requirement) + ","
                        finalText += text
                    }
                    finalText = finalText.substring(0, finalText.length - 1)
                    levelElement.textContent = finalText
                }
            } 
		        else if (data == gameData.itemData) {
                coinElement.classList.remove("hiddenTask")
                formatCoins(requirements[0].requirement, coinElement)
            }
        }   
    }
}

function updateTaskRows() {
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        var row = document.getElementById("row " + task.name)
        row.getElementsByClassName("level")[0].textContent = task.level
        row.getElementsByClassName("xpGain")[0].textContent = format(task.getXpGain())
        row.getElementsByClassName("xpLeft")[0].textContent = format(task.getXpLeft())

        var maxLevel = row.getElementsByClassName("maxLevel")[0]
        maxLevel.textContent = task.maxLevel
        gameData.rebirthOneCount > 0 ? maxLevel.classList.remove("hidden") : maxLevel.classList.add("hidden")

        var progressFill = row.getElementsByClassName("progressFill")[0]
        progressFill.style.width = task.xp / task.getMaxXp() * 100 + "%"
        task == gameData.currentJob || task == gameData.currentSkill ? progressFill.classList.add("current") : progressFill.classList.remove("current")

        var valueElement = row.getElementsByClassName("value")[0]
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

function updateItemRows() {
    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        var row = document.getElementById("row " + item.name)
        var button = row.getElementsByClassName("button")[0]
        button.disabled = gameData.coins < item.getExpense()
        var active = row.getElementsByClassName("active")[0]
        var color = itemCategories["Properties"].includes(item.name) ? headerRowColors["Properties"] : headerRowColors["Misc"]
        active.style.backgroundColor = gameData.currentMisc.includes(item) || item == gameData.currentProperty ? color : "white"
        row.getElementsByClassName("effect")[0].textContent = item.getEffectDescription()
        formatCoins(item.getExpense(), row.getElementsByClassName("expense")[0])
    }
}

function updateHeaderRows(categories) {
    for (categoryName in categories) {
        var className = removeSpaces(categoryName)
        var headerRow = document.getElementsByClassName(className)[0]
        var maxLevelElement = headerRow.getElementsByClassName("maxLevel")[0]
        gameData.rebirthOneCount > 0 ? maxLevelElement.classList.remove("hidden") : maxLevelElement.classList.add("hidden")
    }
}

function updateText() {
    //Sidebar
    document.getElementById("ageDisplay").textContent = daysToYears(gameData.days)
    document.getElementById("dayDisplay").textContent = getDay()
    document.getElementById("lifespanDisplay").textContent = daysToYears(getLifespan())
    document.getElementById("pauseButton").textContent = gameData.paused ? "Play" : "Pause"

    formatCoins(gameData.coins, document.getElementById("coinDisplay"))
    setSignDisplay()
    formatCoins(getNet(), document.getElementById("netDisplay"))
    formatCoins(getIncome(), document.getElementById("incomeDisplay"))
    formatCoins(getExpense(), document.getElementById("expenseDisplay"))

    document.getElementById("happinessDisplay").textContent = getHappiness().toFixed(1)

    document.getElementById("evilDisplay").textContent = gameData.evil.toFixed(1)
    document.getElementById("evilGainDisplay").textContent = getEvilGain().toFixed(1)
	
	document.getElementById("essenceDisplay").textContent = gameData.essence.toFixed(1)
	document.getElementById("essenceGainDisplay").textContent = getEssenceGain().toFixed(1)

    document.getElementById("timeWarpingDisplay").textContent = "x" + (gameData.taskData["Time Warping"].getEffect() * gameData.taskData["Temporal Dimension"].getEffect() * gameData.taskData["Time Loop"].getEffect()).toFixed(1)
    document.getElementById("timeWarpingButton").textContent = gameData.timeWarpingEnabled ? "Disable warp" : "Enable warp"
	}

function setSignDisplay() {
    var signDisplay = document.getElementById("signDisplay")
    if (getIncome() > getExpense()) {
        signDisplay.textContent = "+"
        signDisplay.style.color = "green"
    } else if (getExpense() > getIncome()) {
        signDisplay.textContent = "-"
        signDisplay.style.color = "red"
    } else {
        signDisplay.textContent = ""
        signDisplay.style.color = "gray"
    }
}

function getNet() {
    var net = Math.abs(getIncome() - getExpense())
    return net
}

function hideEntities() {
    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        var completed = requirement.isCompleted()
        for (element of requirement.elements) {
            if (completed) {
                element.classList.remove("hidden")
            } else {
                element.classList.add("hidden")
            }
        }
    }
}

function createItemData(baseData) {
    for (var item of baseData) {
        gameData.itemData[item.name] = "happiness" in item ? new Property(task) : new Misc(task)
        gameData.itemData[item.name].id = "item " + item.name
    }
}

function doCurrentTask(task) {
    task.increaseXp()
    if (task instanceof Job && task == gameData.currentJob) {
        increaseCoins()
    }
}

function getIncome() {
    var income = 0
    income += gameData.currentJob.getIncome()
    return income
}

function increaseCoins() {
    var coins = applySpeed(getIncome())
    gameData.coins += coins
}

function daysToYears(days) {
    var years = Math.floor(days / 365)
    return years
}

function getCategoryFromEntityName(categoryType, entityName) {
    for (categoryName in categoryType) {
        var category = categoryType[categoryName]
        if (category.includes(entityName)) {
            return category
        }
    }
}

function getNextEntity(data, categoryType, entityName) {
    var category = getCategoryFromEntityName(categoryType, entityName)
    var nextIndex = category.indexOf(entityName) + 1
    if (nextIndex > category.length - 1) return null
    var nextEntityName = category[nextIndex]
    var nextEntity = data[nextEntityName]
    return nextEntity
}

function autoPromote() {
    if (!autoPromoteElement.checked) return
    var Max_Income = 0;
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task instanceof Job && gameData.requirements[key].completed)
        {
            var income = task.getIncome();
            if (income > Max_Income)
            {
                Max_Income = income;
                gameData.currentJob = task;
            }
        }
    }
}

function setSkillWithLowestMaxXp() {
      var enabledSkills = []

    for (skillName in gameData.taskData) {
        var skill = gameData.taskData[skillName]
        var requirement = gameData.requirements[skillName]
        /*
        Getting an autolearn error, and the dev console says there is an uncaught
        TypeError at this line of code below during the requirement.isCompleted() call. 
        I think the error is saying that when calling requirement.isCompleted, requirement is undefined.
        This would make sense if I have a skill that doesn't have any unlock requirements, which I think
        is true of Novel Knowledge for table rendering reasons. So the game logic assumes each skill has a requirement
        without actually checking if requirement is non-null. 
        */
        if (skill instanceof Skill) {
            //This check on the requirement variable is here to handle the case of a skill
            //having no requirements. By setting requirement equal to Concentration's requirements, 
            //we prevent unchecked TypeErrors that have been breaking the auto learn feature. 
            
            // NOTE : FRAGILE FIX
            // This fix will break if the Concentration skill is either removed from the game, renamed, or the requirement is no
            // longer immediately satisfied upon starting a new game. 
            if(requirement == null) {
                requirement = gameData.requirements["Concentration"];
            }
            if (requirement.isCompleted()) {
                enabledSkills.push(skill)
            }
        }
    }

    if (enabledSkills.length == 0) {
        skillWithLowestMaxXp = gameData.taskData["Concentration"]
        return
    }
	
	enabledSkills.sort((lhs, rhs) => { return lhs.getMaxXp() / lhs.getXpGain() - rhs.getMaxXp() / rhs.getXpGain() })

    var skillName = enabledSkills[0].name
    skillWithLowestMaxXp = gameData.taskData[skillName]
}

function getKeyOfLowestValueFromDict(dict) {
    var values = []
    for (key in dict) {
        var value = dict[key]
        values.push(value)
    }

    values.sort(function(a, b){return a - b})

    for (key in dict) {
        var value = dict[key]
        if (value == values[0]) {
            return key
        }
    }
}

function autoLearn() {
    if (!autoLearnElement.checked || !skillWithLowestMaxXp) return
    gameData.currentSkill = skillWithLowestMaxXp

    var usedExpense = 0;
    var income = getIncome()

    // auto items
    for (key in gameData.itemData) {
        if (gameData.requirements[key].completed) {
            var item = gameData.itemData[key]
            var expense = item.getExpense()

            if (itemCategories['Properties'].indexOf(key) != -1) {
                if (expense < income) {
                    gameData.currentProperty = item
                    usedExpense = expense
                }
            }
        }
    }

    for (key in gameData.currentMisc)
    {
        usedExpense += gameData.currentMisc[key].getExpense()
    }

    for (key in gameData.itemData) {
        if (gameData.requirements[key].completed) {
            var item = gameData.itemData[key]
            var expense = item.getExpense()
            if (itemCategories['Misc'].indexOf(key) != -1) {
                if (expense < income - usedExpense) {
                    if (gameData.currentMisc.indexOf(item) == -1) {
                        gameData.currentMisc.push(item)
                        usedExpense += expense
                    }
                }
            }
        }
    }
}

function yearsToDays(years) {
    var days = years * 365
    return days
}
 
function getDay() {
    var day = Math.floor(gameData.days - daysToYears(gameData.days) * 365)
    return day
}

function increaseDays() {
    var increase = applySpeed(1)
    gameData.days += increase
}

function format(number,decimals= 1) {
    // what tier? (determines SI symbol)
    var tier = Math.log10(number) / 3 | 0;
    // if zero, we don't need a suffix
    if(tier == 0) return number;
    // get suffix and determine scale
    var suffix = units[tier];
    var scale = Math.pow(10, tier * 3);
    // scale the number
    var scaled = number / scale;
    // format number and add suffix
    return scaled.toFixed(decimals) + suffix;
}

function formatCoins(coins, element) {
    var tiers = ["p", "g", "s"]
    var colors = {
        "p": "#79b9c7",
        "g": "#E5C100",
        "s": "#a8a8a8",
        "c": "#a15c2f"
    }
    var leftOver = coins
    var i = 0
    for (var tier of tiers) {
        var x = Math.floor(leftOver / Math.pow(10, (tiers.length - i) * 2))
        var leftOver = Math.floor(leftOver - x * Math.pow(10, (tiers.length - i) * 2))
        var text = (coins > 1e9 && i > 0) ? "" : format(String(x),2) + tier + " "
        element.children[i].textContent = x > 0 ? text : ""
        element.children[i].style.color = colors[tier]
        i += 1
    }
    if (leftOver == 0 && coins > 0 || coins > 1e9) {element.children[3].textContent = ""; return}
    var text = String(Math.floor(leftOver)) + "c"
    element.children[3].textContent = text
    element.children[3].style.color = colors["c"]
}

function getTaskElement(taskName) {
    var task = gameData.taskData[taskName]
    var element = document.getElementById(task.id)
    return element
}

function getItemElement(itemName) {
    var item = gameData.itemData[itemName]
    var element = document.getElementById(item.id)
    return element
}

function getElementsByClass(className) {
    var elements = document.getElementsByClassName(removeSpaces(className))
    return elements
}

function setLightDarkMode() {
    var body = document.getElementById("body")
    body.classList.contains("dark") ? body.classList.remove("dark") : body.classList.add("dark")
}

function removeSpaces(string) {
    var string = string.replace(/ /g, "")
    return string
}

function rebirthOne() {
    gameData.rebirthOneCount += 1

    rebirthReset()
}

function rebirthTwo() {
    gameData.rebirthTwoCount += 1
    gameData.evil += getEvilGain()
	
    rebirthReset()

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = 0
    }    
}

function rebirthThree() {
    gameData.rebirthThreeCount += 1
	if (gameData.essence < 30000) {
	gameData.essence += getEssenceGain()
	} else {
		gameData.essence += getEssenceGain() * 1.5;
	}	
	gameData.evil = 0

	
	var recallEffect = gameData.taskData["Cosmic Recollection"].getEffect();
    rebirthReset()
	
	for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        task.maxLevel = Math.floor(recallEffect * task.maxLevel);
    }
}

function rebirthReset() {
    setTab(jobTabButton, "jobs")

    gameData.coins = 0
    gameData.days = 365 * 14
    gameData.currentJob = gameData.taskData["Beggar"]
    gameData.currentSkill = gameData.taskData["Concentration"]
    gameData.currentProperty = gameData.itemData["Homeless"]
    gameData.currentMisc = []

    for (taskName in gameData.taskData) {
        var task = gameData.taskData[taskName]
        if (task.level > task.maxLevel) task.maxLevel = task.level
        task.level = 0
        task.xp = 0
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.completed && permanentUnlocks.includes(key)) continue
        requirement.completed = false
    }
}

function getLifespan() {
    var immortality = gameData.taskData["Life Essence"]
    var superImmortality = gameData.taskData["Astral Body"]
	var higherDimensions = gameData.taskData["Higher Dimensions"]
	var abyss = gameData.taskData["Ceaseless Abyss"]
    var cosmicLongevity = gameData.taskData["Cosmic Longevity"]
    var lifespan = baseLifespan * immortality.getEffect() * superImmortality.getEffect() * abyss.getEffect() * cosmicLongevity.getEffect() * higherDimensions.getEffect()
    return lifespan
}

function isAlive() {
    var condition = gameData.days < getLifespan()
    var deathText = document.getElementById("deathText")
    if (!condition) {
        gameData.days = getLifespan()
        deathText.classList.remove("hidden")
    }
    else {
        deathText.classList.add("hidden")
    }
    return condition
}

function assignMethods() {

    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if (task.baseData.income) {
            task.baseData = jobBaseData[task.name]
            task = Object.assign(new Job(jobBaseData[task.name]), task)
            
        } else {
            task.baseData = skillBaseData[task.name]
            task = Object.assign(new Skill(skillBaseData[task.name]), task)
        } 
        gameData.taskData[key] = task
    }

    for (key in gameData.itemData) {
        var item = gameData.itemData[key]
        item.baseData = itemBaseData[item.name]
        item = Object.assign(new Item(itemBaseData[item.name]), item)
        gameData.itemData[key] = item
    }

    for (key in gameData.requirements) {
        var requirement = gameData.requirements[key]
        if (requirement.type == "task") {
            requirement = Object.assign(new TaskRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "coins") {
            requirement = Object.assign(new CoinRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "age") {
            requirement = Object.assign(new AgeRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "evil") {
            requirement = Object.assign(new EvilRequirement(requirement.elements, requirement.requirements), requirement)
        } else if (requirement.type == "essence") {
            requirement = Object.assign(new EssenceRequirement(requirement.elements, requirement.requirements), requirement)
        }

        var tempRequirement = tempData["requirements"][key]
        requirement.elements = tempRequirement.elements
        requirement.requirements = tempRequirement.requirements
        gameData.requirements[key] = requirement
    }

    gameData.currentJob = gameData.taskData[gameData.currentJob.name]
    gameData.currentSkill = gameData.taskData[gameData.currentSkill.name]
    gameData.currentProperty = gameData.itemData[gameData.currentProperty.name]
    var newArray = []
    for (misc of gameData.currentMisc) {
        newArray.push(gameData.itemData[misc.name])
    }
    gameData.currentMisc = newArray
}

function replaceSaveDict(dict, saveDict) {
    for (key in dict) {
        if (!(key in saveDict)) {
            saveDict[key] = dict[key]
        } else if (dict == gameData.requirements) {
            if (saveDict[key].type != tempData["requirements"][key].type) {
                saveDict[key] = tempData["requirements"][key]
            }
        }
    }

    for (key in saveDict) {
        if (!(key in dict)) {
            delete saveDict[key]
        }
    }
}

function saveGameData() {
    localStorage.setItem("gameDataSave", JSON.stringify(gameData))
}

function loadGameData() {
    var gameDataSave = JSON.parse(localStorage.getItem("gameDataSave"))

    if (gameDataSave !== null) {
        replaceSaveDict(gameData, gameDataSave)
        replaceSaveDict(gameData.requirements, gameDataSave.requirements)
        replaceSaveDict(gameData.taskData, gameDataSave.taskData)
        replaceSaveDict(gameData.itemData, gameDataSave.itemData)
        replaceSaveDict(gameData.settings, gameDataSave.settings)

        gameData = gameDataSave
    }

    assignMethods()
}

function updateUI() {
    updateTaskRows()
    updateItemRows()
    updateRequiredRows(gameData.taskData, jobCategories)
    updateRequiredRows(gameData.taskData, skillCategories)
    updateRequiredRows(gameData.itemData, itemCategories)
    updateHeaderRows(jobCategories)
    updateHeaderRows(skillCategories)
    updateQuickTaskDisplay("job")
    updateQuickTaskDisplay("skill")
    hideEntities()
    updateText()  
}

function update() {
    increaseDays()
    autoPromote()
    autoLearn()
    for (key in gameData.taskData) {
        var task = gameData.taskData[key]
        if ((task instanceof Skill || task instanceof Job) && gameData.requirements[key].completed)
            doCurrentTask(task)
    }
    applyExpenses()
    updateUI()
}

function resetGameData() {
    localStorage.clear()
    location.reload()
}

function importGameData() {
    var importExportBox = document.getElementById("importExportBox")
    var data = JSON.parse(window.atob(importExportBox.value))
    gameData = data
    saveGameData()
    location.reload()
}

function exportGameData() {
    var importExportBox = document.getElementById("importExportBox")
    importExportBox.value = window.btoa(JSON.stringify(gameData))
}


// Keyboard shortcuts + Loadouts ( courtesy of Pseiko )

function changeTab(direction){
    var tabs = Array.prototype.slice.call(document.getElementsByClassName("tab"))
    var tabButtons = Array.prototype.slice.call(document.getElementsByClassName("tabButton"))

    var currentTab = 0
    for (i in tabs) {
        if (!tabs[i].style.display.includes("none"))
             currentTab = i*1
    }
    var targetTab = currentTab+direction
    targetTab = Math.max(0,targetTab)
    if( targetTab > (tabs.length-1)) targetTab = 0
    while(tabButtons[targetTab].style.display.includes("none")){
        targetTab = targetTab+direction
        targetTab = Math.max(0,targetTab) 
        if( targetTab > (tabs.length-1)) targetTab = 0
    }
	

	button = tabButtons[targetTab]
	setTab(button, tabs[targetTab].id)

} 

loadouts = {}

function saveLoadout(num){
	loadouts[num] = {
		job : gameData.currentJob.name,
		skill: gameData.currentSkill.name,
		property:gameData.currentProperty.name,
		misc: []
	}
	for (i in gameData.currentMisc) loadouts[num].misc.push(gameData.currentMisc[i].name)
}

function loadLoadout(num){
	if (num in loadouts)
	{
		gameData.currentMisc = []
		for (i in  loadouts[num].misc) setMisc( loadouts[num].misc[i])
		setProperty(loadouts[num].property)
		setTask(loadouts[num].skill)
		setTask(loadouts[num].job)
	}
	 document.getElementById("autoLearn").checked = false
	 document.getElementById("autoPromote").checked= false
}

window.addEventListener('keydown', function(e) {
    if (e.key == "1" && e.altKey) saveLoadout(1)
    if (e.key == "1" ) loadLoadout(1)
    if (e.key == "2" && e.altKey) saveLoadout(2)
    if (e.key == "2" ) loadLoadout(2)
    if (e.key == "3" && e.altKey) saveLoadout(3)
    if (e.key == "3" ) loadLoadout(3)
	
	if(e.key==" " && !e.repeat ) {
		setPause()
		if(e.target == document.body) {
			e.preventDefault();
		}
	}	
    if(e.key=="ArrowRight") changeTab(1) 
    if(e.key=="ArrowLeft") changeTab(-1) 
    if(e.key=="l" || e.key=="L") document.getElementById("autoLearn").checked = !document.getElementById("autoLearn").checked
    if(e.key=="p" || e.key=="P") document.getElementById("autoPromote").checked = !document.getElementById("autoPromote").checked
});

/*
(function() {
    let span = document.createElement('span');
    let div = document.createElement('div');
    div.classList.add('inline');
    div.textContent = 'Auto-pause(Void)';
    span.append(div);
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('inline');
    checkbox.id = 'autoPause';
    span.append(checkbox);
    document.querySelector('span#automation').prepend(document.createElement('br'));
    document.querySelector('span#automation').prepend(span);
    increaseDays = () => {
        var increase = applySpeed(1)
        var autoPause = document.getElementById("autoPause").checked;
        if (gameData.days < 365000 && gameData.days + increase > 365000 && autoPause){
            gameData.paused = true;
        }
        gameData.days += increase
    }
})()*/



//Init

createAllRows(jobCategories, "jobTable")
createAllRows(skillCategories, "skillTable")
createAllRows(itemCategories, "itemTable") 

createData(gameData.taskData, jobBaseData)
createData(gameData.taskData, skillBaseData)
createData(gameData.itemData, itemBaseData) 

gameData.currentJob = gameData.taskData["Beggar"]
gameData.currentSkill = gameData.taskData["Concentration"]
gameData.currentProperty = gameData.itemData["Homeless"]
gameData.currentMisc = []

gameData.requirements = {
    //Other
    "The Arcane Association": new TaskRequirement(getElementsByClass("The Arcane Association"), [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
	"Galactic Council": new AgeRequirement(getElementsByClass("Galactic Council"), [{requirement: 10000}]),
	"The Void": new AgeRequirement(getElementsByClass("The Void"), [{requirement: 1000}]),
	"Void Manipulation": new AgeRequirement(getElementsByClass("Void Manipulation"), [{requirement: 1000}]),
	"Celestial Powers": new AgeRequirement(getElementsByClass("Celestial Powers"), [{requirement: 10000}]),
    "Dark Magic": new EvilRequirement(getElementsByClass("Dark Magic"), [{requirement: 1}]),
	"Almightiness": new EssenceRequirement(getElementsByClass("Almightiness"), [{requirement: 1}]),
    //"Shop": new CoinRequirement([document.getElementById("shopTabButton")], [{requirement: gameData.itemData["Tent"].getExpense() * 50}]),
    "Rebirth tab": new AgeRequirement([document.getElementById("rebirthTabButton")], [{requirement: 25}]),
    "Rebirth note 1": new AgeRequirement([document.getElementById("rebirthNote1")], [{requirement: 45}]),
    "Rebirth note 2": new AgeRequirement([document.getElementById("rebirthNote2")], [{requirement: 65}]),
    "Rebirth note 3": new AgeRequirement([document.getElementById("rebirthNote3")], [{requirement: 200}]),
	"Rebirth note 4": new AgeRequirement([document.getElementById("rebirthNote4")], [{requirement: 1000}]),
	"Rebirth note 4": new AgeRequirement([document.getElementById("rebirthNote4")], [{requirement: 1000}]),
	"Rebirth note 5": new AgeRequirement([document.getElementById("rebirthNote5")], [{requirement: 10000}]),
    "Rebirth note 6": new TaskRequirement([document.getElementById("rebirthNote6")], [{ task: "Cosmic Recollection", requirement: 1 }]),

    "Rebirth button 1": new AgeRequirement([document.getElementById("rebirthButton1")], [{ requirement: 65 }]),
    "Rebirth button 2": new AgeRequirement([document.getElementById("rebirthButton2")], [{ requirement: 200 }]),
    "Rebirth button 3": new TaskRequirement([document.getElementById("rebirthButton3")], [{ task: "Cosmic Recollection", requirement: 1 }]),

    "Evil info": new EvilRequirement([document.getElementById("evilInfo")], [{requirement: 1}]),
	"Essence info": new EssenceRequirement([document.getElementById("essenceInfo")], [{requirement: 1}]),
    "Time warping info": new TaskRequirement([document.getElementById("timeWarping")], [{task: "Adept Mage", requirement: 10}]),

    "Automation": new AgeRequirement([document.getElementById("automation")], [{requirement: 20}]),
    "Quick task display": new AgeRequirement([document.getElementById("quickTaskDisplay")], [{requirement: 20}]),

    //Common work
    "Beggar": new TaskRequirement([getTaskElement("Beggar")], []),
    "Farmer": new TaskRequirement([getTaskElement("Farmer")], [{task: "Beggar", requirement: 10}]),
    "Fisherman": new TaskRequirement([getTaskElement("Fisherman")], [{task: "Farmer", requirement: 10}]),
    "Miner": new TaskRequirement([getTaskElement("Miner")], [{task: "Strength", requirement: 10}, {task: "Fisherman", requirement: 10}]),
    "Blacksmith": new TaskRequirement([getTaskElement("Blacksmith")], [{task: "Strength", requirement: 30}, {task: "Miner", requirement: 10}]),
    "Merchant": new TaskRequirement([getTaskElement("Merchant")], [{task: "Bargaining", requirement: 50}, {task: "Blacksmith", requirement: 10}]),

    //Military 
    "Squire": new TaskRequirement([getTaskElement("Squire")], [{task: "Strength", requirement: 5}]),
    "Footman": new TaskRequirement([getTaskElement("Footman")], [{task: "Strength", requirement: 20}, {task: "Squire", requirement: 10}]),
    "Veteran footman": new TaskRequirement([getTaskElement("Veteran footman")], [{task: "Battle Tactics", requirement: 40}, {task: "Footman", requirement: 10}]),
    "Centenary": new TaskRequirement([getTaskElement("Centenary")], [{task: "Strength", requirement: 100}, {task: "Veteran footman", requirement: 10}]),
    "Knight": new TaskRequirement([getTaskElement("Knight")], [{task: "Battle Tactics", requirement: 150}, {task: "Centenary", requirement: 10}]),
    "Veteran Knight": new TaskRequirement([getTaskElement("Veteran Knight")], [{task: "Strength", requirement: 300}, {task: "Knight", requirement: 10}]),
    "Holy Knight": new TaskRequirement([getTaskElement("Holy Knight")], [{task: "Mana Control", requirement: 500}, {task: "Veteran Knight", requirement: 10}]),
    "Lieutenant General": new TaskRequirement([getTaskElement("Lieutenant General")], [{task: "Mana Control", requirement: 1000}, {task: "Battle Tactics", requirement: 1000}, {task: "Holy Knight", requirement: 10}]),
	
	
    //The Arcane Association
    "Student": new TaskRequirement([getTaskElement("Student")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Apprentice Mage": new TaskRequirement([getTaskElement("Apprentice Mage")], [{task: "Mana Control", requirement: 400}, {task: "Student", requirement: 10}]),
    "Adept Mage": new TaskRequirement([getTaskElement("Adept Mage")], [{task: "Mana Control", requirement: 700}, {task: "Apprentice Mage", requirement: 10}]),
    "Master Wizard": new TaskRequirement([getTaskElement("Master Wizard")], [{task: "Mana Control", requirement: 1000}, {task: "Adept Mage", requirement: 10}]),
    "Archmage": new TaskRequirement([getTaskElement("Archmage")], [{task: "Mana Control", requirement: 1200}, {task: "Master Wizard", requirement: 10}]),
	"Chronomancer": new TaskRequirement([getTaskElement("Chronomancer")], [{task: "Mana Control", requirement: 1500}, {task: "Meditation", requirement: 1500}, {task: "Archmage", requirement: 25}]),
    "Chairman": new TaskRequirement([getTaskElement("Chairman")], [{task: "Mana Control", requirement: 2000}, {task: "Productivity", requirement: 2000}, {task: "Chronomancer", requirement: 50}]),
	"Imperator": new TaskRequirement([getTaskElement("Imperator")], [{task: "All Seeing Eye", requirement: 3000}, {task: "Concentration", requirement: 3000},  {task: "Chairman", requirement: 666}]),
	
	//The Void
    "Corrupted": new AgeRequirement([getTaskElement("Corrupted")], [{task: "Squire", requirement: 1000}]),
    "Void Slave": new TaskRequirement([getTaskElement("Void Slave")], [{task: "Corrupted", requirement: 30}]),
    "Void Fiend": new TaskRequirement([getTaskElement("Void Fiend")], [{task: "Brainwashing", requirement: 3000}, {task: "Void Slave", requirement: 200}]),
	"Abyss Anomaly": new TaskRequirement([getTaskElement("Abyss Anomaly")], [{task: "Mind Seize", requirement: 3000}, {task: "Void Fiend", requirement: 200}]),
	"Void Wraith": new TaskRequirement([getTaskElement("Void Wraith")], [{task: "Temporal Dimension", requirement: 3400}, {task: "Abyss Anomaly", requirement: 300}]),
	"Void Reaver": new TaskRequirement([getTaskElement("Void Reaver")], [{task: "Void Amplification", requirement: 3400}, {task: "Void Wraith", requirement: 250}]),
	"Void Lord":  new TaskRequirement([getTaskElement("Void Lord")], [{task: "Void Symbiosis", requirement: 3800}, {task: "Void Reaver", requirement: 150}]),
	"Abyss God": new TaskRequirement([getTaskElement("Abyss God")], [{task: "Void Embodiment", requirement: 4700}, {task: "Void Lord", requirement: 750}]),

	
	 //Galactic Council
    "Eternal Wanderer": new AgeRequirement([getTaskElement("Eternal Wanderer")], [{task: "Squire", requirement: 10000}]),
    "Nova": new TaskRequirement([getTaskElement("Nova")], [{task: "Eternal Wanderer", requirement: 15}, {task: "Cosmic Longevity", requirement: 4000}]),
	"Sigma Proioxis": new TaskRequirement([getTaskElement("Sigma Proioxis")], [{task: "Nova", requirement: 200}, {task: "Cosmic Recollection", requirement: 4500}]),
	"Acallaris": new TaskRequirement([getTaskElement("Acallaris")], [{task: "Galactic Command", requirement: 5000}, {task: "Sigma Proioxis", requirement: 1000}]),
	"One Above All": new TaskRequirement([getTaskElement("One Above All")], [{task: "Meditation", requirement: 6300}, {task: "Acallaris", requirement: 1400}]),

	

    //Fundamentals
    "Concentration": new TaskRequirement([getTaskElement("Concentration")], []),
    "Productivity": new TaskRequirement([getTaskElement("Productivity")], [{task: "Concentration", requirement: 5}]),
    "Bargaining": new TaskRequirement([getTaskElement("Bargaining")], [{task: "Concentration", requirement: 20}]),
    "Meditation": new TaskRequirement([getTaskElement("Meditation")], [{task: "Concentration", requirement: 30}, {task: "Productivity", requirement: 20}]),

    //Combat
    "Strength": new TaskRequirement([getTaskElement("Strength")], []),
    "Battle Tactics": new TaskRequirement([getTaskElement("Battle Tactics")], [{task: "Concentration", requirement: 20}]),
    "Muscle Memory": new TaskRequirement([getTaskElement("Muscle Memory")], [{task: "Concentration", requirement: 30}, {task: "Strength", requirement: 30}]),

    //Magic
    "Mana Control": new TaskRequirement([getTaskElement("Mana Control")], [{task: "Concentration", requirement: 200}, {task: "Meditation", requirement: 200}]),
    "Life Essence": new TaskRequirement([getTaskElement("Life Essence")], [{task: "Apprentice Mage", requirement: 10}]),
    "Time Warping": new TaskRequirement([getTaskElement("Time Warping")], [{task: "Adept Mage", requirement: 10}]),
    "Astral Body": new TaskRequirement([getTaskElement("Astral Body")], [{task: "Archmage", requirement: 10}]),
    "Temporal Dimension": new TaskRequirement([getTaskElement("Temporal Dimension")], [{task: "Chronomancer", requirement: 25}]),
	"All Seeing Eye": new TaskRequirement([getTaskElement("All Seeing Eye")], [{task: "Mana Control", requirement: 2500}, {task: "Chairman", requirement: 100}]),
	"Brainwashing": new TaskRequirement([getTaskElement("Brainwashing")], [{task: "Imperator", requirement: 100}]),

    //Dark magic
    "Dark Influence": new EvilRequirement([getTaskElement("Dark Influence")], [{requirement: 1}]),
    "Evil Control": new EvilRequirement([getTaskElement("Evil Control")], [{requirement: 1}]),
    "Intimidation": new EvilRequirement([getTaskElement("Intimidation")], [{requirement: 1}]),
    "Demon Training": new EvilRequirement([getTaskElement("Demon Training")], [{requirement: 20}]),
    "Blood Meditation": new EvilRequirement([getTaskElement("Blood Meditation")], [{requirement: 50}]),
    "Demon's Wealth": new EvilRequirement([getTaskElement("Demon's Wealth")], [{requirement: 500}]),
	"Dark Knowledge": new EvilRequirement([getTaskElement("Dark Knowledge")], [{requirement: 5000}]),
	"Void Influence": new EvilRequirement([getTaskElement("Void Influence")], [{requirement: 50000}]),
	"Time Loop": new EvilRequirement([getTaskElement("Time Loop")], [{requirement: 2500000}]),
	"Evil Incarnate": new EvilRequirement([getTaskElement("Evil Incarnate")], [{requirement: 1000000000}]),


	
	//Void Manipulation
	"Absolute Wish": new TaskRequirement([getTaskElement("Absolute Wish")], [{task: "Void Slave", requirement: 25}, {task: "Chairman", requirement: 300}]),
	"Void Amplification": new TaskRequirement([getTaskElement("Void Amplification")], [{task: "Void Slave", requirement: 100}, {task: "Absolute Wish", requirement: 3000}]),
	"Mind Seize": new TaskRequirement([getTaskElement("Mind Seize")], [{task: "Void Amplification", requirement: 3000}]),
	"Ceaseless Abyss": new TaskRequirement([getTaskElement("Ceaseless Abyss")], [{task: "Void Influence", requirement: 4000}, {task: "Abyss Anomaly", requirement: 50}]),
	"Void Symbiosis": new TaskRequirement([getTaskElement("Void Symbiosis")], [{task: "Ceaseless Abyss", requirement: 3500}, {task: "Void Reaver", requirement: 50}]),
	"Void Embodiment": new TaskRequirement([getTaskElement("Void Embodiment")], [{task: "Dark Influence", requirement: 4600}, {task: "Void Lord", requirement: 50}]),
	"Abyss Manipulation": new TaskRequirement([getTaskElement("Abyss Manipulation")], [{task: "Abyss God", requirement: 350}, {task: "Dark Influence", requirement: 6000}, {task: "Void Influence", requirement: 6000}]),
	
	//Celestial Powers
	"Cosmic Longevity": new TaskRequirement([getTaskElement("Cosmic Longevity")], [{task: "Eternal Wanderer", requirement: 1}]),
    "Cosmic Recollection": new TaskRequirement([getTaskElement("Cosmic Recollection")], [{task: "Nova", requirement: 50}, {task: "Meditation", requirement: 4200}, {task: "Mind Seize", requirement: 3000}]),
	"Essence Collector": new TaskRequirement([getTaskElement("Essence Collector")], [{task: "Sigma Proioxis", requirement: 500}, {task: "Absolute Wish", requirement: 4900}, {task: "Dark Knowledge", requirement: 6300}]),
	"Galactic Command": new TaskRequirement([getTaskElement("Galactic Command")], [{task: "Essence Collector", requirement: 5000}, {task: "Bargaining", requirement: 5000}]),

    //Essence
	"Yin Yang": new EssenceRequirement([getTaskElement("Yin Yang")], [{requirement: 1}]),
	"Parallel Universe": new EssenceRequirement([getTaskElement("Parallel Universe")], [{requirement: 1}]),
	"Higher Dimensions": new EssenceRequirement([getTaskElement("Higher Dimensions")], [{requirement: 10000}]),
	"Epiphany": new EssenceRequirement([getTaskElement("Epiphany")], [{requirement: 30000}]),


    //Properties
    "Homeless": new CoinRequirement([getItemElement("Homeless")], [{requirement: 0}]),
    "Tent": new CoinRequirement([getItemElement("Tent")], [{requirement: 0}]),
    "Wooden Hut": new CoinRequirement([getItemElement("Wooden Hut")], [{requirement: gameData.itemData["Wooden Hut"].getExpense() * 100}]),
    "Cottage": new CoinRequirement([getItemElement("Cottage")], [{requirement: gameData.itemData["Cottage"].getExpense() * 100}]),
    "House": new CoinRequirement([getItemElement("House")], [{requirement: gameData.itemData["House"].getExpense() * 100}]),
    "Large House": new CoinRequirement([getItemElement("Large House")], [{requirement: gameData.itemData["Large House"].getExpense() * 100}]),
    "Small Palace": new CoinRequirement([getItemElement("Small Palace")], [{requirement: gameData.itemData["Small Palace"].getExpense() * 100}]),
    "Grand Palace": new CoinRequirement([getItemElement("Grand Palace")], [{requirement: gameData.itemData["Grand Palace"].getExpense() * 100}]),
	"Town Ruler": new CoinRequirement([getItemElement("Town Ruler")], [{requirement: gameData.itemData["Town Ruler"].getExpense() * 100}]),
	"City Ruler": new CoinRequirement([getItemElement("City Ruler")], [{requirement: gameData.itemData["City Ruler"].getExpense() * 100}]),
	"Nation Ruler": new CoinRequirement([getItemElement("Nation Ruler")], [{requirement: gameData.itemData["Nation Ruler"].getExpense() * 100}]),
    "Pocket Dimension": new CoinRequirement([getItemElement("Pocket Dimension")], [{requirement: gameData.itemData["Pocket Dimension"].getExpense() * 100}]),
	"Void Realm": new CoinRequirement([getItemElement("Void Realm")], [{requirement: gameData.itemData["Void Realm"].getExpense() * 100}]),
	"Void Universe": new CoinRequirement([getItemElement("Void Universe")], [{requirement: gameData.itemData["Void Universe"].getExpense() * 100}]),
	"Astral Realm": new CoinRequirement([getItemElement("Astral Realm")], [{requirement: gameData.itemData["Astral Realm"].getExpense() * 100}]),
	"Galactic Throne": new CoinRequirement([getItemElement("Galactic Throne")], [{requirement: gameData.itemData["Galactic Throne"].getExpense() * 100}]),


    //Misc
    "Book": new CoinRequirement([getItemElement("Book")], [{requirement: 0}]),
    "Dumbbells": new CoinRequirement([getItemElement("Dumbbells")], [{requirement: gameData.itemData["Dumbbells"].getExpense() * 100}]),
    "Personal Squire": new CoinRequirement([getItemElement("Personal Squire")], [{requirement: gameData.itemData["Personal Squire"].getExpense() * 100}]),
    "Steel Longsword": new CoinRequirement([getItemElement("Steel Longsword")], [{requirement: gameData.itemData["Steel Longsword"].getExpense() * 100}]),
    "Butler": new CoinRequirement([getItemElement("Butler")], [{requirement: gameData.itemData["Butler"].getExpense() * 100}]),
    "Sapphire Charm": new CoinRequirement([getItemElement("Sapphire Charm")], [{requirement: gameData.itemData["Sapphire Charm"].getExpense() * 100}]),
    "Study Desk": new CoinRequirement([getItemElement("Study Desk")], [{requirement: gameData.itemData["Study Desk"].getExpense() * 100}]),
    "Library": new CoinRequirement([getItemElement("Library")], [{requirement: gameData.itemData["Library"].getExpense() * 100}]), 
	"Observatory": new CoinRequirement([getItemElement("Observatory")], [{requirement: gameData.itemData["Observatory"].getExpense() * 100}]),
	"Mind's Eye": new CoinRequirement([getItemElement("Mind's Eye")], [{requirement: gameData.itemData["Mind's Eye"].getExpense() * 100}]),
	"Void Necklace": new CoinRequirement([getItemElement("Void Necklace")], [{requirement: gameData.itemData["Void Necklace"].getExpense() * 100}]),
	"Void Armor": new CoinRequirement([getItemElement("Void Armor")], [{requirement: gameData.itemData["Void Armor"].getExpense() * 100}]),
	"Void Blade": new CoinRequirement([getItemElement("Void Blade")], [{requirement: gameData.itemData["Void Blade"].getExpense() * 100}]),
	"Void Orb": new CoinRequirement([getItemElement("Void Orb")], [{requirement: gameData.itemData["Void Orb"].getExpense() * 100}]),
	"Void Dust": new CoinRequirement([getItemElement("Void Dust")], [{requirement: gameData.itemData["Void Dust"].getExpense() * 100}]),
	"Celestial Robe": new CoinRequirement([getItemElement("Celestial Robe")], [{requirement: gameData.itemData["Celestial Robe"].getExpense() * 100}]),
	"Universe Fragment": new CoinRequirement([getItemElement("Universe Fragment")], [{requirement: gameData.itemData["Universe Fragment"].getExpense() * 100}]),
	"Multiverse Fragment": new CoinRequirement([getItemElement("Multiverse Fragment")], [{requirement: gameData.itemData["Multiverse Fragment"].getExpense() * 100}]),
}

tempData["requirements"] = {}
for (key in gameData.requirements) {
    var requirement = gameData.requirements[key]
    tempData["requirements"][key] = requirement
}

loadGameData()

initUI()

setCustomEffects()
addMultipliers()

setTab(jobTabButton, "jobs")

update()
setInterval(update, 1000 / updateSpeed)
setInterval(saveGameData, 3000)
setInterval(setSkillWithLowestMaxXp, 1000)