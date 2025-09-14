'use client';

import { useState } from 'react';

// D&D 5e Player's Handbook Classes
const DND_CLASSES = [
  'Barbarian',
  'Bard', 
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard'
];

// D&D 5e Player's Handbook Races
const DND_RACES = [
  'Dragonborn',
  'Dwarf',
  'Elf',
  'Gnome',
  'Half-Elf',
  'Half-Orc',
  'Halfling',
  'Human',
  'Tiefling'
];

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
  weapons: Array<{
    name: string;
    proficient: boolean;
    notches: string;
    range: string;
    ability: string;
    atkBonus: string;
    damage: string;
  }>;
  survivalConditions: {
    hunger: { stage: string; effect: number; };
    thirst: { stage: string; effect: number; };
    fatigue: { stage: string; effect: number; };
    additionalExhaustion: number;
    totalExhaustion: number;
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
      backstoryText: 'Elara was raised in the shadowed halls of Candlekeep, where dust-laden tomes whispered secrets of forgotten ages. Surrounded by the endless hush of parchment and ink, she fed her restless hunger for knowledge until the arcane bent willingly to her will. The library became less a sanctuary and more a crucible, shaping her mind into a weapon of runes and power.\n\nNow she wanders the world, a silhouette against storm and moonlight, chasing the echoes of spells long buried. Her journey is not for riches nor fame, but for the shards of magic the world itself has tried to forget. Wherever she walks, shadows stir—and those who cross her path learn that knowledge, once unearthed, can be as dangerous as any blade.',
    },
    weapons: [
      {
        name: 'Quarterstaff',
        proficient: true,
        notches: '1',
        range: '5 ft',
        ability: 'STR',
        atkBonus: '+3',
        damage: '1d6+0'
      },
      {
        name: 'Dagger',
        proficient: true,
        notches: '1',
        range: '20/60 ft',
        ability: 'DEX',
        atkBonus: '+5',
        damage: '1d4+2'
      }
    ],
    survivalConditions: {
      hunger: { stage: 'Starving', effect: 1 },
      thirst: { stage: 'Dehydrated', effect: 1 },
      fatigue: { stage: 'Ok', effect: 0 },
      additionalExhaustion: 0,
      totalExhaustion: 2
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

  const updateAmmunition = (index: number, field: keyof typeof ammunition[0], value: string) => {
    const newAmmunition = [...ammunition];
    newAmmunition[index] = { ...newAmmunition[index], [field]: value };
    setAmmunition(newAmmunition);
  };

  const updateArmor = (section: keyof typeof armor, field: string, value: string) => {
    setArmor(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (value: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper functions for ability score calculations
  const calculateRolledScore = (rolls: number[]): number => {
    return rolls.sort((a, b) => b - a).slice(0, 3).reduce((sum, roll) => sum + roll, 0);
  };

  const getRacialBonus = (ability: string, race: string): number => {
    const racialBonuses: { [key: string]: { [key: string]: number } } = {
      'Human': { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
      'Dwarf': { constitution: 2, wisdom: 1 },
      'Elf': { dexterity: 2, intelligence: 1 },
      'Halfling': { dexterity: 2, charisma: 1 },
      'Dragonborn': { strength: 2, charisma: 1 },
      'Gnome': { intelligence: 2, constitution: 1 },
      'Half-Elf': { charisma: 2 }, // +1 to two others (will be handled separately)
      'Half-Orc': { strength: 2, constitution: 1 },
      'Tiefling': { intelligence: 1, charisma: 2 }
    };
    return racialBonuses[race]?.[ability] || 0;
  };

  // Additional state for new Data tab fields
  const [hitPointRolls, setHitPointRolls] = useState<number[]>(Array(20).fill(0));
  const [additionalHPBonuses, setAdditionalHPBonuses] = useState(0);
  const [hasToughness, setHasToughness] = useState(false);
  const [isPHBHillDwarf, setIsPHBHillDwarf] = useState(false);
  const [currentHitDice, setCurrentHitDice] = useState(0);
  const [maxHitDice, setMaxHitDice] = useState(0);
  const [damageReduction, setDamageReduction] = useState(0);
  
  // Death saves state
  const [deathSaves, setDeathSaves] = useState({
    successes: [false, false, false],
    failures: [false, false, false]
  });

  // Ammunition state
  const [ammunition, setAmmunition] = useState([
    { name: '', weapon: '', amount: '' },
    { name: '', weapon: '', amount: '' },
    { name: '', weapon: '', amount: '' }
  ]);

  // Armor state
  const [armor, setArmor] = useState({
    armorType: { item: 'Studded Leather', karuta: 'Karuta (Studded Leather)', plus: '', notches: '' },
    shieldType: { item: 'None', plus: '', notches: '' },
    magicalAttire: { plus: '', notches: '' }
  });

  // Image state
  const [statsImage, setStatsImage] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [backgroundBlur, setBackgroundBlur] = useState<number>(0);
  const [characterImage, setCharacterImage] = useState<string>('');

  // Ability Score Rolling Tracking
  const [abilityScoreRolls, setAbilityScoreRolls] = useState({
    strength: [0, 0, 0, 0],
    dexterity: [0, 0, 0, 0],
    constitution: [0, 0, 0, 0],
    intelligence: [0, 0, 0, 0],
    wisdom: [0, 0, 0, 0],
    charisma: [0, 0, 0, 0]
  });

  // Feat/ASI Tracking (levels 4, 8, 12, 16, 19)
  const [asiChoices, setAsiChoices] = useState({
    level4: { type: 'ASI', abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }, featName: '' },
    level8: { type: 'ASI', abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }, featName: '' },
    level12: { type: 'ASI', abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }, featName: '' },
    level16: { type: 'ASI', abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }, featName: '' },
    level19: { type: 'ASI', abilityIncreases: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }, featName: '' }
  });

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
    <div 
      className={`min-h-screen p-4 font-sans relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {backgroundImage && (
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${backgroundBlur}px)`
          }}
        />
      )}
      <div className="relative z-10">
      <div className="max-w-5xl mx-auto">
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
                {/* Left Column - Level, Portrait & Character Info */}
                <div className="flex items-center gap-6">
                  {/* Level */}
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className="text-4xl font-bold text-white">{character.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>

                  {/* Character Portrait */}
                  <div className="w-24 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center overflow-hidden">
                    {statsImage ? (
                      <img 
                        src={statsImage} 
                        alt="Character portrait" 
                        className="w-full h-full object-cover"
                        style={{filter: `blur(${backgroundBlur}px)`}}
                      />
                    ) : (
                      <span className="text-lg text-gray-400">IMG</span>
                    )}
                  </div>

                  {/* Character Info */}
                  <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-orange-400 mb-1">{character.name}</h1>
                    <p className="text-sm text-gray-300">
                      {character.race} {character.class} • {character.alignment}
                    </p>
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
                      <div key={ability} className={`bg-slate-700 ${borderColors[index]} rounded-xl border-2 px-2 py-1 text-center shadow-lg transform transition-transform hover:scale-105 min-w-16`}>
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

            {/* Two 2-Column Blocks Side by Side */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Block: 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
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

                {/* Ammunition */}
                <div className={`p-3 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <div className="pb-8 space-y-3">
                    <div className="grid grid-cols-10 gap-1 text-xs font-bold text-white mb-2">
                      <div className="col-span-3 text-center">Name</div>
                      <div className="col-span-4 text-center">Corr. Weapon</div>
                      <div className="col-span-3 text-center">Dice/Qty</div>
                    </div>
                    {ammunition.map((ammo, index) => (
                      <div key={index} className="grid grid-cols-10 gap-1">
                        <input
                          type="text"
                          value={ammo.name}
                          onChange={(e) => updateAmmunition(index, 'name', e.target.value)}
                          className={`col-span-3 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Ammo name"
                        />
                        <input
                          type="text"
                          value={ammo.weapon}
                          onChange={(e) => updateAmmunition(index, 'weapon', e.target.value)}
                          className={`col-span-4 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Weapon"
                        />
                        <select
                          value={ammo.amount}
                          onChange={(e) => updateAmmunition(index, 'amount', e.target.value)}
                          className={`col-span-3 text-center border rounded px-2 py-1 text-xs appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          style={{
                            backgroundImage: 'none'
                          }}
                        >
                          <option value="">Select Die</option>
                          <option value="d4">d4</option>
                          <option value="d6">d6</option>
                          <option value="d8">d8</option>
                          <option value="d10">d10</option>
                          <option value="d12">d12</option>
                          <option value="d20">d20</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Ammunition</h3>
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
                    <div className="text-center relative group">
                      <div className="text-xs font-bold text-white mb-2">Speed</div>
                      <input
                        type="number"
                        value={character.speed}
                        onChange={(e) => updateCharacter({ speed: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      
                      {/* Speed Pie Chart Tooltip */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        <div className="relative w-24 h-24 bg-slate-800 border-2 border-orange-500 rounded-full overflow-hidden">
                          {/* Pie segments using CSS clip-path for 4 quarters */}
                          <div className="absolute inset-0 bg-blue-600 opacity-70" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'}}></div>
                          <div className="absolute inset-0 bg-green-600 opacity-70" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)'}}></div>
                          <div className="absolute inset-0 bg-yellow-600 opacity-70" style={{clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)'}}></div>
                          <div className="absolute inset-0 bg-purple-600 opacity-70" style={{clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)'}}></div>
                          
                          {/* Speed labels positioned in each quarter */}
                          <div className="absolute top-1 right-1 text-xs font-bold text-white">
                            C:{speeds.climb}
                          </div>
                          <div className="absolute bottom-1 right-1 text-xs font-bold text-white">
                            S:{speeds.swim}
                          </div>
                          <div className="absolute bottom-1 left-1 text-xs font-bold text-white">
                            B:{speeds.burrow}
                          </div>
                          <div className="absolute top-1 left-1 text-xs font-bold text-white">
                            F:{speeds.fly}
                          </div>
                          
                          {/* Center circle */}
                          <div className="absolute inset-6 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center">
                            <div className="text-xs font-bold text-orange-400">Spd</div>
                          </div>
                        </div>
                      </div>
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
                        <div className="text-xs font-bold text-white mb-2">HP</div>
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
                    
                    {/* Resistance and Death Saves Section */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Resistance</div>
                        <textarea
                          placeholder="Resistances..."
                          rows={3}
                          className={`w-full text-xs text-center border rounded px-2 py-1 resize-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-white mb-2">Death Saves</div>
                        <div className="space-y-2">
                          <div className="flex justify-center space-x-2">
                            <span className="text-sm">☠️</span>
                            {deathSaves.failures.map((failed, i) => (
                              <div 
                                key={i} 
                                onClick={() => {
                                  const newFailures = [...deathSaves.failures];
                                  newFailures[i] = !newFailures[i];
                                  setDeathSaves({...deathSaves, failures: newFailures});
                                }}
                                className={`w-5 h-5 border-2 border-slate-600 rounded cursor-pointer transition-colors ${
                                  failed ? 'bg-red-600 border-red-500' : 'bg-slate-700 hover:bg-red-600'
                                }`}
                              ></div>
                            ))}
                          </div>
                          <div className="flex justify-center space-x-2">
                            <span className="text-sm">❤️</span>
                            {deathSaves.successes.map((succeeded, i) => (
                              <div 
                                key={i} 
                                onClick={() => {
                                  const newSuccesses = [...deathSaves.successes];
                                  newSuccesses[i] = !newSuccesses[i];
                                  setDeathSaves({...deathSaves, successes: newSuccesses});
                                }}
                                className={`w-5 h-5 border-2 border-slate-600 rounded cursor-pointer transition-colors ${
                                  succeeded ? 'bg-green-600 border-green-500' : 'bg-slate-700 hover:bg-green-600'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Health</h3>
                </div>
              </div>
              </div>

              {/* Weapons Box - Spans both columns (Passive and Health) */}
              <div className={`col-span-2 p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="space-y-3 pb-8">
                  {/* Column Headers */}
                  <div className="grid gap-2 text-xs font-semibold text-gray-400 pb-2 border-b border-slate-600" style={{gridTemplateColumns: "2fr 0.6fr 0.4fr 1fr 0.8fr 0.7fr 1.2fr 0.6fr"}}>
                    <div className="text-center">Name</div>
                    <div className="text-center">Prof</div>
                    <div className="text-center">Notch</div>
                    <div className="text-center">Range</div>
                    <div className="text-center">Ability</div>
                    <div className="text-center">ATK Bon</div>
                    <div className="text-center">Damage</div>
                    <div className="text-center">Roll</div>
                  </div>
                  
                  {character.weapons.map((weapon, index) => (
                    <div key={index} className="grid gap-2 items-center text-sm" style={{gridTemplateColumns: "2fr 0.6fr 0.4fr 1fr 0.8fr 0.7fr 1.2fr 0.6fr"}}>
                      {/* Name */}
                      <div>
                        <input
                          type="text"
                          value={weapon.name}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, name: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Weapon name"
                        />
                      </div>
                      
                      {/* Proficiency Checkbox */}
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={weapon.proficient}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, proficient: e.target.checked };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className="w-3 h-3 accent-green-500 rounded focus:ring-1 focus:ring-green-400"
                        />
                      </div>
                      
                      {/* Notches */}
                      <div>
                        <input
                          type="text"
                          value={weapon.notches}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, notches: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs text-center ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="+"
                        />
                      </div>
                      
                      {/* Range */}
                      <div>
                        <input
                          type="text"
                          value={weapon.range}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, range: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs text-center ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Range"
                        />
                      </div>
                      
                      {/* Ability */}
                      <div>
                        <input
                          type="text"
                          value={weapon.ability}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, ability: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs text-center ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="STR"
                        />
                      </div>
                      
                      {/* ATK Bonus */}
                      <div>
                        <input
                          type="text"
                          value={weapon.atkBonus}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, atkBonus: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs text-center ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="+0"
                        />
                      </div>
                      
                      {/* Damage */}
                      <div>
                        <input
                          type="text"
                          value={weapon.damage}
                          onChange={(e) => {
                            const newWeapons = [...character.weapons];
                            newWeapons[index] = { ...weapon, damage: e.target.value };
                            updateCharacter({ weapons: newWeapons });
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs text-center ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="1d6"
                        />
                      </div>
                      
                      {/* D20 Roll Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            const d20Roll = Math.floor(Math.random() * 20) + 1;
                            const atkBonus = parseInt(weapon.atkBonus.replace(/[^-\d]/g, '')) || 0;
                            const totalAttack = d20Roll + atkBonus;
                            
                            // Parse damage (e.g., "1d6+2" or "1d8")
                            const damageMatch = weapon.damage.match(/(\d+)d(\d+)([+-]\d+)?/);
                            let damageRoll = 0;
                            if (damageMatch) {
                              const numDice = parseInt(damageMatch[1]);
                              const dieSize = parseInt(damageMatch[2]);
                              const bonus = parseInt(damageMatch[3]) || 0;
                              
                              for (let i = 0; i < numDice; i++) {
                                damageRoll += Math.floor(Math.random() * dieSize) + 1;
                              }
                              damageRoll += bonus;
                            }
                            
                            alert(`${weapon.name || 'Weapon'} Roll:\n\nAttack: d20(${d20Roll}) + ${atkBonus} = ${totalAttack}\nDamage: ${damageRoll > 0 ? damageRoll : 'Invalid damage format'}`);
                          }}
                          className="w-6 h-6 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors rounded-sm"
                          style={{
                            clipPath: 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)',
                            fontSize: '0.64rem'
                          }}
                          title="Roll d20 attack and damage"
                        >
                          d20
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add/Remove Weapon Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (character.weapons.length < 5) {
                          updateCharacter({
                            weapons: [...character.weapons, {
                              name: '',
                              proficient: false,
                              notches: '',
                              range: '',
                              ability: '',
                              atkBonus: '',
                              damage: ''
                            }]
                          });
                        }
                      }}
                      disabled={character.weapons.length >= 5}
                      className={`flex-1 py-1 px-3 text-xs rounded transition-colors ${
                        character.weapons.length >= 5 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-orange-600 hover:bg-orange-700 text-white'
                      }`}
                      title={character.weapons.length >= 5 ? "Maximum 5 weapons allowed" : "Add weapon"}
                    >
                      {character.weapons.length >= 5 ? 'Max Weapons (5)' : 'Add Weapon'}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (character.weapons.length > 2) {
                          const newWeapons = character.weapons.slice(0, -1);
                          updateCharacter({ weapons: newWeapons });
                        }
                      }}
                      disabled={character.weapons.length <= 2}
                      className={`flex-1 py-1 px-3 text-xs rounded transition-colors ${
                        character.weapons.length <= 2 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                      title={character.weapons.length <= 2 ? "Cannot remove - minimum 2 weapons required" : "Remove last weapon"}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Weapons</h3>
                </div>
              </div>

              {/* Armor Box - Spans both columns (Passive and Health) */}
              <div className={`col-span-2 p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="space-y-4 pb-8">

                  {/* Armor Type Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 text-xs font-semibold text-gray-400">Armor Type</div>
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-32 text-xs font-semibold text-gray-400 text-center">Item</div>
                        <div className="w-12 text-xs font-semibold text-gray-400 text-center">+</div>
                        <div className="w-16 text-xs font-semibold text-gray-400 text-center">Notches</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 text-xs">Studded Leather</div>
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={armor.armorType.karuta}
                          onChange={(e) => updateArmor('armorType', 'karuta', e.target.value)}
                          className={`w-32 border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Karuta (Studded Leather)"
                        />
                        <input
                          type="text"
                          value={armor.armorType.plus}
                          onChange={(e) => updateArmor('armorType', 'plus', e.target.value)}
                          className={`w-12 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="+"
                        />
                        <input
                          type="text"
                          value={armor.armorType.notches}
                          onChange={(e) => updateArmor('armorType', 'notches', e.target.value)}
                          className={`w-16 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Notches"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shield Type Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 text-xs font-semibold text-gray-400">Shield Type</div>
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-32 text-xs font-semibold text-gray-400 text-center">Item</div>
                        <div className="w-12 text-xs font-semibold text-gray-400 text-center">+</div>
                        <div className="w-16 text-xs font-semibold text-gray-400 text-center">Notches</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 text-xs">None</div>
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={armor.shieldType.item}
                          onChange={(e) => updateArmor('shieldType', 'item', e.target.value)}
                          className={`w-32 border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder=""
                        />
                        <input
                          type="text"
                          value={armor.shieldType.plus}
                          onChange={(e) => updateArmor('shieldType', 'plus', e.target.value)}
                          className={`w-12 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="+"
                        />
                        <input
                          type="text"
                          value={armor.shieldType.notches}
                          onChange={(e) => updateArmor('shieldType', 'notches', e.target.value)}
                          className={`w-16 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Notches"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Magical Attire Section */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 text-xs font-semibold text-gray-400">Magical Attire</div>
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-32"></div>
                        <div className="w-12 text-xs font-semibold text-gray-400 text-center">+</div>
                        <div className="w-16 text-xs font-semibold text-gray-400 text-center">Notches</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24"></div>
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="w-32"></div>
                        <input
                          type="text"
                          value={armor.magicalAttire.plus}
                          onChange={(e) => updateArmor('magicalAttire', 'plus', e.target.value)}
                          className={`w-12 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="+"
                        />
                        <input
                          type="text"
                          value={armor.magicalAttire.notches}
                          onChange={(e) => updateArmor('magicalAttire', 'notches', e.target.value)}
                          className={`w-16 text-center border rounded px-2 py-1 text-xs ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                          }`}
                          placeholder="Notches"
                        />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Armor</h3>
                </div>
              </div>
              </div>

              {/* Right Block: 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
              {/* Column 3: Skills and Ammunition */}
              <div className="space-y-4">
              {/* Skills */}
              <div className={`p-4 rounded-lg border relative self-start ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
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

              </div>

              {/* Column 4: Current Date and Survival Conditions */}
              <div className="space-y-4">
                {/* Current Date Display - Compact */}
                <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  {/* Weather Icon */}
                  <div className="flex justify-center mb-3">
                    <WeatherIcon type={currentWeather} />
                  </div>
                  
                  {/* Current Date Display */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400 mb-1">
                      {getOrdinalNumber(currentDate.day)} of {currentDate.season}
                    </div>
                    <div className="text-sm text-gray-300">
                      {currentDate.year} Year of the Ivory
                    </div>
                  </div>
                </div>

                {/* Survival Conditions */}
                <div className={`p-4 rounded-lg border relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <div className="pb-8">
                <div className="space-y-2">
                  {/* Headers */}
                  <div className="grid gap-1 text-xs font-semibold text-gray-400 pb-1 border-b border-slate-600" style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div>Need</div>
                    <div className="text-center">Stage</div>
                    <div className="text-center">Effect</div>
                  </div>
                  
                  {/* Hunger */}
                  <div className={`grid gap-1 text-xs rounded px-2 py-1 ${
                    character.survivalConditions.hunger.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.hunger.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div className="text-gray-300">Hunger</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.hunger.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            'Stuffed': -1, 'Well-Fed': 0, 'Ok': 0, 'Peckish': 0, 'Hungry': 0, 'Ravenous': 1, 'Starving': 1
                          };
                          updateCharacter({
                            survivalConditions: {
                              ...character.survivalConditions,
                              hunger: { stage: e.target.value, effect: effectMap[e.target.value] || 0 }
                            }
                          });
                        }}
                        className={`w-full text-xs text-center rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Stuffed">Stuffed</option>
                        <option value="Well-Fed">Well-Fed</option>
                        <option value="Ok">Ok</option>
                        <option value="Peckish">Peckish</option>
                        <option value="Hungry">Hungry</option>
                        <option value="Ravenous">Ravenous</option>
                        <option value="Starving">Starving</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.hunger.effect}
                        onChange={(e) => updateCharacter({
                          survivalConditions: {
                            ...character.survivalConditions,
                            hunger: { ...character.survivalConditions.hunger, effect: parseInt(e.target.value) || 0 }
                          }
                        })}
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Thirst */}
                  <div className={`grid gap-1 text-xs rounded px-2 py-1 ${
                    character.survivalConditions.thirst.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.thirst.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div className="text-gray-300">Thirst</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.thirst.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            'Quenched': -1, 'Refreshed': 0, 'Ok': 0, 'Parched': 0, 'Thirsty': 0, 'Dry': 1, 'Dehydrated': 1
                          };
                          updateCharacter({
                            survivalConditions: {
                              ...character.survivalConditions,
                              thirst: { stage: e.target.value, effect: effectMap[e.target.value] || 0 }
                            }
                          });
                        }}
                        className={`w-full text-xs text-center rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Quenched">Quenched</option>
                        <option value="Refreshed">Refreshed</option>
                        <option value="Ok">Ok</option>
                        <option value="Parched">Parched</option>
                        <option value="Thirsty">Thirsty</option>
                        <option value="Dry">Dry</option>
                        <option value="Dehydrated">Dehydrated</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.thirst.effect}
                        onChange={(e) => updateCharacter({
                          survivalConditions: {
                            ...character.survivalConditions,
                            thirst: { ...character.survivalConditions.thirst, effect: parseInt(e.target.value) || 0 }
                          }
                        })}
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Fatigue */}
                  <div className={`grid gap-1 text-xs rounded px-2 py-1 ${
                    character.survivalConditions.fatigue.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.fatigue.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div className="text-gray-300">Fatigue</div>
                    <div className="text-center">
                      <select
                        value={character.survivalConditions.fatigue.stage}
                        onChange={(e) => {
                          const effectMap: { [key: string]: number } = {
                            'Energized': -1, 'Well-rested': 0, 'Ok': 0, 'Tired': 0, 'Sleepy': 0, 'Very sleepy': 1, 'Barely awake': 1
                          };
                          updateCharacter({
                            survivalConditions: {
                              ...character.survivalConditions,
                              fatigue: { stage: e.target.value, effect: effectMap[e.target.value] || 0 }
                            }
                          });
                        }}
                        className={`w-full text-xs text-center rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="Energized">Energized</option>
                        <option value="Well-rested">Well-rested</option>
                        <option value="Ok">Ok</option>
                        <option value="Tired">Tired</option>
                        <option value="Sleepy">Sleepy</option>
                        <option value="Very sleepy">Very sleepy</option>
                        <option value="Barely awake">Barely awake</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.fatigue.effect}
                        onChange={(e) => updateCharacter({
                          survivalConditions: {
                            ...character.survivalConditions,
                            fatigue: { ...character.survivalConditions.fatigue, effect: parseInt(e.target.value) || 0 }
                          }
                        })}
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Additional Exhaustion */}
                  <div className="grid gap-1 text-xs rounded px-2 py-1" style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div className="text-gray-300">Addt'l Exhaustion</div>
                    <div></div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.additionalExhaustion}
                        onChange={(e) => updateCharacter({
                          survivalConditions: {
                            ...character.survivalConditions,
                            additionalExhaustion: parseInt(e.target.value) || 0
                          }
                        })}
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Total Exhaustion */}
                  <div className="grid gap-1 text-xs border-t border-slate-600 pt-1 rounded px-2 py-1" style={{gridTemplateColumns: "1fr 1.4fr 0.8fr"}}>
                    <div className="text-gray-300 font-semibold">Total Exhaustion</div>
                    <div></div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.totalExhaustion}
                        onChange={(e) => updateCharacter({
                          survivalConditions: {
                            ...character.survivalConditions,
                            totalExhaustion: parseInt(e.target.value) || 0
                          }
                        })}
                        className={`w-full text-xs text-center rounded px-1 py-0.5 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Survival Conditions</h3>
                </div>
              </div>
              </div>
              </div>
            </div>
            
          </div>
        )}

        {/* Character Tab */}
        {activeTab === 'Character' && (
          <div className={`min-h-screen p-8 font-serif ${isDarkMode ? 'bg-slate-900 text-stone-200' : 'bg-stone-100 text-stone-800'}`}>
            {/* Decorative Header */}
            <div className={`text-center border-b-2 border-t-2 py-6 ${isDarkMode ? 'border-orange-400' : 'border-stone-400'}`}>
              <div className="mb-3">
                <textarea
                  value={character.backstory.personalityTraits || "I am eager to learn new things and ask many questions. I speak in metaphors and parables."}
                  onChange={(e) => updateCharacter({
                    backstory: { ...character.backstory, personalityTraits: e.target.value }
                  })}
                  className={`w-full bg-transparent italic text-lg text-center border-none outline-none resize-none ${isDarkMode ? 'text-stone-300' : 'text-stone-600'} placeholder-stone-400`}
                  placeholder="Character description..."
                  rows={2}
                />
              </div>
              <h1 className="text-6xl font-extrabold tracking-wider mb-4 font-serif">
                {character.name.toUpperCase() || 'CHARACTER NAME'}
              </h1>
              <div className={`py-1 px-8 inline-block rounded shadow-lg ${isDarkMode ? 'bg-orange-600 text-white' : 'bg-red-700 text-white'}`}>
                <input
                  type="text"
                  value={character.name}
                  onChange={(e) => updateCharacter({ name: e.target.value })}
                  className="bg-transparent font-semibold text-lg text-center border-none outline-none text-white placeholder-white/70"
                  placeholder="Full Character Name"
                />
              </div>
            </div>

            {/* Bio + Character Image Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
              {/* Bio Text and Profile Details */}
              <div className="md:col-span-2 space-y-8">
                {/* Bio Text */}
                <div className="leading-relaxed text-sm space-y-3">
                  <div className="prose prose-sm max-w-none">
                    <textarea
                      value={character.backstory.backstoryText ||
                       `Elara was raised in the shadowed halls of Candlekeep, where dust-laden tomes whispered secrets of forgotten ages. Surrounded by the endless hush of parchment and ink, she fed her restless hunger for knowledge until the arcane bent willingly to her will. The library became less a sanctuary and more a crucible, shaping her mind into a weapon of runes and power.\n\nNow she wanders the world, a silhouette against storm and moonlight, chasing the echoes of spells long buried. Her journey is not for riches nor fame, but for the shards of magic the world itself has tried to forget. Wherever she walks, shadows stir—and those who cross her path learn that knowledge, once unearthed, can be as dangerous as any blade.\n\nIdeals: Knowledge is power, and the key to all other forms of power.\n\nBonds: The library where I learned to read was my sanctuary. I must protect it.\n\nFlaws: I overlook obvious solutions in favor of complicated ones.`}
                      onChange={(e) => updateCharacter({
                        backstory: { ...character.backstory, backstoryText: e.target.value }
                      })}
                      className={`w-full bg-transparent border-none outline-none resize-none leading-relaxed text-sm ${isDarkMode ? 'text-stone-200' : 'text-stone-800'} placeholder-stone-400`}
                      placeholder="Character backstory..."
                      rows={12}
                    />
                  </div>
                </div>

                {/* Profile Details Section */}
                <div className={`border-2 p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-stone-300'}`}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p><span className="font-bold">Full Name:</span> {character.name}</p>
                      <p><span className="font-bold">Class:</span> {character.class}</p>
                      <p><span className="font-bold">Level:</span> {character.level}</p>
                      <p><span className="font-bold">Race:</span> {character.race}</p>
                      <p><span className="font-bold">Background:</span> {character.background}</p>
                    </div>

                    <div className="space-y-2">
                      <p><span className="font-bold">Alignment:</span> {character.alignment}</p>
                      <p><span className="font-bold">Experience:</span> {character.experiencePoints.toLocaleString()} XP</p>
                      <p><span className="font-bold">Proficiency:</span> +{character.proficiencyBonus}</p>
                      <p><span className="font-bold">Armor Class:</span> {character.armorClass}</p>
                      <p><span className="font-bold">Hit Points:</span> {character.hitPoints.current}/{character.hitPoints.maximum}</p>
                    </div>
                  </div>

                  {/* Ability Scores Radar Chart */}
                  <div className="mt-6 pt-4 border-t border-stone-300">
                    <h3 className={`font-bold text-lg mb-3 text-center ${isDarkMode ? 'text-orange-400' : 'text-stone-700'}`}>
                      Ability Scores
                    </h3>
                    <div className="flex justify-center">
                      <div className="w-80 h-80 relative">
                        <svg viewBox="0 0 320 320" className="w-full h-full">
                          {/* Background circles */}
                          {[1, 2, 3, 4, 5].map((level) => (
                            <circle
                              key={level}
                              cx="160"
                              cy="160"
                              r={level * 30}
                              fill="none"
                              stroke={isDarkMode ? '#475569' : '#d1d5db'}
                              strokeWidth="1"
                              opacity="0.3"
                            />
                          ))}

                          {/* Grid lines */}
                          {Object.entries(character.abilityScores).map(([ability, score], index) => {
                            const angle = (index * 60 - 90) * (Math.PI / 180);
                            const x2 = 160 + Math.cos(angle) * 150;
                            const y2 = 160 + Math.sin(angle) * 150;

                            return (
                              <line
                                key={ability}
                                x1="160"
                                y1="160"
                                x2={x2}
                                y2={y2}
                                stroke={isDarkMode ? '#475569' : '#d1d5db'}
                                strokeWidth="1"
                                opacity="0.3"
                              />
                            );
                          })}

                          {/* Data polygon */}
                          <polygon
                            points={Object.entries(character.abilityScores).map(([ability, score], index) => {
                              const normalizedScore = Math.min(score, 20) * 7.5; // Scale 1-20 to 0-150 radius
                              const angle = (index * 60 - 90) * (Math.PI / 180);
                              const x = 160 + Math.cos(angle) * normalizedScore;
                              const y = 160 + Math.sin(angle) * normalizedScore;
                              return `${x},${y}`;
                            }).join(' ')}
                            fill={isDarkMode ? 'rgba(249, 115, 22, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                            stroke={isDarkMode ? '#f97316' : '#ef4444'}
                            strokeWidth="2"
                          />

                          {/* Data points */}
                          {Object.entries(character.abilityScores).map(([ability, score], index) => {
                            const normalizedScore = Math.min(score, 20) * 7.5;
                            const angle = (index * 60 - 90) * (Math.PI / 180);
                            const x = 160 + Math.cos(angle) * normalizedScore;
                            const y = 160 + Math.sin(angle) * normalizedScore;

                            return (
                              <circle
                                key={ability}
                                cx={x}
                                cy={y}
                                r="4"
                                fill={isDarkMode ? '#f97316' : '#ef4444'}
                              />
                            );
                          })}

                          {/* Labels */}
                          {Object.entries(character.abilityScores).map(([ability, score], index) => {
                            const angle = (index * 60 - 90) * (Math.PI / 180);
                            const labelX = 160 + Math.cos(angle) * 170;
                            const labelY = 160 + Math.sin(angle) * 170;
                            const modifier = Math.floor((score - 10) / 2);

                            return (
                              <g key={ability}>
                                <text
                                  x={labelX}
                                  y={labelY - 5}
                                  textAnchor="middle"
                                  className={`text-xs font-semibold ${isDarkMode ? 'fill-stone-200' : 'fill-stone-800'}`}
                                >
                                  {ability.slice(0, 3).toUpperCase()}
                                </text>
                                <text
                                  x={labelX}
                                  y={labelY + 8}
                                  textAnchor="middle"
                                  className={`text-sm font-bold ${isDarkMode ? 'fill-orange-400' : 'fill-red-600'}`}
                                >
                                  {score}
                                </text>
                                <text
                                  x={labelX}
                                  y={labelY + 20}
                                  textAnchor="middle"
                                  className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}
                                >
                                  {modifier >= 0 ? '+' : ''}{modifier}
                                </text>
                              </g>
                            );
                          })}

                          {/* Value scale indicators */}
                          <text x="170" y="40" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>20</text>
                          <text x="170" y="70" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>15</text>
                          <text x="170" y="100" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>10</text>
                          <text x="170" y="130" className={`text-xs ${isDarkMode ? 'fill-stone-400' : 'fill-stone-600'}`}>5</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Illustration - Full Height */}
              <div className="flex justify-center items-start">
                <div className={`rounded-lg shadow-2xl overflow-hidden border-4 w-full ${isDarkMode ? 'border-orange-400 bg-slate-800' : 'border-stone-300 bg-white'}`}>
                  {characterImage ? (
                    <img
                      src={characterImage}
                      alt="Character portrait"
                      className="w-full h-full object-cover min-h-[600px]"
                    />
                  ) : (
                    <div className={`w-full h-[600px] flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-stone-400' : 'bg-stone-200 text-stone-500'}`}>
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎭</div>
                        <p className="text-sm">Character Portrait</p>
                        <p className="text-xs mt-2">Upload image in Data tab</p>
                      </div>
                    </div>
                  )}
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
                    <div className="text-xs text-white mb-1">Open Slots</div>
                    <input
                      type="number"
                      value={encumbrance.openSlots}
                      onChange={(e) => setEncumbrance({
                        ...encumbrance,
                        openSlots: parseInt(e.target.value) || 0
                      })}
                      className={`w-full text-center text-xl font-bold bg-transparent border rounded px-2 py-1 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode ? 'border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500' : 'border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-white mb-1">Max Slots</div>
                    <input
                      type="number"
                      value={encumbrance.maxSlots}
                      onChange={(e) => setEncumbrance({
                        ...encumbrance,
                        maxSlots: parseInt(e.target.value) || 0
                      })}
                      className={`w-full text-center text-xl font-bold bg-transparent border rounded px-2 py-1 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode ? 'border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500' : 'border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-white mb-1">Your Bulk</div>
                    <input
                      type="number"
                      value={encumbrance.yourBulk}
                      onChange={(e) => setEncumbrance({
                        ...encumbrance,
                        yourBulk: parseInt(e.target.value) || 0
                      })}
                      className={`w-full text-center text-xl font-bold bg-transparent border rounded px-2 py-1 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                        isDarkMode ? 'border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500' : 'border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="text-center pb-8">
                  <div className="text-xs text-white mb-1">Status:</div>
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
                          <td className="py-1 text-left">{coinType.charAt(0).toUpperCase()}P</td>
                          <td className="py-1 text-center">
                            <input
                              type="number"
                              min="0"
                              value={data.amount}
                              onChange={(e) => setPurse({
                                ...purse,
                                [coinType]: { ...data, amount: parseInt(e.target.value) || 0 }
                              })}
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.rations}
                        onChange={(e) => setRationBox({...rationBox, rations: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.totalBulk}
                        onChange={(e) => setRationBox({...rationBox, totalBulk: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.rations}
                        onChange={(e) => setWaterskinBox({...waterskinBox, rations: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.totalBulk}
                        onChange={(e) => setWaterskinBox({...waterskinBox, totalBulk: parseInt(e.target.value) || 0})}
                        className={`w-full text-center text-xs border rounded px-1 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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

            {/* Equipment Sections - 3 Column Layout with narrower External Storage */}
            <div className="grid gap-6" style={{gridTemplateColumns: '1fr 1fr 0.7fr'}}>
              
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
                                className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                                className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                        <th className="text-left py-1 w-32">Item</th>
                        <th className="text-left py-1">Details</th>
                        <th className="text-center py-1 w-12">Amount</th>
                        <th className="text-center py-1 w-12">SP</th>
                        <th className="text-center py-1 w-12">Bulk</th>
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
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                        <th className="text-center py-1 w-12">Bulk</th>
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
                              className={`w-12 text-center text-xs border rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Points</h3>
                
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
                          checked={isChecked as boolean}
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

              {/* Column 3: Feat/ASI Choices */}
              <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">Feat/ASI Choices</h3>
                <p className="text-xs text-gray-400 mb-4">Track your ability score improvements and feats by level.</p>
                
                <div className="space-y-2">
                  {Object.entries(asiChoices).map(([levelKey, choice]) => (
                    <div key={levelKey} className="border border-slate-600 rounded p-2">
                      <div className="space-y-1">
                        {/* Level and ASI/Feat Toggle on same row */}
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-white">Level {levelKey.replace('level', '')}</h4>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`${levelKey}-type`}
                                checked={choice.type === 'ASI'}
                                onChange={() => {
                                  setAsiChoices(prev => ({
                                    ...prev,
                                    [levelKey]: { ...prev[levelKey as keyof typeof prev], type: 'ASI' }
                                  }));
                                }}
                                className="mr-1"
                              />
                              <span className="text-xs text-gray-300">ASI</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`${levelKey}-type`}
                                checked={choice.type === 'Feat'}
                                onChange={() => {
                                  setAsiChoices(prev => ({
                                    ...prev,
                                    [levelKey]: { ...prev[levelKey as keyof typeof prev], type: 'Feat' }
                                  }));
                                }}
                                className="mr-1"
                              />
                              <span className="text-xs text-gray-300">Feat</span>
                            </label>
                          </div>
                        </div>

                        {choice.type === 'ASI' ? (
                          <div className="grid grid-cols-3 gap-1">
                            {Object.entries(choice.abilityIncreases).map(([ability, increase]) => (
                              <label key={ability} className="flex items-center text-xs">
                                <input
                                  type="checkbox"
                                  checked={increase > 0}
                                  onChange={(e) => {
                                    setAsiChoices(prev => ({
                                      ...prev,
                                      [levelKey]: {
                                        ...prev[levelKey as keyof typeof prev],
                                        abilityIncreases: {
                                          ...prev[levelKey as keyof typeof prev].abilityIncreases,
                                          [ability]: e.target.checked ? 1 : 0
                                        }
                                      }
                                    }));
                                  }}
                                  className="mr-1 scale-75"
                                />
                                <span className="text-gray-300">{ability.slice(0, 3).toUpperCase()}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="Feat name..."
                            value={choice.featName}
                            onChange={(e) => {
                              setAsiChoices(prev => ({
                                ...prev,
                                [levelKey]: { ...prev[levelKey as keyof typeof prev], featName: e.target.value }
                              }));
                            }}
                            className={`w-full text-xs border rounded px-2 py-1 ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 4: Calendar & Carrying Size */}
              <div className="space-y-6">
                {/* Calendar Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Calendar</h3>
                  <p className="text-xs text-gray-400 mb-4">Set the current game date.</p>
                  
                  <div className="space-y-3">
                    {/* Day and Year Inputs - Side by Side */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Day</label>
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
                              {day}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Year</label>
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
                      <label className="block text-xs font-medium text-gray-300 mb-1">Season</label>
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
                            {season.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Carrying Size Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Carrying Size</h3>
                  <p className="text-xs text-gray-400 mb-4">Select the size you count as when determining carrying capacity.</p>
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

                {/* Images Box */}
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Images</h3>
                  <p className="text-xs text-gray-400 mb-4">Upload images for character display and background.</p>
                  
                  <div className="space-y-4">
                    {/* Stats Image Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Stats Page Image</label>
                        <label className={`cursor-pointer px-3 py-1 text-xs rounded border transition-colors ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                        }`}>
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setStatsImage)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {statsImage && (
                        <div className="mt-2">
                          <img src={statsImage} alt="Stats preview" className="w-full h-20 object-cover rounded border" />
                        </div>
                      )}
                    </div>

                    {/* Background Image Upload with Opacity */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Background Image</label>
                        <label className={`cursor-pointer px-3 py-1 text-xs rounded border transition-colors ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                        }`}>
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setBackgroundImage)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Blur: {backgroundBlur}px</label>
                        <input
                          type="range"
                          min="0"
                          max="20"
                          step="1"
                          value={backgroundBlur}
                          onChange={(e) => setBackgroundBlur(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      {backgroundImage && (
                        <div className="mt-2">
                          <img src={backgroundImage} alt="Background preview" className="w-full h-20 object-cover rounded border" style={{filter: `blur(${backgroundBlur}px)`}} />
                        </div>
                      )}
                    </div>

                    {/* Character Image Upload */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Character Tab Image</label>
                        <label className={`cursor-pointer px-3 py-1 text-xs rounded border transition-colors ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                        }`}>
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setCharacterImage)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {characterImage && (
                        <div className="mt-2">
                          <img src={characterImage} alt="Character preview" className="w-full h-20 object-cover rounded border" />
                        </div>
                      )}
                    </div>
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
    </div>
  );
}