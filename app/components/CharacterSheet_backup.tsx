'use client';

import { useState } from 'react';

// Add Google Font
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// TypeScript interface - defines the shape of our character data
interface Character {
  name: string;
  class: string;
  race: string;
  background: string;
  alignment: string;
  level: number;
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  health: {
    currentHp: number;
    maxHp: number;
    tempHp: number;
  };
  proficiencyBonus: number;
  skills: {
    [key: string]: boolean; // true = proficient, false = not proficient
  };
  savingThrows: {
    strength: boolean;
    dexterity: boolean;
    constitution: boolean;
    intelligence: boolean;
    wisdom: boolean;
    charisma: boolean;
  };
  derivedStats: {
    armorClass: number;
    initiative: number;
    speed: number;
  };
  portrait?: string; // Optional portrait image URL
}

export default function CharacterSheet() {
  // Dark/Light mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Fantasy Calendar System
  const fantasyCalendar = {
    seasons: [
      {
        name: 'Spring',
        months: [
          { name: 'Early Spring', days: 30 },
          { name: 'Midspring', days: 31 },
          { name: 'Late Spring', days: 30 }
        ]
      },
      {
        name: 'Summer',
        months: [
          { name: 'Early Summer', days: 31 },
          { name: 'Midsummer', days: 30 },
          { name: 'Late Summer', days: 31 }
        ]
      },
      {
        name: 'Autumn',
        months: [
          { name: 'Early Autumn', days: 30 },
          { name: 'Midautumn', days: 31 },
          { name: 'Late Autumn', days: 30 }
        ]
      },
      {
        name: 'Winter',
        months: [
          { name: 'Early Winter', days: 30 },
          { name: 'Midwinter', days: 31 },
          { name: 'Late Winter', days: 30 }
        ]
      }
    ]
  };

  // Fantasy date state
  const [fantasyDate, setFantasyDate] = useState({
    day: 14,
    monthIndex: 0, // Early Spring
    year: 4122,
    era: 'Year-of-the-Ivory'
  });

  const [weather, setWeather] = useState('sunny');
  const [survivalConditions, setSurvivalConditions] = useState({
    hunger: { stage: 'Ok', effect: 0 },
    thirst: { stage: 'Ok', effect: 0 },
    fatigue: { stage: 'Ok', effect: 0 }
  });
  const [additionalExhaustion, setAdditionalExhaustion] = useState(0);
  
  // Hit Dice and Death Saves state
  const [hitDice, setHitDice] = useState({ current: 5, max: 5, reduction: 0 });
  const [resistances, setResistances] = useState('');
  const [deathSaves, setDeathSaves] = useState({ failures: 0, successes: 0 });
  
  // Armor state
  const [armor, setArmor] = useState({
    armorType: 'Padded',
    armorPlus: 0,
    armorNotches: '',
    shield: 'Shield',
    shieldPlus: 0,
    shieldNotches: '',
    magicalAttire: [
      { item: '', plus: 0, notches: '' },
      { item: '', plus: 0, notches: '' }
    ]
  });
  
  // Fantasy Calendar Helper Functions
  const getAllMonths = () => {
    const months: any[] = [];
    fantasyCalendar.seasons.forEach(season => {
      season.months.forEach((month, index) => {
        months.push({
          ...month,
          seasonName: season.name,
          globalIndex: months.length
        });
      });
    });
    return months;
  };

  const getCurrentMonth = () => {
    const months = getAllMonths();
    return months[fantasyDate.monthIndex];
  };

  const formatFantasyDate = () => {
    const currentMonth = getCurrentMonth();
    return `${fantasyDate.day}${getOrdinalSuffix(fantasyDate.day)} of ${currentMonth.name}, ${fantasyDate.year} ${fantasyDate.era}`;
  };

  const getOrdinalSuffix = (day) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const updateFantasyDay = (newDay) => {
    const currentMonth = getCurrentMonth();
    if (newDay >= 1 && newDay <= currentMonth.days) {
      setFantasyDate(prev => ({ ...prev, day: newDay }));
    }
  };

  const updateFantasyMonth = (newMonthIndex) => {
    const months = getAllMonths();
    if (newMonthIndex >= 0 && newMonthIndex < months.length) {
      const newMonth = months[newMonthIndex];
      setFantasyDate(prev => ({
        ...prev,
        monthIndex: newMonthIndex,
        day: Math.min(prev.day, newMonth.days) // Adjust day if it exceeds new month's days
      }));
    }
  };
  
  // Tab state
  const [activeTab, setActiveTab] = useState('stats');

  // Equipped items dropdown state
  const [equippedItemsDropdowns, setEquippedItemsDropdowns] = useState<{ [key: number]: boolean }>({});
  const [emptyEquippedItemsDropdowns, setEmptyEquippedItemsDropdowns] = useState<{ [key: number]: boolean }>({});
  const [emptyEquippedItemsTypes, setEmptyEquippedItemsTypes] = useState<{ [key: number]: string }>({});
  
  // Encumbrance status state
  const [isEncumbered, setIsEncumbered] = useState(false);
  
  // Data tab state
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [carryingSize, setCarryingSize] = useState<string>('Medium');
  const [speeds, setSpeeds] = useState({
    walk: '',
    climb: '',
    swim: '',
    burrow: '',
    fly: ''
  });
  
  // Coin amounts state
  const [coinAmounts, setCoinAmounts] = useState({
    iron: 0,
    copper: 0,
    silver: 0,
    gold: 10,
    platinum: 0
  });

  // Inventory state
  const [magicalContainers, setMagicalContainers] = useState([
    { type: 'Bag of Holding', owned: 0, slotsGranted: 25 },
    { type: 'Portable Hole', owned: 0, slotsGranted: 50 },
    { type: 'Handy Haversack', owned: 0, slotsGranted: 10 },
    { type: 'Quiver of Ehlonna', owned: 0, slotsGranted: 5 }
  ]);
  const [equippedItems, setEquippedItems] = useState([
    { type: 'Weapon', item: 'Yumi (Longbow)', bonus: '+7', range: '150-600 ft', notches: 0, value: 50, bulk: 2, reqAtt: false },
    { type: 'Weapon', item: 'Wakizashi (Shortsword)', bonus: '+5', range: 'melee', notches: 1, value: 10, bulk: 1, reqAtt: false },
    { type: 'Armor', item: 'Karuta (Studded Leather)', bonus: '', range: '', notches: 0, value: 45, bulk: 1, reqAtt: false },
    { type: 'Ammunition', item: 'Arrows', bonus: '', range: '', notches: 0, value: 1, bulk: 0.1, reqAtt: false }
  ]);
  const [inventoryItems, setInventoryItems] = useState([
    { item: 'Rope', details: 'Hempen (50 feet)', amount: 1, value: 2, bulk: 1.8 },
    { item: 'Backpack', details: '', amount: 1, value: 2, bulk: 0.1 },
    { item: 'Bedroll', details: '', amount: 1, value: 0.1, bulk: 0.2 },
    { item: 'Mess Kit', details: '', amount: 1, value: 0.2, bulk: 0.1 },
    { item: 'Tinderbox', details: '', amount: 1, value: 0.5, bulk: 0.1 },
    { item: 'Torches', details: '', amount: 10, value: 0.01, bulk: 0.1 }
  ]);
  const [rationBox, setRationBox] = useState({ boxesQty: 0, rationsQty: 0 });
  const [waterskin, setWaterskin] = useState({ skinsQty: 0, rationsQty: 0 });
  
  // Hit Points state
  const [hitPointRolls, setHitPointRolls] = useState<number[]>(Array(20).fill(0));
  const [additionalHPBonuses, setAdditionalHPBonuses] = useState(0);
  const [hasToughness, setHasToughness] = useState(false);
  const [isPHBHillDwarf, setIsPHBHillDwarf] = useState(false);

  // Calculation functions
  const calculateTotalValue = () => {
    return (
      coinAmounts.iron * 0.01 +
      coinAmounts.copper * 0.1 +
      coinAmounts.silver * 1 +
      coinAmounts.gold * 10 +
      coinAmounts.platinum * 100
    );
  };

  const calculatePurseBulk = () => {
    const totalCoins = coinAmounts.iron + coinAmounts.copper + coinAmounts.silver + coinAmounts.gold + coinAmounts.platinum;
    if (totalCoins <= 100) {
      return 0;
    } else {
      return Math.floor(totalCoins / 100) - 1;
    }
  };

  const calculateEquippedItemsBulk = () => {
    return equippedItems.reduce((total, item) => total + (item.bulk || 0), 0);
  };

  const calculateInventoryBulk = () => {
    return inventoryItems.reduce((total, item) => total + (item.amount * item.bulk), 0);
  };

  const calculateRationBoxBulk = () => {
    return rationBox.boxesQty * 0.1 + rationBox.rationsQty * 0.1; // Assuming each box and ration = 0.1 bulk
  };

  const calculateWaterskinBulk = () => {
    return waterskin.skinsQty * 0.2 + waterskin.rationsQty * 0.1; // Assuming waterskin = 0.2, rations = 0.1 bulk
  };

  const calculateTotalBulk = () => {
    return calculateEquippedItemsBulk() + calculateInventoryBulk() + calculatePurseBulk() + calculateRationBoxBulk() + calculateWaterskinBulk();
  };

  const calculateMaxSlots = () => {
    const strMod = getModifier(character.abilityScores.strength);
    
    // Base slots by size
    let baseSlots;
    switch(carryingSize) {
      case 'Tiny': baseSlots = 6 + strMod;
      case 'Small': baseSlots = 14 + strMod;
      case 'Medium': baseSlots = 18 + strMod;
      case 'Large': baseSlots = 22 + (strMod * 2);
      case 'Huge': baseSlots = 30 + (strMod * 4);
      case 'Gargantuan': baseSlots = 46 + (strMod * 8);
      default: baseSlots = 18 + strMod; // Default to Medium
    }
    
    // Add magical container bonuses (BC * BF for each row)
    const magicalBonus = magicalContainers.reduce((total, container) => 
      total + (container.owned * container.slotsGranted), 0);
    
    return baseSlots + magicalBonus;
  };

  const calculateOpenSlots = () => {
    return calculateMaxSlots() - calculateTotalBulk();
  };

  const calculateYourBulk = () => {
    const openSlots = calculateOpenSlots();
    const maxSlots = calculateMaxSlots();
    
    switch(carryingSize) {
      case 'Tiny': return Math.max(5, maxSlots - openSlots);
      case 'Small': return Math.max(10, maxSlots - openSlots);
      case 'Medium': return Math.max(20, maxSlots - openSlots);
      case 'Large': return Math.max(40, maxSlots - openSlots);
      case 'Huge': return Math.max(80, maxSlots - openSlots);
      case 'Gargantuan': return Math.max(160, maxSlots - openSlots);
      default: return Math.max(20, maxSlots - openSlots); // Default to Medium
    }
  };

  // D&D 5e Race and Class Data
  const raceData: { [key: string]: { abilityBonuses: { [key: string]: number }, skillProficiencies: string[] } } = {
    'Human': { abilityBonuses: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 }, skillProficiencies: [] },
    'Elf': { abilityBonuses: { dexterity: 2 }, skillProficiencies: ['Perception'] },
    'Dwarf': { abilityBonuses: { constitution: 2 }, skillProficiencies: [] },
    'Halfling': { abilityBonuses: { dexterity: 2 }, skillProficiencies: [] },
    'Dragonborn': { abilityBonuses: { strength: 2, charisma: 1 }, skillProficiencies: [] },
    'Gnome': { abilityBonuses: { intelligence: 2 }, skillProficiencies: [] },
    'Half-Elf': { abilityBonuses: { charisma: 2 }, skillProficiencies: [] }, // +1 to two different abilities - simplified
    'Half-Orc': { abilityBonuses: { strength: 2, constitution: 1 }, skillProficiencies: [] },
    'Tiefling': { abilityBonuses: { intelligence: 1, charisma: 2 }, skillProficiencies: [] }
  };

  const classData: { [key: string]: { skillProficiencies: string[], savingThrows: string[] } } = {
    'Barbarian': { skillProficiencies: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'], savingThrows: ['strength', 'constitution'] },
    'Bard': { skillProficiencies: [], savingThrows: ['dexterity', 'charisma'] }, // Choose any 3 skills - simplified
    'Cleric': { skillProficiencies: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'], savingThrows: ['wisdom', 'charisma'] },
    'Druid': { skillProficiencies: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'], savingThrows: ['intelligence', 'wisdom'] },
    'Fighter': { skillProficiencies: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'], savingThrows: ['strength', 'constitution'] },
    'Monk': { skillProficiencies: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'], savingThrows: ['strength', 'dexterity'] },
    'Paladin': { skillProficiencies: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'], savingThrows: ['wisdom', 'charisma'] },
    'Ranger': { skillProficiencies: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'], savingThrows: ['strength', 'dexterity'] },
    'Rogue': { skillProficiencies: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'], savingThrows: ['dexterity', 'intelligence'] },
    'Sorcerer': { skillProficiencies: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'], savingThrows: ['constitution', 'charisma'] },
    'Warlock': { skillProficiencies: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'], savingThrows: ['wisdom', 'charisma'] },
    'Wizard': { skillProficiencies: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'], savingThrows: ['intelligence', 'wisdom'] }
  };

  // Helper function to apply race bonuses
  const applyRaceEffects = (character: Character) => {
    const raceInfo = raceData[character.race];
    if (!raceInfo) return character;

    const baseAbilityScores = {
      strength: 10, dexterity: 10, constitution: 10,
      intelligence: 10, wisdom: 10, charisma: 10
    };

    const newAbilityScores = { ...character.abilityScores };
    Object.entries(raceInfo.abilityBonuses).forEach(([ability, bonus]) => {
      if (ability in newAbilityScores) {
        // Apply racial bonus to base score
        newAbilityScores[ability as keyof typeof newAbilityScores] = 
          (character.abilityScores[ability as keyof typeof character.abilityScores] - 
           (raceData[character.race]?.abilityBonuses[ability] || 0)) + bonus;
      }
    });

    const newSkills = { ...character.skills };
    raceInfo.skillProficiencies.forEach(skill => {
      newSkills[skill] = true;
    });

    return { ...character, abilityScores: newAbilityScores, skills: newSkills };
  };

  // Helper function to apply class effects
  const applyClassEffects = (character: Character) => {
    const classInfo = classData[character.class];
    if (!classInfo) return character;

    const newSavingThrows = { ...character.savingThrows };
    classInfo.savingThrows.forEach(save => {
      newSavingThrows[save as keyof typeof character.savingThrows] = true;
    });

    return { ...character, savingThrows: newSavingThrows };
  };

  // Survival condition helpers
  const getSurvivalColor = (stage: string, type: 'hunger' | 'thirst' | 'fatigue') => {
    if (type === 'hunger') {
      switch(stage) {
        case 'Stuffed': case 'Well-fed': return 'bg-green-500';
        case 'Ok': return 'bg-green-400';
        case 'Peckish': return 'bg-amber-600';
        case 'Hungry': return 'bg-amber-700';
        case 'Ravenous': return 'bg-red-400';
        case 'Starving': return 'bg-red-600';
        default: return 'bg-gray-400';
      }
    }
    if (type === 'thirst') {
      switch(stage) {
        case 'Quenched': case 'Refreshed': return 'bg-green-500';
        case 'Ok': return 'bg-green-400';
        case 'Parched': return 'bg-amber-600';
        case 'Thirsty': return 'bg-amber-700';
        case 'Dry': return 'bg-red-400';
        case 'Dehydrated': return 'bg-red-600';
        default: return 'bg-gray-400';
      }
    }
    if (type === 'fatigue') {
      switch(stage) {
        case 'Energized': case 'Well-rested': return 'bg-green-500';
        case 'Ok': return 'bg-green-400';
        case 'Tired': return 'bg-amber-600';
        case 'Sleepy': return 'bg-amber-700';
        case 'Very sleepy': return 'bg-red-400';
        case 'Barely awake': return 'bg-red-600';
        default: return 'bg-gray-400';
      }
    }
    return 'bg-gray-400';
  };

  const getSurvivalEffect = (stage: string, type: 'hunger' | 'thirst' | 'fatigue') => {
    if (type === 'hunger') {
      switch(stage) {
        case 'Stuffed': return -1;
        case 'Well-fed': return 0;
        case 'Ok': return 0;
        case 'Peckish': return 0;
        case 'Hungry': return 1;
        case 'Ravenous': return 1;
        case 'Starving': return 1;
        default: return 0;
      }
    }
    if (type === 'thirst') {
      switch(stage) {
        case 'Quenched': return -1;
        case 'Refreshed': return 0;
        case 'Ok': return 0;
        case 'Parched': return 0;
        case 'Thirsty': return 1;
        case 'Dry': return 1;
        case 'Dehydrated': return 1;
        default: return 0;
      }
    }
    if (type === 'fatigue') {
      switch(stage) {
        case 'Energized': return -1;
        case 'Well-rested': return 0;
        case 'Ok': return 0;
        case 'Tired': return 1;
        case 'Sleepy': return 1;
        case 'Very sleepy': return 1;
        case 'Barely awake': return 1;
        default: return 0;
      }
    }
    return 0;
  };

  // Weather animation component
  const WeatherIcon = ({ type }: { type: string }) => {
    const getNextWeather = () => {
      const weathers = ['sunny', 'sunset', 'rainy', 'sunrise', 'snowy', 'night', 'cave'];
      const currentIndex = weathers.indexOf(type);
      return weathers[(currentIndex + 1) % weathers.length];
    };

    return (
      <div 
        className="weather-icon cursor-pointer select-none" 
        onClick={() => setWeather(getNextWeather())}
        style={{ width: '60px', height: '60px', position: 'relative' }}
      >
        <style>{`
          .weather-icon {
            transition: transform 0.3s ease;
          }
          .weather-icon:hover {
            transform: scale(1.1);
          }
          
          .sun {
            width: 40px;
            height: 40px;
            background: #FFD700;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: rotate 8s linear infinite;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          }
          
          .cloud {
            width: 50px;
            height: 20px;
            background: #87CEEB;
            border-radius: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: float 3s ease-in-out infinite;
          }
          .cloud::before,
          .cloud::after {
            content: '';
            position: absolute;
            background: #87CEEB;
            border-radius: 50%;
          }
          .cloud::before {
            width: 20px;
            height: 20px;
            top: -10px;
            left: 8px;
          }
          .cloud::after {
            width: 25px;
            height: 25px;
            top: -12px;
            left: 20px;
          }
          
          .sunset {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #FF6347, #FF4500, #FFD700);
            border-radius: 50%;
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sunset-glow 6s ease-in-out infinite;
            box-shadow: 0 0 25px rgba(255, 99, 71, 0.7);
            z-index: 1;
          }
          .sunset::before {
            content: '';
            position: absolute;
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, transparent, #FF6347, transparent);
            top: 90%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: horizon-glow 6s ease-in-out infinite;
            z-index: 0;
          }
          .sunset::after {
            content: '';
            position: absolute;
            width: 60px;
            height: 25px;
            background: #2F4F4F;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
            clip-path: polygon(0% 100%, 20% 60%, 30% 80%, 50% 40%, 70% 70%, 80% 50%, 100% 100%);
            z-index: 2;
          }
          
          .rain {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .rain::before,
          .rain::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 10px;
            background: #4169E1;
            border-radius: 2px;
            animation: rain-fall 1s linear infinite;
          }
          .rain::before {
            left: 15px;
            animation-delay: 0s;
          }
          .rain::after {
            left: 35px;
            animation-delay: 0.5s;
          }
          
          .sunrise {
            width: 35px;
            height: 35px;
            background: linear-gradient(135deg, #FFD700, #FFA500, #FF69B4);
            border-radius: 50%;
            position: absolute;
            top: 45%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sunrise-rise 8s ease-in-out infinite;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
            z-index: 2;
          }
          .sunrise::before {
            content: '';
            position: absolute;
            width: 55px;
            height: 4px;
            background: linear-gradient(90deg, transparent, #FFD700, transparent);
            top: 130%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: sunrise-rays 8s ease-in-out infinite;
            z-index: 1;
          }
          .sunrise::after {
            content: '';
            position: absolute;
            width: 60px;
            height: 20px;
            background: #1a1a1a;
            top: 150%;
            left: 50%;
            transform: translate(-50%, -50%);
            clip-path: polygon(0% 100%, 15% 70%, 25% 85%, 40% 60%, 55% 80%, 70% 65%, 85% 75%, 100% 100%);
            z-index: 0;
          }
          
          .snow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .snow::before,
          .snow::after {
            content: '❄';
            position: absolute;
            color: #E6E6FA;
            animation: snow-fall 3s linear infinite;
          }
          .snow::before {
            left: 15px;
            top: 10px;
            animation-delay: 0s;
          }
          .snow::after {
            left: 35px;
            top: 5px;
            animation-delay: 1.5s;
          }
          
          .moon {
            width: 35px;
            height: 35px;
            background: #F5F5DC;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px rgba(245, 245, 220, 0.5);
            animation: moon-glow 4s ease-in-out infinite;
          }
          .moon::before {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            background: #D3D3D3;
            border-radius: 50%;
            top: 30%;
            left: 20%;
            opacity: 0.7;
          }
          .moon::after {
            content: '';
            position: absolute;
            width: 5px;
            height: 5px;
            background: #D3D3D3;
            border-radius: 50%;
            top: 60%;
            left: 60%;
            opacity: 0.7;
          }
          
          .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .stars::before,
          .stars::after {
            content: '✦';
            position: absolute;
            color: #F0F8FF;
            animation: twinkle 3s ease-in-out infinite;
          }
          .stars::before {
            top: 15px;
            left: 15px;
            font-size: 8px;
            animation-delay: 0s;
          }
          .stars::after {
            top: 10px;
            left: 45px;
            font-size: 6px;
            animation-delay: 1.5s;
          }
          
          @keyframes rotate {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
          
          @keyframes sun-rays {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
            50% { transform: translate(-50%, -50%) translateY(-5px); }
          }
          
          @keyframes rain-fall {
            0% { top: -10px; opacity: 1; }
            100% { top: 50px; opacity: 0; }
          }
          
          @keyframes sunrise-rise {
            0%, 100% { 
              top: 65%;
              box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
              transform: translate(-50%, -50%) scale(0.8);
            }
            50% { 
              top: 45%;
              box-shadow: 0 0 40px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 165, 0, 0.6);
              transform: translate(-50%, -50%) scale(1);
            }
          }
          
          @keyframes sunrise-rays {
            0%, 100% { opacity: 0.4; width: 45px; }
            50% { opacity: 1; width: 55px; }
          }
          
          @keyframes snow-fall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(50px) rotate(360deg); opacity: 0; }
          }
          
          @keyframes moon-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(245, 245, 220, 0.5); }
            50% { box-shadow: 0 0 30px rgba(245, 245, 220, 0.8); }
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes sunset-glow {
            0%, 100% { 
              box-shadow: 0 0 25px rgba(255, 99, 71, 0.7);
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              box-shadow: 0 0 35px rgba(255, 99, 71, 0.9), 0 0 50px rgba(255, 215, 0, 0.5);
              transform: translate(-50%, -50%) scale(1.05);
            }
          }
          
          @keyframes horizon-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          .cave {
            width: 60px;
            height: 40px;
            background: #1a1a1a;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50% 50% 0 0;
            border: 2px solid #444;
            z-index: 2;
          }
          .cave::before {
            content: '';
            position: absolute;
            width: 45px;
            height: 25px;
            background: #000;
            border-radius: 50% 50% 0 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -40%);
            z-index: 3;
          }
          .cave::after {
            content: '🔥';
            position: absolute;
            top: 70%;
            left: 30%;
            font-size: 8px;
            animation: cave-fire 3s ease-in-out infinite;
            z-index: 4;
          }
          
          .cave-crystals {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .cave-crystals::before {
            content: '💎';
            position: absolute;
            top: 20%;
            left: 70%;
            font-size: 6px;
            color: #4169E1;
            animation: crystal-glow 4s ease-in-out infinite;
            animation-delay: 1s;
          }
          .cave-crystals::after {
            content: '💎';
            position: absolute;
            top: 60%;
            left: 20%;
            font-size: 5px;
            color: #9370DB;
            animation: crystal-glow 4s ease-in-out infinite;
            animation-delay: 2.5s;
          }
          
          @keyframes cave-fire {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          
          @keyframes crystal-glow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.2); }
          }
        `}</style>
        
        {type === 'sunny' && (
          <div className="sun"></div>
        )}
        
        {type === 'sunset' && (
          <div className="sunset"></div>
        )}
        
        {type === 'rainy' && (
          <>
            <div className="cloud" style={{ transform: 'translate(-50%, -60%) scale(0.8)' }}></div>
            <div className="rain"></div>
          </>
        )}
        
        {type === 'sunrise' && (
          <div className="sunrise"></div>
        )}
        
        {type === 'snowy' && (
          <>
            <div className="cloud" style={{ transform: 'translate(-50%, -60%) scale(0.8)', background: '#D3D3D3' }}></div>
            <div className="snow"></div>
          </>
        )}
        
        {type === 'night' && (
          <>
            <div className="moon"></div>
            <div className="stars"></div>
          </>
        )}
        
        {type === 'cave' && (
          <>
            <div className="cave"></div>
            <div className="cave-crystals"></div>
          </>
        )}
      </div>
    );
  };

  // React state - this holds our character data
  const [character, setCharacter] = useState<Character>({
    name: 'Aragorn',
    class: 'Ranger',
    race: 'Human',
    background: 'Folk Hero',
    alignment: 'Chaotic Good',
    level: 5,
    abilityScores: {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 12,
      wisdom: 13,
      charisma: 11
    },
    health: {
      currentHp: 45,
      maxHp: 45,
      tempHp: 0
    },
    proficiencyBonus: 3, // Level 5 = +3 proficiency
    skills: {
      'Athletics': true,
      'Acrobatics': false,
      'Sleight of Hand': false,
      'Stealth': true,
      'Arcana': false,
      'History': false,
      'Investigation': false,
      'Nature': true,
      'Religion': false,
      'Animal Handling': true,
      'Insight': false,
      'Medicine': false,
      'Perception': true,
      'Survival': true,
      'Deception': false,
      'Intimidation': false,
      'Performance': false,
      'Persuasion': false
    },
    savingThrows: {
      strength: true,
      dexterity: true,
      constitution: false,
      intelligence: false,
      wisdom: false,
      charisma: false
    },
    derivedStats: {
      armorClass: 16,
      initiative: 2, // DEX modifier
      speed: 30
    }
  });

  // Helper function to calculate ability modifiers
  const getModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };


  // Helper function to format modifier for display
  const formatModifier = (modifier: number): string => {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  // Skills mapped to their corresponding ability scores
  const skillsMap: { [key: string]: keyof typeof character.abilityScores } = {
    'Athletics': 'strength',
    'Acrobatics': 'dexterity',
    'Sleight of Hand': 'dexterity',
    'Stealth': 'dexterity',
    'Arcana': 'intelligence',
    'History': 'intelligence',
    'Investigation': 'intelligence',
    'Nature': 'intelligence',
    'Religion': 'intelligence',
    'Animal Handling': 'wisdom',
    'Insight': 'wisdom',
    'Medicine': 'wisdom',
    'Perception': 'wisdom',
    'Survival': 'wisdom',
    'Deception': 'charisma',
    'Intimidation': 'charisma',
    'Performance': 'charisma',
    'Persuasion': 'charisma'
  };

  // Helper function to calculate skill modifier
  const getSkillModifier = (skillName: string): number => {
    const abilityScore = skillsMap[skillName];
    const abilityModifier = getModifier(character.abilityScores[abilityScore]);
    const proficiencyBonus = character.skills[skillName] ? character.proficiencyBonus : 0;
    return abilityModifier + proficiencyBonus;
  };

  // Helper function to get saving throw modifier
  const getSaveModifier = (ability: keyof typeof character.abilityScores): number => {
    const abilityModifier = getModifier(character.abilityScores[ability]);
    const proficiencyBonus = character.savingThrows[ability] ? character.proficiencyBonus : 0;
    return abilityModifier + proficiencyBonus;
  };

  return (
    <div 
      className={`min-h-screen p-6 transition-colors duration-300 overflow-x-auto ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">
            D&D 5e Character Sheet
          </h1>
          <p className="text-gray-300">Digital character management</p>
        </header>
        
        {/* Tab System */}
        <div className="mb-6 flex gap-2 flex-wrap justify-center">
          {[
            { id: 'stats', icon: '❤️', label: 'Stats' },
            { id: 'inventory', icon: '🎒', label: 'Inventory' },
            { id: 'character', icon: '🧝🏻‍♀️', label: 'Character' },
            { id: 'spellcasting', icon: '✨', label: 'Spells' },
            { id: 'master', icon: '📜', label: 'Library' },
            { id: 'data', icon: '⚙️', label: 'Data' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold border transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent shadow-lg'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
        <div>
        {/* Character Information Box - Above All Columns */}
        <div className={`rounded-lg p-3 mb-4 shadow-xl border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500 w-[1000px] ${
          isDarkMode
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
            : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
        }`}>

          <div className="grid grid-cols-2 gap-4 items-center" style={{ gridTemplateColumns: '480px 480px' }}>
            {/* Left Column - Level and Portrait/Name */}
            <div className="flex items-center gap-4">
              {/* Large Level Box - Far Left */}
              <div className={`rounded-2xl p-2 shadow-xl text-center flex-shrink-0 ${
                isDarkMode
                  ? 'bg-gradient-to-b from-gray-700 to-gray-800 border border-amber-500'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300'
              }`}>
                <select
                  value={character.level}
                  onChange={(e) => {
                    const newLevel = parseInt(e.target.value);
                    const newProficiencyBonus = Math.ceil(newLevel / 4) + 1; // D&D 5e proficiency bonus formula
                    setCharacter({
                      ...character, 
                      level: newLevel,
                      proficiencyBonus: newProficiencyBonus
                    });
                  }}
                  className="w-full bg-transparent text-3xl font-bold text-amber-400 mb-1 text-center border-none outline-none cursor-pointer"
                  style={{ appearance: 'none' }}
                >
                  {Array.from({length: 20}, (_, i) => i + 1).map(level => (
                    <option key={level} value={level} className="bg-gray-800 text-amber-400">
                      {level}
                    </option>
                  ))}
                </select>
                <div className="text-xs font-medium text-gray-300">Level</div>
              </div>

              {/* Portrait */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-xl overflow-hidden shadow-xl border-2 flex items-center justify-center ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-200 border-gray-300'
                }`}>
                  {character.portrait ? (
                    <img
                      src={character.portrait}
                      alt="Character Portrait"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-xl">🎭</div>
                    </div>
                  )}
                </div>
                
                {/* Race, Class, Alignment under portrait */}
                <div className="text-center mt-2">
                  <div className="text-xs text-white">
                    <select
                      value={character.race}
                      onChange={(e) => {
                        const newCharacter = {...character, race: e.target.value};
                        const withRaceEffects = applyRaceEffects(newCharacter);
                        setCharacter(withRaceEffects);
                      }}
                      className="bg-transparent text-xs font-bold border-none outline-none cursor-pointer text-white appearance-none mx-1"
                    >
                      <option value="Human" className="bg-gray-800 text-white">Human</option>
                      <option value="Elf" className="bg-gray-800 text-white">Elf</option>
                      <option value="Dwarf" className="bg-gray-800 text-white">Dwarf</option>
                      <option value="Halfling" className="bg-gray-800 text-white">Halfling</option>
                      <option value="Dragonborn" className="bg-gray-800 text-white">Dragonborn</option>
                      <option value="Gnome" className="bg-gray-800 text-white">Gnome</option>
                      <option value="Half-Elf" className="bg-gray-800 text-white">Half-Elf</option>
                      <option value="Half-Orc" className="bg-gray-800 text-white">Half-Orc</option>
                      <option value="Tiefling" className="bg-gray-800 text-white">Tiefling</option>
                    </select>
                    
                    <select
                      value={character.class}
                      onChange={(e) => {
                        const newCharacter = {...character, class: e.target.value};
                        const withClassEffects = applyClassEffects(newCharacter);
                        setCharacter(withClassEffects);
                      }}
                      className="bg-transparent text-xs font-bold border-none outline-none cursor-pointer text-white appearance-none mx-1"
                    >
                      <option value="Barbarian" className="bg-gray-800 text-white">Barbarian</option>
                      <option value="Bard" className="bg-gray-800 text-white">Bard</option>
                      <option value="Cleric" className="bg-gray-800 text-white">Cleric</option>
                      <option value="Druid" className="bg-gray-800 text-white">Druid</option>
                      <option value="Fighter" className="bg-gray-800 text-white">Fighter</option>
                      <option value="Monk" className="bg-gray-800 text-white">Monk</option>
                      <option value="Paladin" className="bg-gray-800 text-white">Paladin</option>
                      <option value="Ranger" className="bg-gray-800 text-white">Ranger</option>
                      <option value="Rogue" className="bg-gray-800 text-white">Rogue</option>
                      <option value="Sorcerer" className="bg-gray-800 text-white">Sorcerer</option>
                      <option value="Warlock" className="bg-gray-800 text-white">Warlock</option>
                      <option value="Wizard" className="bg-gray-800 text-white">Wizard</option>
                    </select>
                    
                    <select
                      value={character.alignment}
                      onChange={(e) => setCharacter({...character, alignment: e.target.value})}
                      className="bg-transparent text-xs font-bold border-none outline-none cursor-pointer text-white appearance-none mx-1"
                    >
                      <option value="Lawful Good">Lawful Good</option>
                      <option value="Neutral Good">Neutral Good</option>
                      <option value="Chaotic Good">Chaotic Good</option>
                      <option value="Lawful Neutral">Lawful Neutral</option>
                      <option value="True Neutral">True Neutral</option>
                      <option value="Chaotic Neutral">Chaotic Neutral</option>
                      <option value="Lawful Evil">Lawful Evil</option>
                      <option value="Neutral Evil">Neutral Evil</option>
                      <option value="Chaotic Evil">Chaotic Evil</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Hero Name - Next to Portrait */}
              <div>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => setCharacter({...character, name: e.target.value})}
                  className="bg-transparent font-bold border-none outline-none text-white placeholder-gray-400"
                  style={{
                    fontFamily: 'Kaushan Script, cursive',
                    textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0px 0px 15px rgba(255,255,255,0.2)',
                    letterSpacing: '1px',
                    fontSize: '2rem'
                  }}
                  placeholder="Enter hero name"
                />
              </div>
            </div>

            {/* Right Column - Ability Scores */}
            <div className="grid grid-cols-6 gap-2">
              {/* Strength */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-red-500 hover:border-red-400 transition-all duration-300 hover:shadow-lg hover:shadow-red-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-red-400 mb-1">STR</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.strength}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        strength: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.strength))}
                  </div>
                </div>
              </div>

              {/* Dexterity */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-green-500 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-green-400 mb-1">DEX</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.dexterity}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        dexterity: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.dexterity))}
                  </div>
                </div>
              </div>

              {/* Constitution */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-orange-500 hover:border-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-orange-400 mb-1">CON</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.constitution}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        constitution: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.constitution))}
                  </div>
                </div>
              </div>

              {/* Intelligence */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-blue-500 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-blue-400 mb-1">INT</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.intelligence}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        intelligence: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.intelligence))}
                  </div>
                </div>
              </div>

              {/* Wisdom */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-purple-500 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-purple-400 mb-1">WIS</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.wisdom}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        wisdom: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.wisdom))}
                  </div>
                </div>
              </div>

              {/* Charisma */}
              <div className="text-center">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg p-2 border border-pink-500 hover:border-pink-400 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500 hover:scale-105 cursor-pointer">
                  <h3 className="text-xs font-bold text-pink-400 mb-1">CHA</h3>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={character.abilityScores.charisma}
                    onChange={(e) => setCharacter({
                      ...character,
                      abilityScores: {
                        ...character.abilityScores,
                        charisma: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-sm font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-900 border-gray-600 text-white hover:bg-gray-800'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="mt-1 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:scale-110">
                    {formatModifier(getModifier(character.abilityScores.charisma))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Character Sheet Layout - 4 Column Layout */}
        <div className="grid grid-cols-4 gap-4 mb-4 min-w-[1000px]" style={{ gridTemplateColumns: '240px 240px 240px 240px' }}>
          
          {/* LEFT COLUMN - Saving Throws & Passive Skills */}
          <div className="space-y-4">
            {/* Saving Throws Card */}
            <div className={`rounded-lg p-3 shadow-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {Object.entries(character.savingThrows).map(([ability, isProficient]) => (
                  <div 
                    key={ability} 
                    className={`flex items-center justify-between px-2 py-1 rounded-full border transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isProficient}
                        onChange={(e) => setCharacter({
                          ...character,
                          savingThrows: {
                            ...character.savingThrows,
                            [ability]: e.target.checked
                          }
                        })}
                        className="w-2 h-2 text-amber-400 bg-gray-600 border-gray-500 rounded focus:ring-amber-400 focus:ring-1"
                      />
                      <span className="text-xs font-bold uppercase">
                        {ability.slice(0, 3)}
                      </span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatModifier(getSaveModifier(ability as keyof typeof character.abilityScores))}
                    </span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                SAVING THROWS
              </h3>
            </div>

            {/* Passive Skills Card */}
            <div className={`rounded-lg p-3 shadow-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              <div className="grid grid-cols-1 gap-2 mb-3">
                <div className={`flex items-center justify-between px-2 py-1 rounded-full border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-900'
                }`}>
                  <span className="text-xs text-gray-400">👁️ Passive Perception</span>
                  <span className="text-sm font-bold">
                    {10 + getSkillModifier('Perception')}
                  </span>
                </div>
                <div className={`flex items-center justify-between px-2 py-1 rounded-full border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-900'
                }`}>
                  <span className="text-xs text-gray-400">🔍 Passive Investigation</span>
                  <span className="text-sm font-bold">
                    {10 + getSkillModifier('Investigation')}
                  </span>
                </div>
                <div className={`flex items-center justify-between px-2 py-1 rounded-full border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-900'
                }`}>
                  <span className="text-xs text-gray-400">🧠 Passive Insight</span>
                  <span className="text-sm font-bold">
                    {10 + getSkillModifier('Insight')}
                  </span>
                </div>
              </div>
              
              <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                SKILLS
              </h3>
            </div>

            {/* Resistance and Death Saves Container */}
            <div className={`rounded-lg p-3 shadow-lg border mt-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              <div className="grid grid-cols-2 gap-3">
                {/* Resistance - 1/2 space */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    Resistance
                  </label>
                  <textarea
                    value={resistances}
                    onChange={(e) => setResistances(e.target.value)}
                    rows={2}
                    className={`w-full text-center text-sm font-bold border rounded-lg py-2 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 resize-none ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-500 text-white hover:bg-gray-600 placeholder-gray-400'
                        : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-white placeholder-gray-500'
                    }`}
                    placeholder="Fire, Cold..."
                  />
                </div>
                
                {/* Death Saves - 1/2 space */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 text-center">
                    Death Saves
                  </label>
                  <div className={`border rounded-lg p-2 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    {/* Failures Row */}
                    <div className="flex items-center justify-center mb-1">
                      <span className="text-sm mr-1">☠️</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={`fail-${i}`}
                            className={`w-4 h-4 border rounded cursor-pointer transition-all duration-200 hover:scale-110 ${
                              deathSaves.failures >= i
                                ? 'bg-red-800 border-red-700'
                                : isDarkMode
                                  ? 'bg-gray-600 border-gray-400 hover:bg-red-900'
                                  : 'bg-gray-200 border-gray-400 hover:bg-red-300'
                            }`}
                            onClick={() => setDeathSaves(prev => ({
                              ...prev,
                              failures: prev.failures === i ? i - 1 : i
                            }))}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Successes Row */}
                    <div className="flex items-center justify-center">
                      <span className="text-sm mr-1">❤️</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={`success-${i}`}
                            className={`w-4 h-4 border rounded cursor-pointer transition-all duration-200 hover:scale-110 ${
                              deathSaves.successes >= i
                                ? 'bg-green-800 border-green-700'
                                : isDarkMode
                                  ? 'bg-gray-600 border-gray-400 hover:bg-green-900'
                                  : 'bg-gray-200 border-gray-400 hover:bg-green-300'
                            }`}
                            onClick={() => setDeathSaves(prev => ({
                              ...prev,
                              successes: prev.successes === i ? i - 1 : i
                            }))}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weapons & Attacks */}
            <div className={`rounded-lg p-3 shadow-lg border mt-4 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`} style={{ width: '488px' }}>
              
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-1 text-xs font-bold text-gray-500 mb-2 px-1">
                <div className="col-span-2">Weapon</div>
                <div className="text-center">Prof</div>
                <div className="text-center">Bonus</div>
                <div className="text-center">Notch</div>
                <div className="text-center">Range</div>
                <div className="text-center">Ability</div>
                <div>Damage</div>
              </div>
              
              {/* Weapon Rows */}
              {[1, 2, 3, 4].map((weaponIndex) => (
                <div key={weaponIndex} className="grid grid-cols-8 gap-1 items-center mb-2">
                  {/* Weapon Name */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Weapon name"
                      className={`w-full text-xs border rounded px-2 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  
                  {/* Proficient */}
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3 text-amber-400 bg-gray-600 border-gray-500 rounded focus:ring-amber-400 focus:ring-1"
                    />
                  </div>
                  
                  {/* Item Bonus */}
                  <div>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  
                  {/* Notches */}
                  <div>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  
                  {/* Range */}
                  <div>
                    <input
                      type="text"
                      placeholder="5ft"
                      className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                  
                  {/* Ability Mod */}
                  <div>
                    <select
                      className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="str">STR</option>
                      <option value="dex">DEX</option>
                      <option value="con">CON</option>
                      <option value="int">INT</option>
                      <option value="wis">WIS</option>
                      <option value="cha">CHA</option>
                    </select>
                  </div>
                  
                  {/* Damage */}
                  <div>
                    <input
                      type="text"
                      placeholder="1d8+3"
                      className={`w-full text-xs border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
              
              <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-2">
                WEAPONS & ATTACKS
              </h3>
            </div>

          </div>

          {/* CENTER COLUMN - Combat Stats & Health */}
          <div className="space-y-4">
            {/* Combat Stats Box */}
            <div className={`rounded-lg p-3 shadow-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              <div className="grid grid-cols-3 gap-2">
                {/* AC */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    AC
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={character.derivedStats.armorClass}
                    onChange={(e) => setCharacter({
                      ...character,
                      derivedStats: {
                        ...character.derivedStats,
                        armorClass: parseInt(e.target.value) || 10
                      }
                    })}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>

                {/* Initiative */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Initiative
                  </label>
                  <div className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 text-green-400 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-600'
                      : 'bg-white border-gray-300'
                  }`}>
                    {formatModifier(getModifier(character.abilityScores.dexterity))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">DEX</div>
                </div>

                {/* Speed */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Speed
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={character.derivedStats.speed}
                    onChange={(e) => setCharacter({
                      ...character,
                      derivedStats: {
                        ...character.derivedStats,
                        speed: parseInt(e.target.value) || 30
                      }
                    })}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                  <div className="text-xs text-gray-400 mt-1">feet</div>
                </div>
              </div>
              
              <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                COMBAT STATS
              </h3>
            </div>

            {/* Health Box */}
            <div className={`rounded-lg p-3 shadow-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              {/* HP Bar Visual */}
              <div className="mb-3">
                <div className="w-full bg-gray-700 rounded-full h-6 relative overflow-hidden shadow-lg">
                  {/* Base HP Bar with Dynamic Color and Glow */}
                  <div 
                    className={`h-6 transition-all duration-500 ${
                      ((character.health.currentHp + character.health.tempHp) / character.health.maxHp) >= 0.76 
                        ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-green-500 animate-pulse' 
                        : ((character.health.currentHp + character.health.tempHp) / character.health.maxHp) >= 0.51 
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 shadow-yellow-500'
                          : 'bg-gradient-to-r from-red-500 to-red-400 shadow-red-500'
                    } shadow-lg hover:shadow-xl`}
                    style={{
                      width: `${Math.min(((character.health.currentHp + character.health.tempHp) / character.health.maxHp) * 100, 100)}%`,
                      filter: 'drop-shadow(0 0 8px currentColor)'
                    }}
                  ></div>
                  {/* Temp HP Bar */}
                  {character.health.tempHp > 0 && (
                    <div 
                      className="bg-blue-500 h-6 absolute top-0 transition-all duration-300 shadow-blue-500"
                      style={{
                        left: `${Math.min((character.health.currentHp / character.health.maxHp) * 100, 100)}%`,
                        width: `${Math.min((character.health.tempHp / character.health.maxHp) * 100, 100 - (character.health.currentHp / character.health.maxHp) * 100)}%`,
                        filter: 'drop-shadow(0 0 8px currentColor)'
                      }}
                    ></div>
                  )}
                  {/* Centered Percentage Text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg">
                      {Math.round(((character.health.currentHp + character.health.tempHp) / character.health.maxHp) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* HP Values in a Row */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {/* Current HP */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    HP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={character.health.currentHp}
                    onChange={(e) => setCharacter({
                      ...character,
                      health: {
                        ...character.health,
                        currentHp: parseInt(e.target.value) || 0
                      }
                    })}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>

                {/* Max HP */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Max HP
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={character.health.maxHp}
                    onChange={(e) => setCharacter({
                      ...character,
                      health: {
                        ...character.health,
                        maxHp: parseInt(e.target.value) || 1
                      }
                    })}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>

                {/* Temp HP */}
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Temp HP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={character.health.tempHp}
                    onChange={(e) => setCharacter({
                      ...character,
                      health: {
                        ...character.health,
                        tempHp: parseInt(e.target.value) || 0
                      }
                    })}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 text-blue-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    }`}
                  />
                </div>
              </div>
              
              {/* Hit Dice Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Hit Dice
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hitDice.current}
                    onChange={(e) => setHitDice(prev => ({ ...prev, current: parseInt(e.target.value) || 0 }))}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>
                
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Max&nbsp;Dice
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hitDice.max}
                    onChange={(e) => setHitDice(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>
                
                <div className="text-center">
                  <label className="block text-sm font-bold text-gray-300 mb-1">
                    Reduction
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hitDice.reduction}
                    onChange={(e) => setHitDice(prev => ({ ...prev, reduction: parseInt(e.target.value) || 0 }))}
                    className={`w-full text-center text-2xl font-bold border rounded-lg py-3 px-3 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-200 hover:shadow-lg hover:shadow-red-500 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                    }`}
                  />
                </div>
              </div>
              
              <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                HEALTH
              </h3>
            </div>
          </div>

          {/* RIGHT COLUMN - Skills */}
          <div className={`rounded-lg p-3 shadow-xl border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-amber-500 hover:shadow-2xl ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
          }`}>
            <div className="space-y-0">
              {Object.entries(character.skills).map(([skillName, isProficient]) => {
                const abilityScore = skillsMap[skillName];
                const modifier = getSkillModifier(skillName);
                
                return (
                  <div key={skillName} className={`flex items-center justify-between py-1 px-2 transition-all duration-200 rounded hover:shadow-md hover:scale-105 cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600'
                      : 'hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isProficient}
                        onChange={(e) => setCharacter({
                          ...character,
                          skills: {
                            ...character.skills,
                            [skillName]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-amber-400 bg-gray-600 border-gray-500 rounded focus:ring-amber-400 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-white">
                        {skillName}
                      </span>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-base font-semibold text-white min-w-[2rem] text-right">
                        {formatModifier(modifier)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FOURTH COLUMN - Calendar & Survival */}
          <div className="space-y-4">
            {/* Fantasy Calendar Widget */}
            <div className={`rounded-lg p-3 shadow-xl border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-amber-500 hover:shadow-2xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
                : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
            }`}>
              {/* Top Row: Weather Icon - Very Top */}
              <div className="flex justify-center mb-2">
                <div style={{ transform: 'scale(0.7)' }}>
                  <WeatherIcon type={weather} />
                </div>
              </div>
              
              {/* Second Row: Day and Month - Constrained Width */}
              <div className="grid grid-cols-3 gap-2 mb-1 items-center">
                <select
                  value={fantasyDate.day}
                  onChange={(e) => updateFantasyDay(parseInt(e.target.value))}
                  className={`text-center text-xs font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 cursor-pointer appearance-none hover:bg-opacity-80 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                  style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {Array.from({ length: getCurrentMonth().days }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day} className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                      {day}{getOrdinalSuffix(day)}
                    </option>
                  ))}
                </select>
                
                <select
                  value={fantasyDate.monthIndex}
                  onChange={(e) => updateFantasyMonth(parseInt(e.target.value))}
                  className={`col-span-2 text-center text-xs font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 cursor-pointer appearance-none hover:bg-opacity-80 transition-all duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                  }`}
                  style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                >
                  {getAllMonths().map((month, index) => (
                    <option key={index} value={index} className={isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Bottom Row: Year and Era */}
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  min="1"
                  value={fantasyDate.year}
                  onChange={(e) => setFantasyDate(prev => ({ ...prev, year: parseInt(e.target.value) || 1 }))}
                  className={`text-center text-xs font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
                
                <input
                  type="text"
                  value={fantasyDate.era}
                  onChange={(e) => setFantasyDate(prev => ({ ...prev, era: e.target.value }))}
                  className={`col-span-2 text-center text-xs font-bold border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Year-of-the-Ivory"
                />
              </div>
              
              {/* Title bar - moved to bottom */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-400">
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 flex-1">
                  DATE
                </h3>
              </div>
            </div>

            {/* Survival Conditions */}
            <div className={`rounded-lg p-3 shadow-xl border-2 hover:border-amber-500 transition-all duration-300 hover:shadow-amber-500 hover:shadow-2xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
                : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
            }`}>
              {/* Header Row */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-500 mb-2 px-1">
                <div>Need</div>
                <div className="text-center">Stage</div>
                <div className="text-center">Effect</div>
              </div>
              
              {/* Hunger Row */}
              <div className="grid grid-cols-3 gap-2 items-center mb-2">
                <div className="flex items-center">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hunger</span>
                </div>
                <div>
                  <select 
                    value={survivalConditions.hunger.stage}
                    onChange={(e) => setSurvivalConditions({
                      ...survivalConditions,
                      hunger: { stage: e.target.value, effect: getSurvivalEffect(e.target.value, 'hunger') }
                    })}
                    className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${getSurvivalColor(survivalConditions.hunger.stage, 'hunger')} text-white font-bold ${
                      isDarkMode
                        ? 'border-gray-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="Stuffed" className="bg-gray-800 text-white">Stuffed</option>
                    <option value="Well-fed" className="bg-gray-800 text-white">Well-fed</option>
                    <option value="Ok" className="bg-gray-800 text-white">Ok</option>
                    <option value="Peckish" className="bg-gray-800 text-white">Peckish</option>
                    <option value="Hungry" className="bg-gray-800 text-white">Hungry</option>
                    <option value="Ravenous" className="bg-gray-800 text-white">Ravenous</option>
                    <option value="Starving" className="bg-gray-800 text-white">Starving</option>
                  </select>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    getSurvivalEffect(survivalConditions.hunger.stage, 'hunger') > 0 
                      ? 'text-green-400' 
                      : getSurvivalEffect(survivalConditions.hunger.stage, 'hunger') < 0 
                        ? 'text-red-400' 
                        : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getSurvivalEffect(survivalConditions.hunger.stage, 'hunger') > 0 ? '+' : ''}{getSurvivalEffect(survivalConditions.hunger.stage, 'hunger')}
                  </span>
                </div>
              </div>

              {/* Thirst Row */}
              <div className="grid grid-cols-3 gap-2 items-center mb-2">
                <div className="flex items-center">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thirst</span>
                </div>
                <div>
                  <select 
                    value={survivalConditions.thirst.stage}
                    onChange={(e) => setSurvivalConditions({
                      ...survivalConditions,
                      thirst: { stage: e.target.value, effect: getSurvivalEffect(e.target.value, 'thirst') }
                    })}
                    className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${getSurvivalColor(survivalConditions.thirst.stage, 'thirst')} text-white font-bold ${
                      isDarkMode
                        ? 'border-gray-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="Quenched" className="bg-gray-800 text-white">Quenched</option>
                    <option value="Refreshed" className="bg-gray-800 text-white">Refreshed</option>
                    <option value="Ok" className="bg-gray-800 text-white">Ok</option>
                    <option value="Parched" className="bg-gray-800 text-white">Parched</option>
                    <option value="Thirsty" className="bg-gray-800 text-white">Thirsty</option>
                    <option value="Dry" className="bg-gray-800 text-white">Dry</option>
                    <option value="Dehydrated" className="bg-gray-800 text-white">Dehydrated</option>
                  </select>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    getSurvivalEffect(survivalConditions.thirst.stage, 'thirst') > 0 
                      ? 'text-green-400' 
                      : getSurvivalEffect(survivalConditions.thirst.stage, 'thirst') < 0 
                        ? 'text-red-400' 
                        : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getSurvivalEffect(survivalConditions.thirst.stage, 'thirst') > 0 ? '+' : ''}{getSurvivalEffect(survivalConditions.thirst.stage, 'thirst')}
                  </span>
                </div>
              </div>

              {/* Fatigue Row */}
              <div className="grid grid-cols-3 gap-2 items-center mb-2">
                <div className="flex items-center">
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fatigue</span>
                </div>
                <div>
                  <select 
                    value={survivalConditions.fatigue.stage}
                    onChange={(e) => setSurvivalConditions({
                      ...survivalConditions,
                      fatigue: { stage: e.target.value, effect: getSurvivalEffect(e.target.value, 'fatigue') }
                    })}
                    className={`w-full text-xs text-center border rounded px-1 py-1 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 ${getSurvivalColor(survivalConditions.fatigue.stage, 'fatigue')} text-white font-bold ${
                      isDarkMode
                        ? 'border-gray-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="Energized" className="bg-gray-800 text-white">Energized</option>
                    <option value="Well-rested" className="bg-gray-800 text-white">Well-rested</option>
                    <option value="Ok" className="bg-gray-800 text-white">Ok</option>
                    <option value="Tired" className="bg-gray-800 text-white">Tired</option>
                    <option value="Sleepy" className="bg-gray-800 text-white">Sleepy</option>
                    <option value="Very sleepy" className="bg-gray-800 text-white">Very sleepy</option>
                    <option value="Barely awake" className="bg-gray-800 text-white">Barely awake</option>
                  </select>
                </div>
                <div className="text-center">
                  <span className={`text-sm font-bold px-2 py-1 rounded ${
                    getSurvivalEffect(survivalConditions.fatigue.stage, 'fatigue') > 0 
                      ? 'text-green-400' 
                      : getSurvivalEffect(survivalConditions.fatigue.stage, 'fatigue') < 0 
                        ? 'text-red-400' 
                        : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getSurvivalEffect(survivalConditions.fatigue.stage, 'fatigue') > 0 ? '+' : ''}{getSurvivalEffect(survivalConditions.fatigue.stage, 'fatigue')}
                  </span>
                </div>
              </div>

              {/* Exhaustion Tracking */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Addt'l Exhaustion
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={additionalExhaustion}
                    onChange={(e) => setAdditionalExhaustion(parseInt(e.target.value) || 0)}
                    className={`w-16 text-center border rounded px-2 py-1 text-sm ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                    Total Exhaustion
                  </span>
                  <span className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getSurvivalEffect(survivalConditions.hunger.stage, 'hunger') + getSurvivalEffect(survivalConditions.thirst.stage, 'thirst') + getSurvivalEffect(survivalConditions.fatigue.stage, 'fatigue') + additionalExhaustion}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>


        </div>
        )}

        {/* Other Tab Content Placeholders */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            {/* Top Row - 5 Column Layout */}
            <div className="grid grid-cols-5 gap-2 max-w-5xl mx-auto" style={{ gridTemplateColumns: '1.2fr 1.15fr 1fr 1fr 1fr' }}>
              
              {/* Column 1 - ENCUMBRANCE */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">
                      Open Slots
                    </label>
                    <div className={`w-full text-center text-xl font-bold border rounded-lg py-2 px-2 text-green-400 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {calculateOpenSlots().toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">
                      Max Slots
                    </label>
                    <div className={`w-full text-center text-xl font-bold border rounded-lg py-2 px-2 text-green-400 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {calculateMaxSlots()}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-1">
                      Your Bulk
                    </label>
                    <div className={`w-full text-center text-xl font-bold border rounded-lg py-2 px-2 text-green-400 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {calculateYourBulk().toFixed(1)}
                    </div>
                  </div>
                </div>
                
                {/* Encumbrance Gauge */}
                <div className="flex justify-center mb-3">
                  <div className="relative w-40 h-20">
                    <svg width="160" height="80" viewBox="0 0 160 80" className="absolute inset-0">
                      
                      {/* Green section (0-75%) */}
                      <path
                        d="M 20 70 A 60 60 0 0 1 110 30"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      
                      {/* Yellow section (75-90%) */}
                      <path
                        d="M 110 30 A 60 60 0 0 1 130 50"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      
                      {/* Red section (90-100%) */}
                      <path
                        d="M 130 50 A 60 60 0 0 1 140 70"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="9"
                        strokeLinecap="round"
                      />
                      
                      {/* Arrow from center */}
                      <g transform={`rotate(${isEncumbered ? 135 : 45} 80 70)`}>
                        <polygon
                          points="80,70 75,24 80,17 85,24"
                          fill="#9ca3af"
                          stroke="#6b7280"
                          strokeWidth="2"
                        />
                        <circle
                          cx="80"
                          cy="70"
                          r="4"
                          fill="#9ca3af"
                          stroke="#6b7280"
                          strokeWidth="1"
                        />
                      </g>
                    </svg>
                  </div>
                </div>

                <div className="text-center mb-2">
                  <div className="text-xs text-gray-400 mb-1">Status</div>
                  <button
                    onClick={() => setIsEncumbered(!isEncumbered)}
                    className={`text-sm font-bold px-3 py-1 rounded transition-colors ${
                      isEncumbered
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-green-400 hover:text-green-300'
                    }`}
                  >
                    {isEncumbered ? 'Encumbered!' : 'Unencumbered'}
                  </button>
                </div>
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                  ENCUMBRANCE
                </h3>
              </div>

              {/* Column 2 - PURSE */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-5 gap-1" style={{ gridTemplateColumns: '3fr 1fr 0.6fr' }}>
                  {/* Left 3 columns for coins */}
                  <div className="col-span-3">
                    <div className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 mb-2">
                      <div></div>
                      <div className="text-center">Amount</div>
                      <div className="text-center">(SP)</div>
                    </div>
                    {[
                      { type: 'Iron', abbrev: 'IR', key: 'iron' as const, value: 0.01 },
                      { type: 'Copper', abbrev: 'CP', key: 'copper' as const, value: 0.1 },
                      { type: 'Silver', abbrev: 'SP', key: 'silver' as const, value: 1 },
                      { type: 'Gold', abbrev: 'GP', key: 'gold' as const, value: 10 },
                      { type: 'Platinum', abbrev: 'PP', key: 'platinum' as const, value: 100 }
                    ].map((coin, index) => (
                      <div key={coin.type} className="grid grid-cols-3 gap-0 items-center mb-1">
                        <div className="flex items-center">
                          <div className={`text-xs font-bold px-2 py-1 rounded-full border border-gray-400 ${
                            isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
                          }`}>
                            {coin.abbrev}
                          </div>
                        </div>
                        <input 
                          type="number" 
                          className={`text-center text-xs border-l-0 rounded-r px-2 py-1 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                          }`} 
                          value={coinAmounts[coin.key]} 
                          onChange={(e) => setCoinAmounts({
                            ...coinAmounts,
                            [coin.key]: parseInt(e.target.value) || 0
                          })}
                          style={{ marginLeft: '-1px' }} 
                        />
                        <div className="text-xs text-center text-gray-400 ml-1">{coin.value}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 4th column - Total Value */}
                  <div className="text-center">
                    <label className="block text-sm font-bold text-gray-300 mb-1">
                      Total Value
                    </label>
                    <div className={`w-full text-center text-xl font-bold border rounded-lg py-2 px-2 text-green-400 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {calculateTotalValue().toFixed(2)} SP
                    </div>
                  </div>

                  {/* 5th column - Total Bulk (50% less wide) */}
                  <div className="text-center">
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Total Bulk
                    </label>
                    <div className={`w-full text-center text-lg font-bold border rounded-lg py-1 px-1 text-green-400 ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-white border-gray-300'
                    }`}>
                      {calculatePurseBulk().toFixed(1)}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                  PURSE
                </h3>
              </div>

              {/* Column 3 - RATION BOX & WATERSKIN */}
              <div className="space-y-3">
                <div className={`rounded-lg p-3 shadow-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Boxes Qty</div>
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} value={rationBox.boxesQty} onChange={(e) => setRationBox(prev => ({...prev, boxesQty: parseInt(e.target.value) || 0}))} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Rations Qty</div>
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} value={rationBox.rationsQty} onChange={(e) => setRationBox(prev => ({...prev, rationsQty: parseInt(e.target.value) || 0}))} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Total Bulk</div>
                      <div className="text-xs text-center">{calculateRationBoxBulk().toFixed(1)}</div>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                    RATION BOX
                  </h3>
                </div>

                <div className={`rounded-lg p-3 shadow-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <div className="grid grid-cols-3 gap-1 text-xs mb-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Skins Qty</div>
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} value={waterskin.skinsQty} onChange={(e) => setWaterskin(prev => ({...prev, skinsQty: parseInt(e.target.value) || 0}))} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Rations Qty</div>
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} value={waterskin.rationsQty} onChange={(e) => setWaterskin(prev => ({...prev, rationsQty: parseInt(e.target.value) || 0}))} />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400 mb-1">Total Bulk</div>
                      <div className="text-xs text-center">{calculateWaterskinBulk().toFixed(1)}</div>
                    </div>
                  </div>
                  <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600">
                    WATERSKIN
                  </h3>
                </div>
              </div>

              {/* Column 4 - MAGICAL CONTAINERS */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 mb-2">
                  <div>Type</div>
                  <div className="text-center"># Owned</div>
                  <div className="text-center">Slots Granted</div>
                </div>
                {magicalContainers.map((container, index) => (
                  <div key={container.type} className="grid grid-cols-3 gap-1 items-center mb-1">
                    <div className="text-xs">{container.type}</div>
                    <input 
                      type="number" 
                      className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} 
                      value={container.owned}
                      onChange={(e) => {
                        const newOwned = parseInt(e.target.value) || 0;
                        setMagicalContainers(prev => prev.map((prevContainer, i) => 
                          i === index ? {...prevContainer, owned: newOwned} : prevContainer
                        ));
                      }}
                    />
                    <div className="text-xs text-center text-gray-400">{container.slotsGranted}</div>
                  </div>
                ))}
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                  MAGICAL CONTAINERS
                </h3>
              </div>

              {/* Column 5 - PURCHASE CALCULATOR */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 mb-2">
                  <div>Coin Type</div>
                  <div className="text-center">Purchase Amount</div>
                  <div className="text-center">Amount After</div>
                </div>
                {['Iron', 'Copper', 'Silver', 'Gold', 'Platinum'].map((coin) => (
                  <div key={coin} className="grid grid-cols-3 gap-1 items-center mb-1">
                    <div className="text-xs">{coin}</div>
                    <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} defaultValue="0" />
                    <div className="text-xs text-center">0</div>
                  </div>
                ))}
                <button className={`w-full mt-2 px-3 py-1 text-xs font-bold rounded transition-colors ${
                  isDarkMode 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}>
                  Calculate
                </button>
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                  PURCHASE CALCULATOR
                </h3>
              </div>
            </div>

            {/* Bottom Row - 3 Column Layout */}
            <div className="grid grid-cols-3 gap-6" style={{ gridTemplateColumns: '1fr 1fr 0.7fr' }}>
              
              {/* Left Column - Equipped Items & Attuned Items */}
              <div className="space-y-4">
                {/* Equipped Items */}
                <div className={`rounded-lg p-4 shadow-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <div className="grid grid-cols-8 gap-1 text-xs font-bold text-gray-500 mb-2" style={{ gridTemplateColumns: '1.2fr 1.8fr 0.6fr 1fr 0.6fr 0.6fr 0.6fr 0.8fr' }}>
                    <div>Type</div>
                    <div>Item</div>
                    <div className="text-center">Bonus</div>
                    <div>Range</div>
                    <div className="text-center">Notches</div>
                    <div className="text-center">Value</div>
                    <div className="text-center">Bulk</div>
                    <div className="text-center">Req Att?</div>
                  </div>
                  {equippedItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-8 gap-1 items-center mb-1" style={{ gridTemplateColumns: '1.2fr 1.8fr 0.6fr 1fr 0.6fr 0.6fr 0.6fr 0.8fr' }}>
                      <div className="relative">
                        <button
                          onClick={() => setEquippedItemsDropdowns(prev => ({
                            ...prev,
                            [index]: !prev[index]
                          }))}
                          className={`w-full text-xs border rounded px-1 py-1 text-center flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          {item.type}
                        </button>
                        {equippedItemsDropdowns[index] && (
                          <div className={`absolute top-full left-0 right-0 z-10 border rounded mt-1 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          } shadow-lg`}>
                            {['Weapon', 'Armor', 'Ammunition', 'Shield', 'Accessory'].map(type => (
                              <button
                                key={type}
                                onClick={() => {
                                  setEquippedItemsDropdowns(prev => ({ ...prev, [index]: false }));
                                }}
                                className={`w-full text-left px-2 py-1 text-xs hover:${
                                  isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                                } transition-colors`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} defaultValue={item.item} />
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} defaultValue={item.bonus} />
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} defaultValue={item.range} />
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} defaultValue={item.notches} />
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} defaultValue={item.value} />
                      <input 
                        type="number" 
                        step="0.1" 
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                        }`} 
                        value={item.bulk} 
                        onChange={(e) => {
                          const newBulk = parseFloat(e.target.value) || 0;
                          setEquippedItems(prev => prev.map((prevItem, i) => 
                            i === index ? {...prevItem, bulk: newBulk} : prevItem
                          ));
                        }}
                      />
                      <div className="flex justify-center">
                        <input type="checkbox" className="w-3 h-3" defaultChecked={item.reqAtt} />
                      </div>
                    </div>
                  ))}
                  {/* Empty rows */}
                  {[...Array(3)].map((_, index) => (
                    <div key={`empty-${index}`} className="grid grid-cols-8 gap-1 items-center mb-1" style={{ gridTemplateColumns: '1.2fr 1.8fr 0.6fr 1fr 0.6fr 0.6fr 0.6fr 0.8fr' }}>
                      <div className="relative">
                        <button
                          onClick={() => setEmptyEquippedItemsDropdowns(prev => ({
                            ...prev,
                            [`empty-${index}`]: !prev[`empty-${index}`]
                          }))}
                          className={`w-full text-xs border rounded px-1 py-1 text-center flex items-center justify-center ${
                            isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 hover:bg-gray-50'
                          } transition-colors`}
                        >
                          {emptyEquippedItemsTypes[`empty-${index}`] || 'Type'}
                        </button>
                        {emptyEquippedItemsDropdowns[`empty-${index}`] && (
                          <div className={`absolute top-full left-0 right-0 z-10 border rounded mt-1 ${
                            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          } shadow-lg`}>
                            {['Weapon', 'Armor', 'Ammunition', 'Shield', 'Accessory'].map(type => (
                              <button
                                key={type}
                                onClick={() => {
                                  setEmptyEquippedItemsTypes(prev => ({ ...prev, [`empty-${index}`]: type }));
                                  setEmptyEquippedItemsDropdowns(prev => ({ ...prev, [`empty-${index}`]: false }));
                                }}
                                className={`w-full text-left px-2 py-1 text-xs hover:${
                                  isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                                } transition-colors`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="Item name" />
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="+0" />
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="Range" />
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="0" />
                      <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="0" />
                      <input type="number" step="0.1" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="0" />
                      <div className="flex justify-center">
                        <input type="checkbox" className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                  <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                    EQUIPPED ITEMS
                  </h3>
                </div>

                {/* Attuned Items */}
                <div className={`rounded-lg p-4 shadow-lg border ${
                  isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                }`}>
                  <div className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 mb-2" style={{ gridTemplateColumns: '0.3fr 2fr 2fr' }}>
                    <div>Slot</div>
                    <div>Item</div>
                    <div>Details</div>
                  </div>
                  {[1, 2, 3, 4, 5].map((slot) => (
                    <div key={slot} className="grid grid-cols-3 gap-1 items-center mb-1" style={{ gridTemplateColumns: '0.3fr 2fr 2fr' }}>
                      <div className="text-xs text-center">{slot}</div>
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="Item name" disabled={slot > 3} />
                      <input type="text" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} placeholder="Details" disabled={slot > 3} />
                    </div>
                  ))}
                  <div className="space-y-1 mt-3">
                    <button className={`w-full text-xs py-1 px-2 rounded border ${
                      isDarkMode 
                        ? 'border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white' 
                        : 'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white'
                    } transition-colors`}>
                      Unlock Slot 4
                    </button>
                    <button className={`w-full text-xs py-1 px-2 rounded border ${
                      isDarkMode 
                        ? 'border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-white' 
                        : 'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white'
                    } transition-colors`}>
                      Unlock Slot 5
                    </button>
                  </div>
                  <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                    ATTUNED ITEMS
                  </h3>
                </div>
              </div>

              {/* Middle Column - Inventory */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-5 gap-1 text-xs font-bold text-gray-500 mb-2" style={{ gridTemplateColumns: '1.15fr 3fr 36px 40px 40px' }}>
                  <div>Item</div>
                  <div>Details</div>
                  <div className="text-center">Qty</div>
                  <div className="text-center">(SP)</div>
                  <div className="text-center">Bulk</div>
                </div>
                {inventoryItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-1 items-center mb-1" style={{ gridTemplateColumns: '1.15fr 3fr 36px 40px 40px' }}>
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} defaultValue={item.item} />
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} defaultValue={item.details} placeholder="Details" />
                    <input 
                      type="number" 
                      className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} 
                      value={item.amount} 
                      onChange={(e) => {
                        const newAmount = parseInt(e.target.value) || 0;
                        setInventoryItems(prev => prev.map((prevItem, i) => 
                          i === index ? {...prevItem, amount: newAmount} : prevItem
                        ));
                      }}
                    />
                    <input type="number" step="0.01" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} defaultValue={item.value} />
                    <input 
                      type="number" 
                      step="0.1" 
                      className={`w-full text-center text-xs border rounded px-1 py-1 ${
                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                      }`} 
                      value={item.bulk} 
                      onChange={(e) => {
                        const newBulk = parseFloat(e.target.value) || 0;
                        setInventoryItems(prev => prev.map((prevItem, i) => 
                          i === index ? {...prevItem, bulk: newBulk} : prevItem
                        ));
                      }}
                    />
                  </div>
                ))}
                {/* Empty rows for additional items */}
                {[...Array(15)].map((_, index) => (
                  <div key={`inv-empty-${index}`} className="grid grid-cols-5 gap-1 items-center mb-1" style={{ gridTemplateColumns: '1.15fr 3fr 36px 40px 40px' }}>
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="Item" />
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="Details" />
                    <input type="number" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="1" />
                    <input type="number" step="0.01" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="0" />
                    <input type="number" step="0.1" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="0" />
                  </div>
                ))}
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                  INVENTORY
                </h3>
              </div>

              {/* Right Column - External Storage */}
              <div className={`rounded-lg p-4 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <div className="grid grid-cols-3 gap-1 text-xs font-bold text-gray-500 mb-2" style={{ gridTemplateColumns: '2fr 0.45fr 2fr' }}>
                  <div>Item</div>
                  <div className="text-center">Bulk</div>
                  <div>Location</div>
                </div>
                {[...Array(20)].map((_, index) => (
                  <div key={`ext-${index}`} className="grid grid-cols-3 gap-1 items-center mb-1" style={{ gridTemplateColumns: '2fr 0.45fr 2fr' }}>
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="Item" />
                    <input type="number" step="0.1" className={`w-full text-center text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="0" />
                    <input type="text" className={`w-full text-xs border rounded px-1 py-1 ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                    }`} placeholder="Location" />
                  </div>
                ))}
                <h3 className="text-xs font-bold text-center uppercase tracking-wider text-gray-600 mt-3 pt-2 border-t border-gray-300">
                  EXTERNAL STORAGE
                </h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'character' && (
          <div className={`rounded-lg p-6 shadow-xl border-2 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
          }`}>
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center">Character Equipment</h2>
            
            {/* Armor and Equipment Section */}
            <div className={`rounded-lg p-4 shadow-lg border ${
              isDarkMode
                ? 'bg-gray-800 border-gray-600'
                : 'bg-white border-gray-300'
            }`}>
              <div className="space-y-4">
                {/* Header row */}
                <div className="grid grid-cols-4 gap-1 text-xs font-bold text-gray-500">
                  <div>Type</div>
                  <div>Item</div>
                  <div>Plus</div>
                  <div>Notches</div>
                </div>
                
                {/* Armor section */}
                <div className="border-t border-gray-300 pt-2">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Armor Type</div>
                  <div className="grid grid-cols-4 gap-1 items-center">
                    <div className="text-xs">{armor.armorType}</div>
                    <select
                      value={armor.armorType}
                      onChange={(e) => setArmor(prev => ({ ...prev, armorType: e.target.value }))}
                      className={`text-xs border rounded px-1 py-0.5 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Padded">Padded</option>
                      <option value="Leather">Leather</option>
                      <option value="Studded Leather">Studded Leather</option>
                      <option value="Hide">Hide</option>
                      <option value="Chain Shirt">Chain Shirt</option>
                      <option value="Scale Mail">Scale Mail</option>
                      <option value="Breastplate">Breastplate</option>
                      <option value="Half Plate">Half Plate</option>
                      <option value="Ring Mail">Ring Mail</option>
                      <option value="Chain Mail">Chain Mail</option>
                      <option value="Splint">Splint</option>
                      <option value="Plate">Plate</option>
                    </select>
                    <input
                      type="number"
                      value={armor.armorPlus}
                      onChange={(e) => setArmor(prev => ({ ...prev, armorPlus: parseInt(e.target.value) || 0 }))}
                      className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                    />
                    <input
                      type="text"
                      value={armor.armorNotches}
                      onChange={(e) => setArmor(prev => ({ ...prev, armorNotches: e.target.value }))}
                      className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Shield section */}
                <div className="border-t border-gray-300 pt-2">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Shield Type</div>
                  <div className="grid grid-cols-4 gap-1 items-center">
                    <div className="text-xs">Shield</div>
                    <select
                      value={armor.shield}
                      onChange={(e) => setArmor(prev => ({ ...prev, shield: e.target.value }))}
                      className={`text-xs border rounded px-1 py-0.5 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Shield">Shield</option>
                      <option value="Buckler">Buckler</option>
                      <option value="Tower Shield">Tower Shield</option>
                      <option value="None">None</option>
                    </select>
                    <input
                      type="number"
                      value={armor.shieldPlus}
                      onChange={(e) => setArmor(prev => ({ ...prev, shieldPlus: parseInt(e.target.value) || 0 }))}
                      className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      min="0"
                    />
                    <input
                      type="text"
                      value={armor.shieldNotches}
                      onChange={(e) => setArmor(prev => ({ ...prev, shieldNotches: e.target.value }))}
                      className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Magical Attire section */}
                <div className="border-t border-gray-300 pt-2">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Magical Attire</div>
                  {armor.magicalAttire.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-1 items-center mb-1">
                      <div className="text-xs">{index === 0 ? 'Magical Attire' : ''}</div>
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => {
                          const newAttire = [...armor.magicalAttire];
                          newAttire[index] = { ...newAttire[index], item: e.target.value };
                          setArmor(prev => ({ ...prev, magicalAttire: newAttire }));
                        }}
                        className={`text-xs border rounded px-1 py-0.5 w-full ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        value={item.plus}
                        onChange={(e) => {
                          const newAttire = [...armor.magicalAttire];
                          newAttire[index] = { ...newAttire[index], plus: parseInt(e.target.value) || 0 };
                          setArmor(prev => ({ ...prev, magicalAttire: newAttire }));
                        }}
                        className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                        min="0"
                      />
                      <input
                        type="text"
                        value={item.notches}
                        onChange={(e) => {
                          const newAttire = [...armor.magicalAttire];
                          newAttire[index] = { ...newAttire[index], notches: e.target.value };
                          setArmor(prev => ({ ...prev, magicalAttire: newAttire }));
                        }}
                        className={`text-xs text-center border rounded px-1 py-0.5 w-full ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'spellcasting' && (
          <div className={`rounded-lg p-8 shadow-xl border-2 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
          }`}>
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center">Spells</h2>
            <p className="text-center text-gray-400">Coming soon...</p>
          </div>
        )}

        {activeTab === 'master' && (
          <div className={`rounded-lg p-8 shadow-xl border-2 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
          }`}>
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center">Library</h2>
            <p className="text-center text-gray-400">Coming soon...</p>
          </div>
        )}

        {activeTab === 'data' && (
          <div className={`rounded-lg p-8 shadow-xl border-2 ${
            isDarkMode
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-amber-600'
              : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300'
          }`}>
            <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center">Data</h2>
            
            {/* 3-Column Layout */}
            <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Left Column - Background Image & Portrait Management */}
              <div className={`rounded-lg p-6 shadow-lg border space-y-8 ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                {/* Background Image Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-300 mb-4">Background Image</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Background Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setBackgroundImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2'
                          : 'bg-white border-gray-300 text-gray-900 file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2'
                      }`}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      Upload an image to use as background for all pages
                    </div>
                    {backgroundImage && (
                      <div className="mt-3">
                        <img src={backgroundImage} alt="Background preview" className="max-w-full rounded border" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Portrait Management */}
                <div>
                  <h3 className="text-lg font-semibold text-amber-300 mb-4">Portrait Management</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload Portrait Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setCharacter({...character, portrait: reader.result as string});
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-2 file:py-1 file:mr-2'
                          : 'bg-white border-gray-300 text-gray-900 file:bg-gray-200 file:text-gray-700 file:border-0 file:rounded file:px-2 file:py-1 file:mr-2'
                      }`}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                      Upload an image from your desktop to use as character portrait
                    </div>
                    {character.portrait && (
                      <div className="mt-3">
                        <img src={character.portrait} alt="Portrait preview" className="w-24 h-24 rounded border object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Column - Carrying Size */}
              <div className={`rounded-lg p-6 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <h3 className="text-lg font-semibold text-amber-300 mb-4">Carrying Size</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select the size you count as when determining carrying capacity.
                  </label>
                  <select
                    value={carryingSize}
                    onChange={(e) => setCarryingSize(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="Tiny">Tiny</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Huge">Huge</option>
                    <option value="Gargantuan">Gargantuan</option>
                  </select>
                </div>
              </div>

              {/* Right Column - Speed */}
              <div className={`rounded-lg p-6 shadow-lg border ${
                isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
              }`}>
                <h3 className="text-lg font-semibold text-amber-300 mb-4">Speed</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Enter any base speeds you have below.
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {/* Walk */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Walk</label>
                      <input
                        type="number"
                        value={speeds.walk}
                        onChange={(e) => setSpeeds({...speeds, walk: e.target.value})}
                        className={`w-full text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="30"
                      />
                    </div>
                    
                    {/* Climb */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Climb</label>
                      <input
                        type="number"
                        value={speeds.climb}
                        onChange={(e) => setSpeeds({...speeds, climb: e.target.value})}
                        className={`w-full text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="15"
                      />
                    </div>
                    
                    {/* Swim */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Swim</label>
                      <input
                        type="number"
                        value={speeds.swim}
                        onChange={(e) => setSpeeds({...speeds, swim: e.target.value})}
                        className={`w-full text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="15"
                      />
                    </div>
                    
                    {/* Burrow */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Burrow</label>
                      <input
                        type="number"
                        value={speeds.burrow}
                        onChange={(e) => setSpeeds({...speeds, burrow: e.target.value})}
                        className={`w-full text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="10"
                      />
                    </div>
                    
                    {/* Fly */}
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 text-center">Fly</label>
                      <input
                        type="number"
                        value={speeds.fly}
                        onChange={(e) => setSpeeds({...speeds, fly: e.target.value})}
                        className={`w-full text-center px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="60"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hit Points Section - Full Width Below Columns */}
            <div className={`rounded-lg p-6 shadow-lg border mt-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <h3 className="text-xl font-semibold text-amber-300 mb-4">Hit Points</h3>
              <p className="text-sm text-gray-300 mb-6">
                Enter the hit points you rolled for each level. Do not include your Con mod.
              </p>
              
              <div className="space-y-4">
                {/* Single Row with Level Headers */}
                <div className="flex gap-2 text-xs font-bold text-gray-400 text-center">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="flex-1 min-w-0">Lvl {i + 1}</div>
                  ))}
                </div>
                
                {/* Single Row with HP Input Boxes */}
                <div className="flex gap-2">
                  {Array.from({ length: 20 }, (_, i) => (
                    <input
                      key={i}
                      type="number"
                      min="1"
                      max="20"
                      value={hitPointRolls[i] || ''}
                      onChange={(e) => {
                        const newRolls = [...hitPointRolls];
                        newRolls[i] = parseInt(e.target.value) || 0;
                        setHitPointRolls(newRolls);
                      }}
                      className={`flex-1 min-w-0 text-center text-sm border rounded px-2 py-1 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  ))}
                </div>

                {/* Additional Options Below */}
                <div className="mt-6 space-y-3">
                    {/* Additional Bonuses */}
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div className="text-sm font-medium text-gray-300">Addt'l Bonuses</div>
                      <input
                        type="number"
                        value={additionalHPBonuses}
                        onChange={(e) => setAdditionalHPBonuses(parseInt(e.target.value) || 0)}
                        className={`w-full text-center text-sm border rounded px-2 py-1 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="+0"
                      />
                    </div>

                    {/* Toughness Feat */}
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div className="text-sm font-medium text-gray-300">Toughness?</div>
                      <select
                        value={hasToughness ? 'Yes' : 'No'}
                        onChange={(e) => setHasToughness(e.target.value === 'Yes')}
                        className={`w-full text-center text-sm border rounded px-2 py-1 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>

                    {/* PHB Hill Dwarf */}
                    <div className="grid grid-cols-2 gap-2 items-center">
                      <div className="text-sm font-medium text-gray-300">PHB Hill Dwarf?</div>
                      <select
                        value={isPHBHillDwarf ? 'Yes' : 'No'}
                        onChange={(e) => setIsPHBHillDwarf(e.target.value === 'Yes')}
                        className={`w-full text-center text-sm border rounded px-2 py-1 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dark/Light Mode Toggle - Bottom Right */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
            isDarkMode
              ? 'bg-amber-500 hover:bg-amber-400 text-gray-900'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
          aria-label="Toggle dark/light mode"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {isDarkMode ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </div>
        </button>

      </div>
    </div>
  );
}