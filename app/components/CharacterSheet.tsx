'use client';

import { useState } from 'react';

interface Character {
  name: string;
  class: string;
  race: string;
  background: string;
  alignment: string;
  level: number;
  experiencePoints: number;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  hitDice: {
    total: string;
    used: number;
  };
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  proficiencyBonus: number;
  armorClass: number;
  initiative: number;
  speed: number;
  skills: {
    [key: string]: { proficient: boolean; expertise: boolean };
  };
  savingThrows: {
    [key: string]: boolean;
  };
  equipment: Array<{
    name: string;
    quantity: number;
    weight: number;
    description: string;
  }>;
  spells: Array<{
    name: string;
    level: number;
    school: string;
    description: string;
    prepared: boolean;
  }>;
  spellSlots: {
    [key: string]: { total: number; used: number };
  };
  features: Array<{
    name: string;
    description: string;
    source: string;
  }>;
  backstory: {
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
    backstoryText: string;
  };
}

export default function CharacterSheet() {
  const [activeTab, setActiveTab] = useState('Stats');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [character, setCharacter] = useState<Character>({
    name: 'Elara Moonwhisper',
    class: 'Wizard',
    race: 'Half-Elf',
    background: 'Sage',
    alignment: 'Lawful Good',
    level: 5,
    experiencePoints: 6500,
    hitPoints: {
      current: 32,
      maximum: 32,
      temporary: 0,
    },
    hitDice: {
      total: '5d6',
      used: 2,
    },
    abilityScores: {
      strength: 10,
      dexterity: 14,
      constitution: 13,
      intelligence: 18,
      wisdom: 12,
      charisma: 16,
    },
    proficiencyBonus: 3,
    armorClass: 12,
    initiative: 2,
    speed: 30,
    skills: {
      'Acrobatics': { proficient: false, expertise: false },
      'Animal Handling': { proficient: false, expertise: false },
      'Arcana': { proficient: true, expertise: false },
      'Athletics': { proficient: false, expertise: false },
      'Deception': { proficient: false, expertise: false },
      'History': { proficient: true, expertise: true },
      'Insight': { proficient: true, expertise: false },
      'Intimidation': { proficient: false, expertise: false },
      'Investigation': { proficient: true, expertise: false },
      'Medicine': { proficient: false, expertise: false },
      'Nature': { proficient: false, expertise: false },
      'Perception': { proficient: false, expertise: false },
      'Performance': { proficient: false, expertise: false },
      'Persuasion': { proficient: true, expertise: false },
      'Religion': { proficient: true, expertise: false },
      'Sleight of Hand': { proficient: false, expertise: false },
      'Stealth': { proficient: false, expertise: false },
      'Survival': { proficient: false, expertise: false },
    },
    savingThrows: {
      'Strength': false,
      'Dexterity': false,
      'Constitution': false,
      'Intelligence': true,
      'Wisdom': true,
      'Charisma': false,
    },
    equipment: [
      { name: 'Quarterstaff', quantity: 1, weight: 4, description: 'Versatile (1d8)' },
      { name: 'Dagger', quantity: 2, weight: 1, description: 'Light, finesse, thrown' },
      { name: 'Leather Armor', quantity: 1, weight: 10, description: 'AC 11 + Dex modifier' },
      { name: 'Spellbook', quantity: 1, weight: 3, description: 'Contains wizard spells' },
      { name: 'Component Pouch', quantity: 1, weight: 2, description: 'Spellcasting focus' },
      { name: 'Backpack', quantity: 1, weight: 5, description: 'Holds equipment' },
      { name: 'Bedroll', quantity: 1, weight: 7, description: 'For rest' },
      { name: 'Rations (1 day)', quantity: 10, weight: 2, description: 'Food for travel' },
      { name: 'Rope (50 feet)', quantity: 1, weight: 10, description: 'Hemp rope' },
      { name: 'Torch', quantity: 10, weight: 1, description: 'Light source' },
      { name: 'Gold Pieces', quantity: 125, weight: 0, description: 'Currency' },
    ],
    spells: [
      { name: 'Cantrip - Mage Hand', level: 0, school: 'Transmutation', description: 'Telekinetic hand', prepared: true },
      { name: 'Cantrip - Prestidigitation', level: 0, school: 'Transmutation', description: 'Minor magical effects', prepared: true },
      { name: 'Cantrip - Fire Bolt', level: 0, school: 'Evocation', description: '1d10 fire damage', prepared: true },
      { name: 'Magic Missile', level: 1, school: 'Evocation', description: 'Automatic hit force damage', prepared: true },
      { name: 'Shield', level: 1, school: 'Abjuration', description: '+5 AC reaction', prepared: true },
      { name: 'Detect Magic', level: 1, school: 'Divination', description: 'Sense magical auras', prepared: true },
      { name: 'Misty Step', level: 2, school: 'Conjuration', description: 'Teleport 30 feet', prepared: true },
      { name: 'Web', level: 2, school: 'Conjuration', description: 'Restrain creatures', prepared: true },
      { name: 'Fireball', level: 3, school: 'Evocation', description: '8d6 fire damage in 20ft radius', prepared: true },
    ],
    spellSlots: {
      '1st': { total: 4, used: 1 },
      '2nd': { total: 3, used: 0 },
      '3rd': { total: 2, used: 1 },
    },
    features: [
      { name: 'Spellcasting', description: 'Cast wizard spells using Intelligence', source: 'Wizard' },
      { name: 'Arcane Recovery', description: 'Recover spell slots on short rest', source: 'Wizard' },
      { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'Half-Elf' },
      { name: 'Fey Ancestry', description: 'Advantage on saves vs charmed, immune to sleep', source: 'Half-Elf' },
      { name: 'Researcher', description: 'Know where to find information', source: 'Sage' },
    ],
    backstory: {
      personalityTraits: 'I am eager to learn new things and ask many questions. I speak in metaphors and parables.',
      ideals: 'Knowledge is power, and the key to all other forms of power.',
      bonds: 'The library where I learned to read was my sanctuary. I must protect it.',
      flaws: 'I overlook obvious solutions in favor of complicated ones.',
      backstoryText: 'Elara grew up in the great library of Candlekeep, surrounded by ancient tomes and scrolls. Her thirst for knowledge led her to master the arcane arts at a young age. Now she travels the world, seeking lost magic and forgotten lore.',
    },
  });

  const getModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  const getSkillModifier = (skill: string, ability: keyof typeof character.abilityScores): number => {
    const baseModifier = getModifier(character.abilityScores[ability]);
    const skillData = character.skills[skill];
    let modifier = baseModifier;
    
    if (skillData.proficient) {
      modifier += character.proficiencyBonus;
    }
    if (skillData.expertise) {
      modifier += character.proficiencyBonus;
    }
    
    return modifier;
  };

  const getSaveModifier = (save: string, ability: keyof typeof character.abilityScores): number => {
    const baseModifier = getModifier(character.abilityScores[ability]);
    return character.savingThrows[save] ? baseModifier + character.proficiencyBonus : baseModifier;
  };

  const updateCharacter = (updates: Partial<Character>) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  // Additional state for new Data tab fields
  const [hitPointRolls, setHitPointRolls] = useState<number[]>(Array(20).fill(0));
  const [additionalHPBonuses, setAdditionalHPBonuses] = useState(0);
  const [hasToughness, setHasToughness] = useState(false);
  const [isPHBHillDwarf, setIsPHBHillDwarf] = useState(false);
  const [currentHitDice, setCurrentHitDice] = useState(0);
  const [maxHitDice, setMaxHitDice] = useState(0);
  const [damageReduction, setDamageReduction] = useState(0);

  // Fantasy Calendar State
  const [currentDate, setCurrentDate] = useState({
    day: 14,
    season: 'Early Spring',
    year: 4122
  });

  // Weather State
  const [currentWeather, setCurrentWeather] = useState(0); // 0=morning, 1=day, 2=evening, 3=night, 4=rainy, 5=snowy

  // Fantasy Calendar System
  const seasons = [
    { name: 'Early Spring', days: 30 },
    { name: 'Midspring', days: 31 },
    { name: 'Late Spring', days: 30 },
    { name: 'Early Summer', days: 31 },
    { name: 'Midsummer', days: 30 },
    { name: 'Late Summer', days: 31 },
    { name: 'Early Autumn', days: 30 },
    { name: 'Midautumn', days: 31 },
    { name: 'Late Autumn', days: 30 },
    { name: 'Early Winter', days: 30 },
    { name: 'Midwinter', days: 31 },
    { name: 'Late Winter', days: 30 }
  ];

  const getMaxDaysForSeason = (season: string) => {
    const foundSeason = seasons.find(s => s.name === season);
    return foundSeason ? foundSeason.days : 30;
  };

  const getOrdinalNumber = (num: number) => {
    const remainder10 = num % 10;
    const remainder100 = num % 100;
    
    if (remainder100 >= 11 && remainder100 <= 13) {
      return num + 'th';
    }
    
    switch (remainder10) {
      case 1: return num + 'st';
      case 2: return num + 'nd';
      case 3: return num + 'rd';
      default: return num + 'th';
    }
  };

  // Weather Functions
  const weatherTypes = ['morning', 'day', 'evening', 'night', 'rainy', 'snowy'];
  
  const cycleWeather = () => {
    setCurrentWeather((prev) => (prev + 1) % weatherTypes.length);
  };

  const WeatherIcon = ({ type }: { type: number }) => {
    const iconStyle = "w-16 h-16 cursor-pointer transition-transform hover:scale-110";
    
    switch (type) {
      case 0: // Morning - Sun behind mountains
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Sun positioned behind mountains - only showing 2/3s */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
              </div>
              {/* Mountains using CSS triangles - positioned to cover 1/3 of sun */}
              <div className="absolute bottom-0 left-1 w-0 h-0" 
                   style={{
                     borderLeft: '12px solid transparent',
                     borderRight: '12px solid transparent', 
                     borderBottom: '24px solid #374151'
                   }}></div>
              <div className="absolute bottom-0 left-6 w-0 h-0" 
                   style={{
                     borderLeft: '16px solid transparent',
                     borderRight: '16px solid transparent', 
                     borderBottom: '32px solid #4b5563'
                   }}></div>
              <div className="absolute bottom-0 right-1 w-0 h-0" 
                   style={{
                     borderLeft: '12px solid transparent',
                     borderRight: '12px solid transparent', 
                     borderBottom: '24px solid #374151'
                   }}></div>
            </div>
          </div>
        );
      case 1: // Day - Yellow sun with centered glow effect
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse" 
                   style={{
                     boxShadow: '0 0 20px 8px rgba(251, 191, 36, 0.6)'
                   }}></div>
            </div>
          </div>
        );
      case 2: // Evening - Orange/red sun
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full animate-pulse shadow-xl shadow-orange-500/50"></div>
            </div>
          </div>
        );
      case 3: // Night - Crescent moon with stars
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Stars */}
              <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-6 left-4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-4 right-2 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
              {/* Crescent Moon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-gray-300 rounded-full relative">
                  <div className="absolute top-1 left-2 w-6 h-6 bg-slate-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // Rainy - Fluffy cloud with rain
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Fluffy Cloud */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                {/* Main cloud body */}
                <div className="w-12 h-6 bg-gray-400 rounded-full relative">
                  {/* Cloud puffs */}
                  <div className="absolute -left-2 top-0 w-5 h-5 bg-gray-400 rounded-full"></div>
                  <div className="absolute -right-2 top-0 w-5 h-5 bg-gray-400 rounded-full"></div>
                  <div className="absolute left-1 -top-2 w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="absolute right-1 -top-2 w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="absolute left-3 -top-3 w-6 h-6 bg-gray-300 rounded-full"></div>
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-500 rounded-full"></div>
                  <div className="absolute right-0 top-2 w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              {/* Rain drops */}
              <div className="absolute top-8 left-6 w-0.5 h-4 bg-blue-300 animate-pulse"></div>
              <div className="absolute top-9 left-8 w-0.5 h-3 bg-blue-300 animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute top-8 left-10 w-0.5 h-4 bg-blue-300 animate-pulse" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute top-10 left-7 w-0.5 h-3 bg-blue-300 animate-pulse" style={{animationDelay: '0.9s'}}></div>
            </div>
          </div>
        );
      case 5: // Snowy - Cloud with snow
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Cloud */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute -left-1 top-1 w-4 h-4 bg-gray-300 rounded-full"></div>
                  <div className="absolute -right-1 top-1 w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              {/* Snow flakes */}
              <div className="absolute top-8 left-5 w-1 h-1 bg-white rounded-full animate-bounce"></div>
              <div className="absolute top-10 left-7 w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-9 left-9 w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute top-11 left-6 w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute top-8 left-10 w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
            </div>
          </div>
        );
      default:
        return <div className={iconStyle} onClick={cycleWeather}></div>;
    }
  };
  
  const [speeds, setSpeeds] = useState({
    walk: 30,
    climb: 0,
    swim: 0,
    burrow: 0,
    fly: 0
  });

  const [hitDice, setHitDice] = useState({
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 5
  });

  const [initiativeModifiers, setInitiativeModifiers] = useState({
    alert: false,
    jackOfAllTrades: false,
    wisMod: false,
    intMod: false,
    chaMod: false,
    additionalBonus: 0
  });

  const [carryingSize, setCarryingSize] = useState('Medium');

  // Inventory management state
  const [encumbrance, setEncumbrance] = useState({
    openSlots: 18,
    maxSlots: 18,
    yourBulk: 20,
    status: 'Unencumbered'
  });

  const [purse, setPurse] = useState({
    iron: { amount: 0, value: 0.01 },
    copper: { amount: 0, value: 0.1 },
    silver: { amount: 0, value: 1 },
    gold: { amount: 0, value: 10 },
    platinum: { amount: 0, value: 100 }
  });

  const [rationBox, setRationBox] = useState({
    boxes: 0,
    rations: 0,
    totalBulk: 0
  });

  const [waterskinBox, setWaterskinBox] = useState({
    skins: 0,
    rations: 0,
    totalBulk: 0
  });

  const [magicalContainers, setMagicalContainers] = useState({
    bagOfHolding: { owned: 6, slots: 6 },
    portableHole: { owned: 9, slots: 9 },
    handyHaversack: { owned: 12, slots: 12 },
    quiverOfEhlonna: { owned: 9, slots: 9 }
  });

  const [purchaseCalculator, setPurchaseCalculator] = useState({
    iron: { purchase: 0, after: 0 },
    copper: { purchase: 0, after: 0 },
    silver: { purchase: 0, after: 0 },
    gold: { purchase: 0, after: 0 },
    platinum: { purchase: 0, after: 0 }
  });

  const calculatePurseBulk = () => {
    const totalCoins = Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0);
    return Math.floor(totalCoins / 50); // 50 coins = 1 bulk
  };

  const calculateTotalValue = () => {
    return Object.values(purse).reduce((sum, coin) => sum + (coin.amount * coin.value), 0);
  };

  const handlePurchaseCalculation = () => {
    const newCalculator = { ...purchaseCalculator };
    Object.keys(newCalculator).forEach(coinType => {
      const currentAmount = purse[coinType as keyof typeof purse]?.amount || 0;
      newCalculator[coinType as keyof typeof newCalculator].after = currentAmount - newCalculator[coinType as keyof typeof newCalculator].purchase;
    });
    setPurchaseCalculator(newCalculator);
  };

  // Additional inventory sections state
  const [equippedItems, setEquippedItems] = useState([
    { type: 'Armor', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
    { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false },
    { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false }
  ]);

  const [attunedItems, setAttunedItems] = useState([
    { slot: 1, item: '', details: '' },
    { slot: 2, item: '', details: '' },
    { slot: 3, item: '', details: '' },
    { slot: 4, item: '', details: '', unlocked: false },
    { slot: 5, item: '', details: '', unlocked: false }
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 },
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 },
    { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 }
  ]);

  const [externalStorage, setExternalStorage] = useState([
    { item: '', bulk: 0, location: '' },
    { item: '', bulk: 0, location: '' },
    { item: '', bulk: 0, location: '' }
  ]);

  const itemTypes = ['Armor', 'Weapon', 'Shield', 'Tool', 'Wondrous Item', 'Potion', 'Scroll', 'Ring', 'Wand', 'Staff', 'Rod'];

  const addEquippedItem = () => {
    setEquippedItems([...equippedItems, { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false }]);
  };

  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 }]);
  };

  const addExternalStorageItem = () => {
    setExternalStorage([...externalStorage, { item: '', bulk: 0, location: '' }]);
  };

  const unlockAttunementSlot = (slotNumber: number) => {
    setAttunedItems(attunedItems.map(slot => 
      slot.slot === slotNumber ? { ...slot, unlocked: true } : slot
    ));
  };

  const tabs = ['Stats', 'Inventory', 'Character', 'Spells', 'Library', 'Data'];

  return (
    <div className={`min-h-screen p-4 font-sans ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Character Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-400 mb-2">{character.name}</h1>
          <p className="text-xl text-gray-300">
            Level {character.level} {character.race} {character.class} • {character.background} • {character.alignment}
          </p>
        </div>

        {/* Tab Navigation - Above Main Box */}
        <div className="flex justify-center mb-4 space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>


        {/* Stats Tab */}
        {activeTab === 'Stats' && (
          <div className="space-y-8">
            {/* Character Header Section */}
            <div className="bg-slate-800 border-2 border-orange-500 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Level & Portrait */}
                <div className="flex items-center gap-6">
                  {/* Level */}
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-white">{character.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>

                  {/* Character Portrait */}
                  <div className="w-24 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                    <span className="text-lg text-gray-400">IMG</span>
                  </div>
                </div>

                {/* Right Column - Ability Scores */}
                <div className="flex items-center justify-end gap-2">
                  {Object.entries(character.abilityScores).map(([ability, score], index) => {
                    const borderColors = [
                      'border-red-400',     // STR
                      'border-emerald-400', // DEX
                      'border-orange-400',  // CON
                      'border-blue-400',    // INT
                      'border-purple-400',  // WIS
                      'border-pink-400'     // CHA
                    ];
                    const textColors = [
                      'text-red-400',       // STR
                      'text-emerald-400',   // DEX
                      'text-orange-400',    // CON
                      'text-blue-400',      // INT
                      'text-purple-400',    // WIS
                      'text-pink-400'       // CHA
                    ];
                    return (
                      <div key={ability} className={`bg-slate-700 ${borderColors[index]} rounded-xl border-2 p-3 text-center shadow-lg transform transition-transform hover:scale-105 min-w-16`}>
                        <div className={`text-xs font-bold ${textColors[index]} mb-1`}>{ability.slice(0, 3).toUpperCase()}</div>
                        <input
                          type="number"
                          value={score}
                          onChange={(e) => updateCharacter({
                            abilityScores: { ...character.abilityScores, [ability]: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full text-2xl font-bold text-white bg-transparent border-0 text-center rounded-lg py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-slate-600/50"
                        />
                        <div className="text-sm font-semibold text-white/90 mt-1">
                          {getModifier(score) >= 0 ? '+' : ''}{getModifier(score)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4-Column Row */}
            <div className="grid grid-cols-4 gap-4">
              {/* Column 1: Saving Throws */}
              <div className="space-y-4">
                <div className={`p-3 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="pb-8">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(character.savingThrows).map(([save, proficient]) => {
                        const abilityMap: { [key: string]: keyof typeof character.abilityScores } = {
                          'Strength': 'strength', 'Dexterity': 'dexterity', 'Constitution': 'constitution',
                          'Intelligence': 'intelligence', 'Wisdom': 'wisdom', 'Charisma': 'charisma'
                        };
                        const abbreviations: { [key: string]: string } = {
                          'Strength': 'STR', 'Dexterity': 'DEX', 'Constitution': 'CON',
                          'Intelligence': 'INT', 'Wisdom': 'WIS', 'Charisma': 'CHA'
                        };
                        const modifier = getSaveModifier(save, abilityMap[save]);
                        return (
                          <div key={save} className={`flex items-center justify-between px-2 py-1 rounded-full border-2 transform transition-all duration-200 hover:scale-105 ${
                            proficient 
                              ? 'bg-green-500/20 border-green-400' 
                              : 'bg-slate-700 border-slate-600'
                          }`}>
                            <div className="flex items-center gap-1">
                              <input
                                type="checkbox"
                                checked={proficient}
                                onChange={(e) => updateCharacter({
                                  savingThrows: { ...character.savingThrows, [save]: e.target.checked }
                                })}
                                className="w-3 h-3 accent-green-500 rounded focus:ring-2 focus:ring-green-400"
                              />
                              <span className="text-xs font-medium">{abbreviations[save]}</span>
                            </div>
                            <span className="font-mono text-xs font-bold">{modifier >= 0 ? '+' : ''}{modifier}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Saving Throws</h3>
                  </div>
                </div>
                
                {/* Passive Skills */}
                <div className={`p-3 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="pb-8 space-y-3">
                    {/* Passive Perception */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 bg-slate-700 border-slate-600 transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">👁️</span>
                        <span className="text-xs">Passive Perception</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-blue-400">
                        {10 + getSkillModifier('Perception', 'wisdom')}
                      </span>
                    </div>
                    
                    {/* Passive Investigation */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 bg-slate-700 border-slate-600 transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">🔍</span>
                        <span className="text-xs">Passive Investigation</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-purple-400">
                        {10 + getSkillModifier('Investigation', 'intelligence')}
                      </span>
                    </div>
                    
                    {/* Passive Insight */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 bg-slate-700 border-slate-600 transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">🧠</span>
                        <span className="text-xs">Passive Insight</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-green-400">
                        {10 + getSkillModifier('Insight', 'wisdom')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Passive</h3>
                  </div>
                </div>
              </div>

              {/* Column 2: Combat Stats and Health */}
              <div className="space-y-4">
                {/* Combat Stats Box */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="grid grid-cols-3 gap-4 pb-8">
                    <div className="text-center">
                      <div className="text-xs font-bold text-white mb-2">AC</div>
                      <input
                        type="number"
                        value={character.armorClass}
                        onChange={(e) => updateCharacter({ armorClass: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-white mb-2">Initiative</div>
                      <input
                        type="number"
                        value={character.initiative}
                        onChange={(e) => updateCharacter({ initiative: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-white mb-2">Speed</div>
                      <input
                        type="number"
                        value={character.speed}
                        onChange={(e) => updateCharacter({ speed: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Combat Stats</h3>
                  </div>
                </div>
                
                {/* Health Box */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="space-y-4 pb-8">
                  {/* Health Bar - At the top */}
                  <div className="space-y-2">
                    <div className={`w-full h-6 border rounded-lg overflow-hidden relative ${
                      isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-100'
                    }`}>
                      <div 
                        className="h-full transition-all duration-500 rounded-lg"
                        style={{
                          width: `${Math.min(100, Math.max(0, (character.hitPoints.current / character.hitPoints.maximum) * 100))}%`,
                          backgroundColor: 
                            character.hitPoints.current <= character.hitPoints.maximum * 0.25 ? '#ef4444' :
                            character.hitPoints.current <= character.hitPoints.maximum * 0.5 ? '#f59e0b' :
                            character.hitPoints.current <= character.hitPoints.maximum * 0.75 ? '#eab308' :
                            '#10b981'
                        }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                        {Math.round((character.hitPoints.current / character.hitPoints.maximum) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Hit Points */}
                  <div className="space-y-4">
                    {/* HP Section - Horizontal Layout */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Current HP</div>
                        <input
                          type="number"
                          value={character.hitPoints.current}
                          onChange={(e) => updateCharacter({
                            hitPoints: { ...character.hitPoints, current: parseInt(e.target.value) || 0 }
                          })}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Max HP</div>
                        <input
                          type="number"
                          value={character.hitPoints.maximum}
                          onChange={(e) => updateCharacter({
                            hitPoints: { ...character.hitPoints, maximum: parseInt(e.target.value) || 0 }
                          })}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Temp HP</div>
                        <input
                          type="number"
                          value={character.hitPoints.temporary}
                          onChange={(e) => updateCharacter({
                            hitPoints: { ...character.hitPoints, temporary: parseInt(e.target.value) || 0 }
                          })}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Hit Dice Section */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Hit Dice</div>
                        <input
                          type="number"
                          value={currentHitDice}
                          onChange={(e) => setCurrentHitDice(parseInt(e.target.value) || 0)}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Max Dice</div>
                        <input
                          type="number"
                          value={maxHitDice}
                          onChange={(e) => setMaxHitDice(parseInt(e.target.value) || 0)}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Reduction</div>
                        <input
                          type="number"
                          value={damageReduction}
                          onChange={(e) => setDamageReduction(parseInt(e.target.value) || 0)}
                          className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Health</h3>
                </div>
              </div>
              </div>

              {/* Column 3: Skills */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="space-y-1 pb-8">
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {Object.entries(character.skills).map(([skill, data]) => {
                      const abilityMap: { [key: string]: keyof typeof character.abilityScores } = {
                        'Acrobatics': 'dexterity', 'Animal Handling': 'wisdom', 'Arcana': 'intelligence',
                        'Athletics': 'strength', 'Deception': 'charisma', 'History': 'intelligence',
                        'Insight': 'wisdom', 'Intimidation': 'charisma', 'Investigation': 'intelligence',
                        'Medicine': 'wisdom', 'Nature': 'intelligence', 'Perception': 'wisdom',
                        'Performance': 'charisma', 'Persuasion': 'charisma', 'Religion': 'intelligence',
                        'Sleight of Hand': 'dexterity', 'Stealth': 'dexterity', 'Survival': 'wisdom'
                      };
                      const modifier = getSkillModifier(skill, abilityMap[skill]);
                      return (
                        <div key={skill} className="flex items-center justify-between py-0.5 transform transition-all duration-200 hover:scale-105">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              data.expertise ? 'bg-yellow-400' : data.proficient ? 'bg-green-400' : 'bg-gray-600'
                            }`}></div>
                            <span>{skill}</span>
                          </div>
                          <span className="font-mono">{modifier >= 0 ? '+' : ''}{modifier}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Skills</h3>
                </div>
              </div>

              {/* Column 4: Current Date Display */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="pb-8">
                  {/* Weather Icon */}
                  <div className="flex justify-center mb-4">
                    <WeatherIcon type={currentWeather} />
                  </div>
                  
                  {/* Current Date Display */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400 mb-2">
                      {getOrdinalNumber(currentDate.day)} of {currentDate.season}
                    </div>
                    <div className="text-sm text-gray-300">
                      {currentDate.year} Year of the Ivory
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Current Date</h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Character Tab */}
        {activeTab === 'Character' && (
          <div className="space-y-8">
            {/* Character Details */}
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Character Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => updateCharacter({ name: e.target.value })}
                      className={`w-full border rounded px-3 py-2 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Class</label>
                      <input
                        type="text"
                        value={character.class}
                        onChange={(e) => updateCharacter({ class: e.target.value })}
                        className={`w-full border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
                      <input
                        type="number"
                        value={character.level}
                        onChange={(e) => updateCharacter({ level: parseInt(e.target.value) || 1 })}
                        className={`w-full border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Race</label>
                      <input
                        type="text"
                        value={character.race}
                        onChange={(e) => updateCharacter({ race: e.target.value })}
                        className={`w-full border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Background</label>
                      <input
                        type="text"
                        value={character.background}
                        onChange={(e) => updateCharacter({ background: e.target.value })}
                        className={`w-full border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Backstory */}
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Character Backstory</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Personality Traits</label>
                    <textarea
                      value={character.backstory.personalityTraits}
                      onChange={(e) => updateCharacter({
                        backstory: { ...character.backstory, personalityTraits: e.target.value }
                      })}
                      rows={2}
                      className={`w-full border rounded px-3 py-2 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Ideals</label>
                    <textarea
                      value={character.backstory.ideals}
                      onChange={(e) => updateCharacter({
                        backstory: { ...character.backstory, ideals: e.target.value }
                      })}
                      rows={2}
                      className={`w-full border rounded px-3 py-2 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bonds</label>
                    <textarea
                      value={character.backstory.bonds}
                      onChange={(e) => updateCharacter({
                        backstory: { ...character.backstory, bonds: e.target.value }
                      })}
                      rows={2}
                      className={`w-full border rounded px-3 py-2 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Flaws</label>
                    <textarea
                      value={character.backstory.flaws}
                      onChange={(e) => updateCharacter({
                        backstory: { ...character.backstory, flaws: e.target.value }
                      })}
                      rows={2}
                      className={`w-full border rounded px-3 py-2 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spells Tab */}
        {activeTab === 'Spells' && (
          <div className="space-y-8">
            {/* Spells */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
              <h3 className="text-xl font-semibold text-orange-400 mb-4">Spells</h3>
              
              {/* Spell Slots */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Spell Slots</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(character.spellSlots).map(([level, slots]) => (
                    <div key={level} className={`p-3 rounded border text-center ${
                      isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'
                    }`}>
                      <div className="text-sm font-medium text-gray-300">{level} Level</div>
                      <div className="text-lg font-bold">
                        {slots.total - slots.used} / {slots.total}
                      </div>
                      <div className="text-xs text-gray-400">Available</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spell List */}
              <div className="space-y-2">
                {character.spells.map((spell, index) => (
                  <div key={index} className={`p-3 rounded border ${
                    isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          spell.prepared ? 'bg-green-400' : 'bg-gray-600'
                        }`}></div>
                        <h4 className="font-semibold">{spell.name}</h4>
                      </div>
                      <div className="text-sm text-gray-400">
                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.school}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300">{spell.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'Library' && (
          <div className="space-y-8">
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
              <h3 className="text-xl font-semibold text-orange-400 mb-4">Spell Library & Resources</h3>
              <div className="text-center text-gray-400 py-12">
                <p>Spell library and reference materials coming soon...</p>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'Inventory' && (
          <div className="space-y-6">
            {/* Row 1: Top 5 Boxes */}
            <div className="grid grid-cols-5 gap-4">
              
              {/* 1. Encumbrance Box */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Open Slots</div>
                    <div className="text-xl font-bold text-green-400">{encumbrance.openSlots}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Max Slots</div>
                    <div className="text-xl font-bold text-orange-400">{encumbrance.maxSlots}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Your Bulk</div>
                    <div className="text-xl font-bold text-blue-400">{encumbrance.yourBulk}</div>
                  </div>
                </div>
                <div className="text-center pb-8">
                  <div className="text-xs text-gray-400 mb-1">Status:</div>
                  <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {encumbrance.status}
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Encumbrance</h3>
                </div>
              </div>

              {/* 2. Purse Box */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1">Coin</th>
                        <th className="text-center py-1">Amount</th>
                        <th className="text-center py-1">Value (SP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(purse).map(([coinType, data]) => (
                        <tr key={coinType} className="border-b border-slate-600">
                          <td className="py-1 text-left capitalize">{coinType} ({coinType.charAt(0).toUpperCase()}P)</td>
                          <td className="py-1 text-center">
                            <input
                              type="number"
                              min="0"
                              value={data.amount}
                              onChange={(e) => setPurse({
                                ...purse,
                                [coinType]: { ...data, amount: parseInt(e.target.value) || 0 }
                              })}
                              className={`w-12 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1 text-center text-gray-300">{(data.amount * data.value).toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-center pb-8">
                  <div className="text-xs text-gray-400">Total Bulk = {calculatePurseBulk()}</div>
                  <div className="text-xs text-gray-400">Total Value = {calculateTotalValue().toFixed(1)} SP</div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Purse</h3>
                </div>
              </div>

              {/* 3. Ration Box */}
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="space-y-2 pb-8">
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 text-center">
                      <div># of Boxes</div>
                      <div># of Rations</div>
                      <div>Total Bulk</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        min="0"
                        value={rationBox.boxes}
                        onChange={(e) => setRationBox({...rationBox, boxes: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.rations}
                        onChange={(e) => setRationBox({...rationBox, rations: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.totalBulk}
                        onChange={(e) => setRationBox({...rationBox, totalBulk: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Ration Box</h3>
                  </div>
                </div>

                {/* 4. Waterskin Box (beneath Ration Box) */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="space-y-2 pb-8">
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-400 text-center">
                      <div># of Skins</div>
                      <div># of Rations</div>
                      <div>Total Bulk</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.skins}
                        onChange={(e) => setWaterskinBox({...waterskinBox, skins: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.rations}
                        onChange={(e) => setWaterskinBox({...waterskinBox, rations: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.totalBulk}
                        onChange={(e) => setWaterskinBox({...waterskinBox, totalBulk: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Waterskin</h3>
                  </div>
                </div>
              </div>

              {/* 5. Magical Containers Box */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1">Type</th>
                        <th className="text-center py-1"># Owned</th>
                        <th className="text-center py-1">Slots</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Bag of Holding</td>
                        <td className="py-1 text-center">{magicalContainers.bagOfHolding.owned}</td>
                        <td className="py-1 text-center">{magicalContainers.bagOfHolding.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Portable Hole</td>
                        <td className="py-1 text-center">{magicalContainers.portableHole.owned}</td>
                        <td className="py-1 text-center">{magicalContainers.portableHole.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Handy Haversack</td>
                        <td className="py-1 text-center">{magicalContainers.handyHaversack.owned}</td>
                        <td className="py-1 text-center">{magicalContainers.handyHaversack.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Quiver of Ehlonna</td>
                        <td className="py-1 text-center">{magicalContainers.quiverOfEhlonna.owned}</td>
                        <td className="py-1 text-center">{magicalContainers.quiverOfEhlonna.slots}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Magical Containers</h3>
                </div>
              </div>

              {/* 6. Purchase Calculator Box */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1">Coin</th>
                        <th className="text-center py-1">Purchase</th>
                        <th className="text-center py-1">After</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(purchaseCalculator).map(([coinType, data]) => (
                        <tr key={coinType} className="border-b border-slate-600">
                          <td className="py-1 text-left capitalize">{coinType} ({coinType.charAt(0).toUpperCase()}P)</td>
                          <td className="py-1 text-center">
                            <input
                              type="number"
                              min="0"
                              value={data.purchase}
                              onChange={(e) => setPurchaseCalculator({
                                ...purchaseCalculator,
                                [coinType]: { ...data, purchase: parseInt(e.target.value) || 0 }
                              })}
                              className={`w-12 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1 text-center text-gray-300">{data.after}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handlePurchaseCalculation}
                  className="w-full mt-3 mb-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
                >
                  Calculate
                </button>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Purchase Calculator</h3>
                </div>
              </div>

            </div>

            {/* Equipment Sections - 3 Column Layout */}
            <div className="grid grid-cols-3 gap-6">
              
              {/* Left Column: Equipped Items + Attuned Items */}
              <div className="space-y-6">
                
                {/* 1. Equipped Items */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-1">Type</th>
                          <th className="text-left py-1">Item</th>
                          <th className="text-center py-1">Bonus</th>
                          <th className="text-center py-1">Range</th>
                          <th className="text-center py-1">Notches</th>
                          <th className="text-center py-1">Value</th>
                          <th className="text-center py-1">Bulk</th>
                          <th className="text-center py-1">Att?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equippedItems.map((equippedItem, index) => (
                          <tr key={index} className="border-b border-slate-600">
                            <td className="py-1">
                              {index === 0 ? (
                                <span className="text-gray-300">Armor</span>
                              ) : (
                                <select
                                  value={equippedItem.type}
                                  onChange={(e) => {
                                    const newItems = [...equippedItems];
                                    newItems[index].type = e.target.value;
                                    setEquippedItems(newItems);
                                  }}
                                  className={`w-full text-xs border rounded px-1 ${
                                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                >
                                  <option value="">-</option>
                                  {itemTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              )}
                            </td>
                            <td className="py-1">
                              <input
                                type="text"
                                value={equippedItem.item}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].item = e.target.value;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-full text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="text"
                                value={equippedItem.itemBonus}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].itemBonus = e.target.value;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="text"
                                value={equippedItem.range}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].range = e.target.value;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="text"
                                value={equippedItem.notches}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].notches = e.target.value;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="number"
                                min="0"
                                value={equippedItem.valueSP}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].valueSP = parseInt(e.target.value) || 0;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={equippedItem.bulk}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].bulk = parseFloat(e.target.value) || 0;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1 text-center">
                              <input
                                type="checkbox"
                                checked={equippedItem.reqAtt}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].reqAtt = e.target.checked;
                                  setEquippedItems(newItems);
                                }}
                                className="form-checkbox h-3 w-3 text-amber-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    onClick={addEquippedItem}
                    className="w-full mt-2 mb-8 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors"
                  >
                    Add Item
                  </button>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Equipped Items</h3>
                  </div>
                </div>

                {/* 2. Attuned Items */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-center py-1">Slot</th>
                          <th className="text-left py-1">Item</th>
                          <th className="text-left py-1">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attunedItems.map((attunedItem) => (
                          <tr key={attunedItem.slot} className="border-b border-slate-600">
                            <td className="py-1 text-center font-medium">{attunedItem.slot}</td>
                            <td className="py-1">
                              {(attunedItem.slot <= 3 || attunedItem.unlocked) ? (
                                <input
                                  type="text"
                                  value={attunedItem.item}
                                  onChange={(e) => {
                                    const newItems = attunedItems.map(slot =>
                                      slot.slot === attunedItem.slot
                                        ? { ...slot, item: e.target.value }
                                        : slot
                                    );
                                    setAttunedItems(newItems);
                                  }}
                                  className={`w-full text-xs border rounded px-1 ${
                                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">Locked</span>
                              )}
                            </td>
                            <td className="py-1">
                              {(attunedItem.slot <= 3 || attunedItem.unlocked) ? (
                                <input
                                  type="text"
                                  value={attunedItem.details}
                                  onChange={(e) => {
                                    const newItems = attunedItems.map(slot =>
                                      slot.slot === attunedItem.slot
                                        ? { ...slot, details: e.target.value }
                                        : slot
                                    );
                                    setAttunedItems(newItems);
                                  }}
                                  className={`w-full text-xs border rounded px-1 ${
                                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                                  }`}
                                />
                              ) : (
                                <span className="text-gray-400 text-xs">Locked</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 mb-8 space-x-2">
                    <button
                      onClick={() => unlockAttunementSlot(4)}
                      disabled={attunedItems.find(slot => slot.slot === 4)?.unlocked}
                      className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Unlock Slot 4?
                    </button>
                    <button
                      onClick={() => unlockAttunementSlot(5)}
                      disabled={attunedItems.find(slot => slot.slot === 5)?.unlocked}
                      className="text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Unlock Slot 5?
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Attuned Items</h3>
                  </div>
                </div>
              </div>

              {/* Center Column: Inventory */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1">Item</th>
                        <th className="text-left py-1">Details</th>
                        <th className="text-center py-1">Amount</th>
                        <th className="text-center py-1">Value (SP)</th>
                        <th className="text-center py-1">Bulk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((inventoryItem, index) => (
                        <tr key={index} className="border-b border-slate-600">
                          <td className="py-1">
                            <input
                              type="text"
                              value={inventoryItem.item}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].item = e.target.value;
                                setInventoryItems(newItems);
                              }}
                              className={`w-full text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={inventoryItem.details}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].details = e.target.value;
                                setInventoryItems(newItems);
                              }}
                              className={`w-full text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                              placeholder="Details"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              value={inventoryItem.amount}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].amount = parseInt(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              className={`w-16 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              value={inventoryItem.valueSP}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].valueSP = parseInt(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              className={`w-16 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={inventoryItem.bulk}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].bulk = parseFloat(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              className={`w-16 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={addInventoryItem}
                  className="w-full mt-2 mb-8 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors"
                >
                  Add Item
                </button>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Inventory</h3>
                </div>
              </div>

              {/* Right Column: External Storage */}
              <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1">Item</th>
                        <th className="text-center py-1">Bulk</th>
                        <th className="text-left py-1">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {externalStorage.map((storageItem, index) => (
                        <tr key={index} className="border-b border-slate-600">
                          <td className="py-1">
                            <input
                              type="text"
                              value={storageItem.item}
                              onChange={(e) => {
                                const newItems = [...externalStorage];
                                newItems[index].item = e.target.value;
                                setExternalStorage(newItems);
                              }}
                              className={`w-full text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={storageItem.bulk}
                              onChange={(e) => {
                                const newItems = [...externalStorage];
                                newItems[index].bulk = parseFloat(e.target.value) || 0;
                                setExternalStorage(newItems);
                              }}
                              className={`w-16 text-center text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={storageItem.location}
                              onChange={(e) => {
                                const newItems = [...externalStorage];
                                newItems[index].location = e.target.value;
                                setExternalStorage(newItems);
                              }}
                              className={`w-full text-xs border rounded px-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={addExternalStorageItem}
                  className="w-full mt-2 mb-8 bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 px-2 rounded transition-colors"
                >
                  Add Item
                </button>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">External Storage</h3>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'Data' && (
          <div className="space-y-8">
            {/* 4-Column Layout */}
            <div className="grid grid-cols-4 gap-6">
              
              {/* Column 1: Hit Points */}
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Hit Points</h3>
                
                {/* HP Levels 1-10 and 11-20 in two columns */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column: Levels 1-10 */}
                    <div className="space-y-1">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-6 text-xs font-bold text-gray-400 text-center">
                            {i + 1}
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={hitPointRolls[i] || ''}
                            onChange={(e) => {
                              const newRolls = [...hitPointRolls];
                              newRolls[i] = parseInt(e.target.value) || 0;
                              setHitPointRolls(newRolls);
                            }}
                            className={`w-12 text-center text-sm border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              isDarkMode
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Right Column: Levels 11-20 */}
                    <div className="space-y-1">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i + 10} className="flex items-center gap-2">
                          <div className="w-6 text-xs font-bold text-gray-400 text-center">
                            {i + 11}
                          </div>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={hitPointRolls[i + 10] || ''}
                            onChange={(e) => {
                              const newRolls = [...hitPointRolls];
                              newRolls[i + 10] = parseInt(e.target.value) || 0;
                              setHitPointRolls(newRolls);
                            }}
                            className={`w-12 text-center text-sm border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                              isDarkMode
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Addt'l Bonuses</span>
                    <input
                      type="number"
                      value={additionalHPBonuses}
                      onChange={(e) => setAdditionalHPBonuses(parseInt(e.target.value) || 0)}
                      className={`w-16 text-center text-sm border rounded px-2 py-1 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="+0"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Toughness?</span>
                    <select
                      value={hasToughness ? 'Yes' : 'No'}
                      onChange={(e) => setHasToughness(e.target.value === 'Yes')}
                      className={`text-center text-sm border rounded px-2 py-1 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">PHB Hill Dwarf?</span>
                    <select
                      value={isPHBHillDwarf ? 'Yes' : 'No'}
                      onChange={(e) => setIsPHBHillDwarf(e.target.value === 'Yes')}
                      className={`text-center text-sm border rounded px-2 py-1 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Column 2: Speed, Hit Die, Initiative */}
              <div className="space-y-6">
                {/* Speed Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Speed</h3>
                  <p className="text-xs text-gray-400 mb-4">Enter any base speeds you have below.</p>
                  <div className="space-y-2">
                    {Object.entries(speeds).map(([speedType, value]) => (
                      <div key={speedType} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300 capitalize">{speedType}</label>
                        <input
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) => setSpeeds({
                            ...speeds,
                            [speedType]: parseInt(e.target.value) || 0
                          })}
                          className={`w-16 text-center text-sm border rounded px-2 py-1 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hit Die Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Die</h3>
                  <p className="text-xs text-gray-400 mb-4">The number of hit dice of each type you have from your class levels.</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(hitDice).map(([dieType, count]) => (
                      <div key={dieType} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">{dieType}</label>
                        <input
                          type="number"
                          min="0"
                          value={count}
                          onChange={(e) => setHitDice({
                            ...hitDice,
                            [dieType]: parseInt(e.target.value) || 0
                          })}
                          className={`w-12 text-center text-sm border rounded px-1 py-1 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Initiative Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Initiative</h3>
                  <p className="text-xs text-gray-400 mb-4">Enter any additional modifiers to your initiative.</p>
                  <div className="space-y-2">
                    {Object.entries(initiativeModifiers).filter(([key]) => key !== 'additionalBonus').map(([modifier, isChecked]) => (
                      <div key={modifier} className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-300">
                          {modifier === 'jackOfAllTrades' ? 'Jack of All Trades?' :
                           modifier === 'wisMod' ? 'Wis Mod?' :
                           modifier === 'intMod' ? 'Int Mod?' :
                           modifier === 'chaMod' ? 'Cha Mod?' :
                           'Alert?'}
                        </label>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => setInitiativeModifiers({
                            ...initiativeModifiers,
                            [modifier]: e.target.checked
                          })}
                          className="form-checkbox h-4 w-4 text-amber-500"
                        />
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-300">Addt'l Bonus</label>
                      <input
                        type="number"
                        value={initiativeModifiers.additionalBonus}
                        onChange={(e) => setInitiativeModifiers({
                          ...initiativeModifiers,
                          additionalBonus: parseInt(e.target.value) || 0
                        })}
                        className={`w-16 text-center text-sm border rounded px-2 py-1 ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Carrying Size */}
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Carrying Size</h3>
                <p className="text-sm text-gray-400 mb-4">Select the size you count as when determining carrying capacity.</p>
                <select
                  value={carryingSize}
                  onChange={(e) => setCarryingSize(e.target.value)}
                  className={`w-full border rounded px-3 py-2 ${
                    isDarkMode
                      ? 'bg-slate-700 border-slate-600 text-white'
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

              {/* Column 4: Calendar Settings */}
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-xl font-semibold text-orange-400 mb-4">Calendar Settings</h3>
                
                {/* Current Date Display */}
                <div className="text-center mb-6">
                  <div className="text-lg font-bold text-orange-400 mb-2">
                    {getOrdinalNumber(currentDate.day)} of {currentDate.season}
                  </div>
                  <div className="text-sm text-gray-300">
                    {currentDate.year} Year of the Ivory
                  </div>
                </div>

                {/* Date Controls */}
                <div className="space-y-4">
                  {/* Day and Year Inputs - Side by Side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Day</label>
                      <select
                        value={currentDate.day}
                        onChange={(e) => setCurrentDate({
                          ...currentDate,
                          day: parseInt(e.target.value)
                        })}
                        className={`w-full text-center text-sm border rounded px-2 py-1 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {Array.from({ length: getMaxDaysForSeason(currentDate.season) }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>
                            {getOrdinalNumber(day)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-white mb-1">Year</label>
                      <input
                        type="number"
                        value={currentDate.year}
                        onChange={(e) => setCurrentDate({
                          ...currentDate,
                          year: parseInt(e.target.value) || 4122
                        })}
                        className={`w-full text-center text-sm border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Season Dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1">Season</label>
                    <select
                      value={currentDate.season}
                      onChange={(e) => setCurrentDate({
                        ...currentDate,
                        season: e.target.value,
                        day: Math.min(currentDate.day, getMaxDaysForSeason(e.target.value))
                      })}
                      className={`w-full text-sm border rounded px-2 py-1 ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {seasons.map(season => (
                        <option key={season.name} value={season.name}>
                          {season.name} ({season.days} days)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isDarkMode
              ? 'bg-amber-500 hover:bg-amber-400 text-gray-900'
              : 'bg-gray-800 hover:bg-slate-700 text-white'
          }`}
          aria-label="Toggle dark/light mode"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            {isDarkMode ? '☀️' : '🌙'}
          </div>
        </button>
      </div>
    </div>
  );
}