"use client";

import { useState, useEffect } from "react";

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
  'Custom Lineage',
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

// D&D 5e Alignments
const DND_ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil'
];

// Gender Options
const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Non-binary',
  'Other'
];

// Feat Data Structures
interface Feat {
  name: string;
  description: string;
  source: 'class' | 'race' | 'manual';
  level?: number;
}

// Class Features that grant feats automatically
const CLASS_FEATS: { [key: string]: { [level: number]: Feat[] } } = {
  'Fighter': {
    1: [{ name: 'Fighting Style', description: 'Choose a fighting style that grants combat bonuses', source: 'class', level: 1 }],
    2: [{ name: 'Action Surge', description: 'Take an additional action on your turn', source: 'class', level: 2 }],
    3: [{ name: 'Martial Archetype', description: 'Choose your fighter subclass', source: 'class', level: 3 }],
    5: [{ name: 'Extra Attack', description: 'Attack twice when you take the Attack action', source: 'class', level: 5 }],
    9: [{ name: 'Indomitable', description: 'Reroll a failed saving throw', source: 'class', level: 9 }],
    11: [{ name: 'Extra Attack (2)', description: 'Attack three times when you take the Attack action', source: 'class', level: 11 }],
    20: [{ name: 'Extra Attack (3)', description: 'Attack four times when you take the Attack action', source: 'class', level: 20 }]
  },
  'Rogue': {
    1: [{ name: 'Expertise', description: 'Double proficiency bonus for two skills', source: 'class', level: 1 },
        { name: 'Sneak Attack', description: '1d6 extra damage when conditions are met', source: 'class', level: 1 }],
    2: [{ name: 'Cunning Action', description: 'Dash, Disengage, or Hide as a bonus action', source: 'class', level: 2 }],
    3: [{ name: 'Roguish Archetype', description: 'Choose your rogue subclass', source: 'class', level: 3 }],
    5: [{ name: 'Uncanny Dodge', description: 'Halve damage from one attack per turn', source: 'class', level: 5 }],
    6: [{ name: 'Expertise (Additional)', description: 'Double proficiency bonus for two more skills', source: 'class', level: 6 }],
    7: [{ name: 'Evasion', description: 'Take no damage on successful Dex saves, half on failures', source: 'class', level: 7 }]
  },
  'Wizard': {
    1: [{ name: 'Spellcasting', description: 'Cast wizard spells using Intelligence', source: 'class', level: 1 },
        { name: 'Arcane Recovery', description: 'Recover spell slots on short rest', source: 'class', level: 1 }],
    2: [{ name: 'Arcane Tradition', description: 'Choose your wizard school', source: 'class', level: 2 }],
    18: [{ name: 'Spell Mastery', description: 'Cast certain spells without expending spell slots', source: 'class', level: 18 }],
    20: [{ name: 'Signature Spells', description: 'Always have two 3rd level spells prepared', source: 'class', level: 20 }]
  },
  'Barbarian': {
    1: [{ name: 'Rage', description: 'Enter a battle rage for combat bonuses', source: 'class', level: 1 },
        { name: 'Unarmored Defense', description: 'AC = 10 + Dex + Con while unarmored', source: 'class', level: 1 }],
    2: [{ name: 'Reckless Attack', description: 'Gain advantage but enemies gain advantage against you', source: 'class', level: 2 },
        { name: 'Danger Sense', description: 'Advantage on Dex saves against traps and spells', source: 'class', level: 2 }],
    3: [{ name: 'Primal Path', description: 'Choose your barbarian subclass', source: 'class', level: 3 }],
    5: [{ name: 'Extra Attack', description: 'Attack twice when you take the Attack action', source: 'class', level: 5 },
        { name: 'Fast Movement', description: 'Speed increases by 10 feet', source: 'class', level: 5 }]
  },
  'Bard': {
    1: [{ name: 'Spellcasting', description: 'Cast bard spells using Charisma', source: 'class', level: 1 },
        { name: 'Bardic Inspiration', description: 'Inspire allies with bonus action', source: 'class', level: 1 }],
    2: [{ name: 'Jack of All Trades', description: 'Add half proficiency to non-proficient checks', source: 'class', level: 2 },
        { name: 'Song of Rest', description: 'Improve short rest healing with performance', source: 'class', level: 2 }],
    3: [{ name: 'Bard College', description: 'Choose your bard subclass', source: 'class', level: 3 },
        { name: 'Expertise', description: 'Double proficiency bonus for two skills', source: 'class', level: 3 }]
  },
  'Cleric': {
    1: [{ name: 'Spellcasting', description: 'Cast cleric spells using Wisdom', source: 'class', level: 1 },
        { name: 'Divine Domain', description: 'Choose your cleric domain', source: 'class', level: 1 }],
    2: [{ name: 'Channel Divinity', description: 'Use divine energy for supernatural effects', source: 'class', level: 2 }],
    5: [{ name: 'Destroy Undead', description: 'Channel Divinity to destroy undead', source: 'class', level: 5 }]
  },
  'Druid': {
    1: [{ name: 'Spellcasting', description: 'Cast druid spells using Wisdom', source: 'class', level: 1 },
        { name: 'Druidcraft', description: 'Know the Druidcraft cantrip', source: 'class', level: 1 }],
    2: [{ name: 'Wild Shape', description: 'Transform into beasts', source: 'class', level: 2 },
        { name: 'Druid Circle', description: 'Choose your druid subclass', source: 'class', level: 2 }],
    18: [{ name: 'Timeless Body', description: 'Age more slowly and cannot be aged magically', source: 'class', level: 18 }],
    20: [{ name: 'Archdruid', description: 'Unlimited Wild Shape uses', source: 'class', level: 20 }]
  }
};

// Racial Features that grant feats
const RACIAL_FEATS: { [key: string]: Feat[] } = {
  'Human': [
    { name: 'Extra Skill', description: 'Gain proficiency in one additional skill', source: 'race' },
    { name: 'Extra Language', description: 'Learn one additional language', source: 'race' },
    { name: 'Versatile', description: '+1 to all ability scores', source: 'race' }
  ],
  'Elf': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Keen Senses', description: 'Proficiency in Perception', source: 'race' },
    { name: 'Fey Ancestry', description: 'Advantage on saves against charm, immune to magical sleep', source: 'race' },
    { name: 'Trance', description: 'Meditate for 4 hours instead of sleeping for 8', source: 'race' }
  ],
  'Dwarf': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Dwarven Resilience', description: 'Advantage on saves against poison, resistance to poison damage', source: 'race' },
    { name: 'Dwarven Combat Training', description: 'Proficiency with battleaxe, handaxe, light hammer, warhammer', source: 'race' },
    { name: 'Stonecunning', description: 'Add double proficiency to History checks related to stonework', source: 'race' }
  ],
  'Halfling': [
    { name: 'Lucky', description: 'Reroll natural 1s on attack rolls, ability checks, and saves', source: 'race' },
    { name: 'Brave', description: 'Advantage on saves against being frightened', source: 'race' },
    { name: 'Halfling Nimbleness', description: 'Move through space of larger creatures', source: 'race' }
  ],
  'Dragonborn': [
    { name: 'Draconic Ancestry', description: 'Choose a dragon type for breath weapon and resistance', source: 'race' },
    { name: 'Breath Weapon', description: 'Use breath weapon based on draconic ancestry', source: 'race' },
    { name: 'Damage Resistance', description: 'Resistance to damage type associated with draconic ancestry', source: 'race' }
  ],
  'Gnome': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Gnome Cunning', description: 'Advantage on mental saves against magic', source: 'race' }
  ],
  'Half-Elf': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Fey Ancestry', description: 'Advantage on saves against charm, immune to magical sleep', source: 'race' },
    { name: 'Extra Skills', description: 'Gain proficiency in two additional skills', source: 'race' }
  ],
  'Half-Orc': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Relentless Endurance', description: 'Drop to 1 HP instead of 0 once per long rest', source: 'race' },
    { name: 'Savage Attacks', description: 'Roll extra weapon damage die on critical hits', source: 'race' }
  ],
  'Tiefling': [
    { name: 'Darkvision', description: 'See in dim light within 60 feet', source: 'race' },
    { name: 'Hellish Resistance', description: 'Resistance to fire damage', source: 'race' },
    { name: 'Infernal Legacy', description: 'Know Thaumaturgy cantrip, gain spells at higher levels', source: 'race' }
  ]
};

// Class skill proficiencies (D&D 5e)
const CLASS_SKILLS: { [key: string]: string[] } = {
  'Barbarian': ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'],
  'Bard': ['Deception', 'History', 'Investigation', 'Persuasion', 'Performance', 'Sleight of Hand'], // Choose 3
  'Cleric': ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'],
  'Druid': ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
  'Fighter': ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'],
  'Monk': ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'],
  'Paladin': ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'],
  'Ranger': ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'],
  'Rogue': ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'],
  'Sorcerer': ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'],
  'Warlock': ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'],
  'Wizard': ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion']
};

// Number of skill proficiencies each class gets
const CLASS_SKILL_COUNT: { [key: string]: number } = {
  'Barbarian': 2, 'Bard': 3, 'Cleric': 2, 'Druid': 2, 'Fighter': 2, 'Monk': 2,
  'Paladin': 2, 'Ranger': 3, 'Rogue': 4, 'Sorcerer': 2, 'Warlock': 2, 'Wizard': 2
};

// Racial skill proficiencies (guaranteed)
const RACIAL_SKILLS: { [key: string]: string[] } = {
  'Elf': ['Perception'], // Keen Senses
  'Half-Elf': [], // Choose any 2 skills (handled specially)
  'Human': [], // Choose any 1 skill (handled specially)
  'Dwarf': [],
  'Halfling': [],
  'Dragonborn': [],
  'Gnome': [],
  'Half-Orc': [],
  'Tiefling': []
};

// D&D 5e Class Hit Dice (Player's Handbook)
const CLASS_HIT_DICE: { [key: string]: string } = {
  'Barbarian': 'd12',
  'Bard': 'd8',
  'Cleric': 'd8',
  'Druid': 'd8',
  'Fighter': 'd10',
  'Monk': 'd8',
  'Paladin': 'd10',
  'Ranger': 'd10',
  'Rogue': 'd8',
  'Sorcerer': 'd6',
  'Warlock': 'd8',
  'Wizard': 'd6'
};

// D&D 5e Class Spellcasting Abilities
const CLASS_SPELLCASTING_ABILITY: { [key: string]: string } = {
  'Bard': 'charisma',
  'Cleric': 'wisdom',
  'Druid': 'wisdom',
  'Paladin': 'charisma',
  'Ranger': 'wisdom',
  'Sorcerer': 'charisma',
  'Warlock': 'charisma',
  'Wizard': 'intelligence',
  // Non-spellcasters default to wisdom for multiclass scenarios
  'Barbarian': 'wisdom',
  'Fighter': 'intelligence', // Eldritch Knight uses INT
  'Monk': 'wisdom',
  'Rogue': 'intelligence' // Arcane Trickster uses INT
};

interface Character {
  name: string;
  class: string;
  race: string;
  background: string;
  alignment: string;
  level: number;
  trueName: string;
  age: string;
  raceGender: string;
  gender: string;
  mantra: string;
  birthplace: string;
  family: string;
  physique: string;
  likes: string;
  dislikes: string;
  flaws: string;
  nicknames: string;
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
    [key: string]: {
      proficient: boolean;
      expertise: boolean;
      source?: 'race' | 'class' | 'background' | 'manual' | 'auto';
      manualOverride?: boolean;
    };
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
  sorceryPoints: {
    max: number;
    used: number;
  };
  spellcastingAbility: 'Intelligence' | 'Wisdom' | 'Charisma';
  knownPreparedSpells: number;
  spellDC: number;
  spellAttack: number;
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
    type: string;
    finesse: boolean;
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
  const [masterSpellList, setMasterSpellList] = useState<any[]>([]);
  const [knownSpells, setKnownSpells] = useState<Set<number>>(new Set());
  const [spellSearchTerm, setSpellSearchTerm] = useState('');
  const [selectedSpellClass, setSelectedSpellClass] = useState('All Classes');
  const [selectedSpellLevels, setSelectedSpellLevels] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  const [hoveredSpell, setHoveredSpell] = useState<any>(null);
  const [knownSpellsOverride, setKnownSpellsOverride] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Custom spells state
  const [customSpells, setCustomSpells] = useState<{[level: number]: any[]}>({});

  const [spellSlots, setSpellSlots] = useState<{[key: number]: {max: number, used: number}}>({});

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
    armorClass: 0,
    initiative: 2,
    speed: 30,
    skills: {
      'Acrobatics': { proficient: false, expertise: false, source: 'manual' as const },
      'Animal Handling': { proficient: false, expertise: false, source: 'manual' as const },
      'Arcana': { proficient: false, expertise: false, source: 'manual' as const },
      'Athletics': { proficient: false, expertise: false, source: 'manual' as const },
      'Deception': { proficient: false, expertise: false, source: 'manual' as const },
      'History': { proficient: false, expertise: false, source: 'manual' as const },
      'Insight': { proficient: false, expertise: false, source: 'manual' as const },
      'Intimidation': { proficient: false, expertise: false, source: 'manual' as const },
      'Investigation': { proficient: false, expertise: false, source: 'manual' as const },
      'Medicine': { proficient: false, expertise: false, source: 'manual' as const },
      'Nature': { proficient: false, expertise: false, source: 'manual' as const },
      'Perception': { proficient: false, expertise: false, source: 'manual' as const },
      'Performance': { proficient: false, expertise: false, source: 'manual' as const },
      'Persuasion': { proficient: false, expertise: false, source: 'manual' as const },
      'Religion': { proficient: false, expertise: false, source: 'manual' as const },
      'Sleight of Hand': { proficient: false, expertise: false, source: 'manual' as const },
      'Stealth': { proficient: false, expertise: false, source: 'manual' as const },
      'Survival': { proficient: false, expertise: false, source: 'manual' as const },
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
    sorceryPoints: {
      max: 0,
      used: 0,
    },
    spellcastingAbility: 'Intelligence',
    knownPreparedSpells: 9,
    spellDC: 16,
    spellAttack: 8,
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
    trueName: 'Marcille Donato',
    age: '50 years old',
    raceGender: 'Half-Elf / Female',
    gender: 'Female',
    mantra: 'Knowledge is the greatest treasure',
    birthplace: 'Northern Continent',
    family: 'Mother',
    physique: 'Height, roughly 160cm',
    likes: 'Seafood, nuts',
    dislikes: 'Any sort of weird food',
    flaws: '',
    nicknames: '',
    weapons: [
      {
        name: '',
        type: 'Melee',
        finesse: false,
        proficient: false,
        notches: '',
        range: '',
        ability: 'STR',
        atkBonus: '',
        damage: ''
      },
      {
        name: '',
        type: 'Melee',
        finesse: false,
        proficient: false,
        notches: '',
        range: '',
        ability: 'STR',
        atkBonus: '',
        damage: ''
      }
    ],
    survivalConditions: {
      hunger: { stage: 'Ok', effect: 0 },
      thirst: { stage: 'Ok', effect: 0 },
      fatigue: { stage: 'Ok', effect: 0 },
      additionalExhaustion: 0,
      totalExhaustion: 0
    },
  });

  const getModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  // Calculate ASI bonuses from Feat/ASI choices
  const getAsiBonus = (ability: string): number => {
    let totalBonus = 0;
    Object.values(asiChoices).forEach(choice => {
      if (choice.type === 'ASI') {
        totalBonus += choice.abilityIncreases[ability as keyof typeof choice.abilityIncreases] || 0;
      }
    });
    return totalBonus;
  };

  // Get final ability score including ASI bonuses
  const getFinalAbilityScore = (ability: string): number => {
    const baseScore = character.abilityScores[ability as keyof typeof character.abilityScores] || 0;
    const asiBonus = getAsiBonus(ability);
    return baseScore + asiBonus;
  };

  // Calculate maximum HP based on HP rolls and bonuses
  const calculateMaxHP = (): number => {
    const constitutionModifier = getModifier(getFinalAbilityScore('constitution'));

    // Sum HP rolls for levels up to current level
    let totalHP = 0;
    for (let i = 0; i < character.level; i++) {
      const roll = hitPointRolls[i] || 0;
      totalHP += roll + constitutionModifier;
    }

    // Add Toughness feat bonus (+2 per level)
    if (hasToughness) {
      totalHP += character.level * 2;
    }

    // Add PHB Hill Dwarf bonus (+1 per level)
    if (isPHBHillDwarf) {
      totalHP += character.level;
    }

    // Add additional bonuses
    totalHP += additionalHPBonuses;

    return Math.max(1, totalHP); // Minimum 1 HP
  };

  // Automatically assign skills based on race and class
  const assignAutomaticSkills = () => {
    const newSkills = { ...character.skills };

    // Reset all auto-assigned skills first (preserve manual overrides)
    Object.keys(newSkills).forEach(skill => {
      if (newSkills[skill].source === 'race' || newSkills[skill].source === 'class') {
        if (!newSkills[skill].manualOverride) {
          newSkills[skill] = { proficient: false, expertise: false, source: 'manual' as const };
        }
      }
    });

    // Apply racial skill proficiencies
    const racialSkills = RACIAL_SKILLS[character.race] || [];
    racialSkills.forEach(skill => {
      if (newSkills[skill] && !newSkills[skill].manualOverride) {
        newSkills[skill] = {
          ...newSkills[skill],
          proficient: true,
          source: 'race'
        };
      }
    });

    // Apply class skill proficiencies (automatic selection of best skills)
    const classSkills = CLASS_SKILLS[character.class] || [];
    const skillCount = CLASS_SKILL_COUNT[character.class] || 0;

    if (classSkills.length > 0 && skillCount > 0) {
      // Auto-select the most commonly useful skills for each class
      const prioritySkills = getClassPrioritySkills(character.class);
      let assigned = 0;

      prioritySkills.forEach(skill => {
        if (assigned < skillCount && classSkills.includes(skill) && newSkills[skill] && !newSkills[skill].manualOverride) {
          newSkills[skill] = {
            ...newSkills[skill],
            proficient: true,
            source: 'class'
          };
          assigned++;
        }
      });
    }

    updateCharacter({ skills: newSkills });
  };

  // Priority skills for each class (most commonly useful)
  const getClassPrioritySkills = (className: string): string[] => {
    const priorities: { [key: string]: string[] } = {
      'Barbarian': ['Athletics', 'Perception'],
      'Bard': ['Persuasion', 'Deception', 'Performance'],
      'Cleric': ['Religion', 'Insight'],
      'Druid': ['Nature', 'Perception'],
      'Fighter': ['Athletics', 'Perception'],
      'Monk': ['Acrobatics', 'Stealth'],
      'Paladin': ['Athletics', 'Persuasion'],
      'Ranger': ['Survival', 'Perception', 'Stealth'],
      'Rogue': ['Stealth', 'Sleight of Hand', 'Perception', 'Investigation'],
      'Sorcerer': ['Arcana', 'Persuasion'],
      'Warlock': ['Arcana', 'Deception'],
      'Wizard': ['Arcana', 'Investigation']
    };
    return priorities[className] || [];
  };

  // Calculate hit dice based on class and level
  const calculateHitDice = () => {
    const hitDieType = CLASS_HIT_DICE[character.class] || 'd8';
    const calculatedHitDice = {
      d4: 0,
      d6: 0,
      d8: 0,
      d10: 0,
      d12: 0
    };

    // Set the appropriate die type based on class and level
    if (hitDieType === 'd4') calculatedHitDice.d4 = character.level;
    else if (hitDieType === 'd6') calculatedHitDice.d6 = character.level;
    else if (hitDieType === 'd8') calculatedHitDice.d8 = character.level;
    else if (hitDieType === 'd10') calculatedHitDice.d10 = character.level;
    else if (hitDieType === 'd12') calculatedHitDice.d12 = character.level;

    return calculatedHitDice;
  };

  // Format hit dice for display (e.g., "3d10")
  const formatHitDiceDisplay = () => {
    const hitDieType = CLASS_HIT_DICE[character.class] || 'd8';
    return `${character.level}${hitDieType}`;
  };

  // Calculate total initiative modifier
  const calculateInitiativeModifier = () => {
    let totalModifier = getModifier(getFinalAbilityScore('dexterity')); // Base Dexterity modifier

    // Alert feat: +5 to initiative
    if (initiativeModifiers.alert) {
      totalModifier += 5;
    }

    // Jack of All Trades: +half proficiency bonus (rounded down)
    if (initiativeModifiers.jackOfAllTrades) {
      totalModifier += Math.floor(character.proficiencyBonus / 2);
    }

    // Manual ability modifiers
    if (initiativeModifiers.wisMod) {
      totalModifier += getModifier(getFinalAbilityScore('wisdom'));
    }

    if (initiativeModifiers.intMod) {
      totalModifier += getModifier(getFinalAbilityScore('intelligence'));
    }

    if (initiativeModifiers.chaMod) {
      totalModifier += getModifier(getFinalAbilityScore('charisma'));
    }

    // Additional bonus
    totalModifier += initiativeModifiers.additionalBonus;

    return totalModifier;
  };

  // Get spellcasting ability for current class
  const getSpellcastingAbility = (): string => {
    return CLASS_SPELLCASTING_ABILITY[character.class] || 'wisdom';
  };

  // Calculate Spell Save DC (8 + proficiency bonus + spellcasting ability modifier)
  const calculateSpellDC = (): number => {
    const spellcastingAbility = getSpellcastingAbility();
    const abilityModifier = getModifier(getFinalAbilityScore(spellcastingAbility));
    return 8 + character.proficiencyBonus + abilityModifier;
  };

  // Calculate Spell Attack Bonus (proficiency bonus + spellcasting ability modifier)
  const calculateSpellAttack = (): number => {
    const spellcastingAbility = getSpellcastingAbility();
    const abilityModifier = getModifier(getFinalAbilityScore(spellcastingAbility));
    return character.proficiencyBonus + abilityModifier;
  };

  // Calculate known/prepared spells based on class, level, and ability modifier
  const calculateKnownSpells = (): number => {
    const characterClass = character.class.toLowerCase();
    const level = character.level;
    const spellcastingAbility = getSpellcastingAbility();
    const abilityModifier = Math.max(1, getModifier(getFinalAbilityScore(spellcastingAbility)));

    // D&D 5e spell progression by class
    const spellProgression: { [key: string]: (level: number, modifier: number) => number } = {
      'wizard': (level, modifier) => level === 1 ? 6 : Math.min(25, 6 + (level - 1) * 2), // Spells known from spellbook
      'sorcerer': (level, modifier) => {
        if (level === 1) return 2;
        if (level <= 3) return level + 1;
        if (level <= 5) return level + 2;
        if (level <= 7) return level + 3;
        if (level <= 9) return level + 4;
        return 15; // Max at level 10+
      },
      'bard': (level, modifier) => {
        if (level === 1) return 4;
        if (level <= 3) return level + 3;
        if (level <= 5) return level + 4;
        if (level <= 7) return level + 5;
        if (level <= 9) return level + 6;
        return 22; // Max at level 10+
      },
      'warlock': (level, modifier) => Math.min(15, Math.floor((level + 1) / 2) + 1),
      'ranger': (level, modifier) => level < 2 ? 0 : Math.min(11, Math.floor(level / 2) + 1),
      'paladin': (level, modifier) => level < 2 ? 0 : Math.floor(level / 2) + modifier,
      'eldritch knight': (level, modifier) => level < 3 ? 0 : Math.min(13, Math.floor((level - 2) / 3) + 2),
      'arcane trickster': (level, modifier) => level < 3 ? 0 : Math.min(13, Math.floor((level - 2) / 3) + 2),
      'cleric': (level, modifier) => level + modifier,
      'druid': (level, modifier) => level + modifier,
    };

    const calculator = spellProgression[characterClass] || spellProgression['cleric']; // Default to cleric progression
    return calculator(level, abilityModifier);
  };

  // Get effective known spells (override if set, otherwise calculated)
  const getEffectiveKnownSpells = (): number => {
    return knownSpellsOverride !== null ? knownSpellsOverride : calculateKnownSpells();
  };

  const getSkillModifier = (skill: string, ability: keyof typeof character.abilityScores): number => {
    const finalScore = getFinalAbilityScore(ability);
    const baseModifier = getModifier(finalScore);
    const skillData = character.skills[skill];
    let modifier = baseModifier;

    if (skillData.proficient) {
      modifier += character.proficiencyBonus;
    }
    if (skillData.expertise) {
      modifier += character.proficiencyBonus;
    }

    // Add any custom skill bonuses
    const skillBonus = skillBonuses.find(sb => sb.skill === skill);
    if (skillBonus) {
      modifier += skillBonus.bonus;
    }

    return modifier;
  };

  const getSaveModifier = (save: string, ability: keyof typeof character.abilityScores): number => {
    const finalScore = getFinalAbilityScore(ability);
    const baseModifier = getModifier(finalScore);
    return character.savingThrows[save] ? baseModifier + character.proficiencyBonus : baseModifier;
  };

  // Calculate weapon attack bonus based on ability, proficiency, and weapon bonus
  const calculateWeaponAttackBonus = (weapon: any): string => {
    const finalScore = getFinalAbilityScore(weapon.ability?.toLowerCase() || 'strength');
    const abilityScore = finalScore;
    const abilityMod = getModifier(abilityScore);
    const profBonus = weapon.proficient ? character.proficiencyBonus : 0;
    const weaponBonus = parseInt(weapon.notches?.replace(/[^-\d]/g, '')) || 0;
    const total = abilityMod + profBonus + weaponBonus;
    return total >= 0 ? `+${total}` : `${total}`;
  };

  // D&D 5e Armor Classifications
  const ARMOR_DATA: { [key: string]: { ac: number; type: 'Light' | 'Medium' | 'Heavy' | 'None'; maxDex?: number; stealthDis?: boolean } } = {
    'None': { ac: 10, type: 'None' },
    'Padded': { ac: 11, type: 'Light', stealthDis: true },
    'Leather': { ac: 11, type: 'Light' },
    'Studded Leather': { ac: 12, type: 'Light' },
    'Hide': { ac: 12, type: 'Medium', maxDex: 2 },
    'Chain Shirt': { ac: 13, type: 'Medium', maxDex: 2 },
    'Scale Mail': { ac: 14, type: 'Medium', maxDex: 2, stealthDis: true },
    'Breastplate': { ac: 14, type: 'Medium', maxDex: 2 },
    'Half Plate': { ac: 15, type: 'Medium', maxDex: 2, stealthDis: true },
    'Ring Mail': { ac: 14, type: 'Heavy', stealthDis: true },
    'Chain Mail': { ac: 16, type: 'Heavy', stealthDis: true },
    'Splint': { ac: 17, type: 'Heavy', stealthDis: true },
    'Plate': { ac: 18, type: 'Heavy', stealthDis: true }
  };

  const SHIELD_DATA: { [key: string]: { ac: number } } = {
    'None': { ac: 0 },
    'Shield': { ac: 2 },
    'Tower Shield': { ac: 3 },
    'Buckler': { ac: 1 }
  };

  // Calculate total AC based on D&D 5e rules
  const calculateTotalAC = (): number => {
    const armorName = armor.armorType.item || 'None';
    const shieldName = armor.shieldType.item || 'None';

    const armorData = ARMOR_DATA[armorName] || ARMOR_DATA['None'];
    const shieldData = SHIELD_DATA[shieldName] || SHIELD_DATA['None'];

    // Base AC from armor
    let totalAC = armorData.ac;

    // Add DEX modifier (with armor type limits)
    const dexMod = getModifier(character.abilityScores.dexterity);
    if (armorData.type === 'Light' || armorData.type === 'None') {
      totalAC += dexMod; // Full DEX mod
    } else if (armorData.type === 'Medium') {
      totalAC += Math.min(dexMod, armorData.maxDex || 2); // Max +2 DEX
    }
    // Heavy armor gets no DEX mod

    // Add shield AC
    totalAC += shieldData.ac;

    // Add magical bonuses
    const armorBonus = parseInt(armor.armorType.plus?.replace(/[^-\d]/g, '')) || 0;
    const shieldBonus = parseInt(armor.shieldType.plus?.replace(/[^-\d]/g, '')) || 0;
    const attireBonus = parseInt(armor.magicalAttire.plus?.replace(/[^-\d]/g, '')) || 0;

    totalAC += armorBonus + shieldBonus + attireBonus;

    return totalAC;
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

  // Helper functions to get equipped items by type
  const getEquippedItemsByType = (type: string) => {
    return equippedItems
      .filter(item => item.type === type && item.item.trim() !== '')
      .map(item => item.item);
  };

  const getArmorOptions = () => {
    const equippedArmor = getEquippedItemsByType('Armor');
    const defaultArmor = ['None', 'Padded', 'Leather', 'Studded Leather', 'Hide', 'Chain Shirt', 'Scale Mail', 'Breastplate', 'Half Plate', 'Ring Mail', 'Chain Mail', 'Splint', 'Plate'];
    return [...new Set([...defaultArmor, ...equippedArmor])];
  };

  const getArmorDisplayName = (armorName: string): string => {
    const armorData = ARMOR_DATA[armorName];
    if (!armorData || armorName === 'None') return armorName;

    const typeShort = armorData.type.charAt(0); // L, M, H
    const stealthIcon = armorData.stealthDis ? '👤' : '';
    return `${armorName} (${typeShort}${armorData.ac}${stealthIcon})`;
  };

  const getShieldOptions = () => {
    const equippedShields = getEquippedItemsByType('Shield');
    const defaultShields = ['None', 'Shield', 'Tower Shield', 'Buckler'];
    return [...new Set([...defaultShields, ...equippedShields])];
  };

  const getMagicalAttireOptions = () => {
    const equippedAttire = getEquippedItemsByType('Magical Attire');
    const defaultAttire = ['None', 'Cloak of Resistance', 'Boots of Speed', 'Ring of Protection', 'Amulet of Natural Armor', 'Belt of Giant Strength', 'Headband of Intellect', 'Gloves of Dexterity', 'Periapt of Wisdom', 'Cloak of Charisma'];
    return [...new Set([...defaultAttire, ...equippedAttire])];
  };

  const getWeaponOptions = () => {
    return getEquippedItemsByType('Weapon');
  };

  const getAmmunitionOptions = () => {
    return getEquippedItemsByType('Ammunition');
  };

  const handleImageUrlChange = (url: string, setImage: (value: string) => void) => {
    setImage(url);
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
    armorType: { item: 'Studded Leather', karuta: 'Armor Item', plus: '', notches: '' },
    shieldType: { item: 'None', karuta: '', plus: '', notches: '' },
    magicalAttire: { item1: 'None', item2: 'None', plus: '', notches: '', karuta: '' }
  });

  // Proficiencies state
  const [proficiencies, setProficiencies] = useState({
    armor: [] as string[],
    weapons: [] as string[],
    tools: [] as string[],
    languages: [] as string[]
  });

  // Image state
  const [statsImage, setStatsImage] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [backgroundBlur, setBackgroundBlur] = useState<number>(0);
  const [characterImage, setCharacterImage] = useState<string>('');

  // Vibe Effects state (ambiance effects)
  const [vibeEffects, setVibeEffects] = useState<string>('none');
  const [vibeOpacity, setVibeOpacity] = useState<number>(50);

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

  // Automatic Feat Tracking
  const [characterFeats, setCharacterFeats] = useState<Feat[]>([]);
  const [manualFeats, setManualFeats] = useState<Feat[]>([]);

  // Function to get automatic feats based on class and level
  const getAutomaticFeats = (characterClass: string, level: number, race: string): Feat[] => {
    const allFeats: Feat[] = [];

    // Add racial feats
    if (RACIAL_FEATS[race]) {
      allFeats.push(...RACIAL_FEATS[race]);
    }

    // Add class feats up to current level
    if (CLASS_FEATS[characterClass]) {
      for (let lvl = 1; lvl <= level; lvl++) {
        if (CLASS_FEATS[characterClass][lvl]) {
          allFeats.push(...CLASS_FEATS[characterClass][lvl]);
        }
      }
    }

    return allFeats;
  };

  // Function to add a manual feat
  const addManualFeat = (featName: string, description: string = '', level?: number) => {
    const newFeat: Feat = {
      name: featName,
      description: description || 'Custom feat',
      source: 'manual',
      level: level
    };
    setManualFeats(prev => [...prev, newFeat]);
  };

  // Function to remove a manual feat
  const removeManualFeat = (index: number) => {
    setManualFeats(prev => prev.filter((_, i) => i !== index));
  };

  // Function to add a custom spell
  const addCustomSpell = (level: number) => {
    const newSpell = {
      Name: '',
      name: '',
      Level: level,
      level: level,
      School: '',
      school: '',
      CastingTime: '',
      casting_time: '',
      Range: '',
      range: '',
      Duration: '',
      duration: '',
      Components: '',
      components: '',
      'Area or Targets': '',
      area_of_effect: '',
      'Save or Attack': '',
      save: '',
      Effect: '',
      description: '',
      effect: '',
      Tags: '',
      tags: '',
      isCustom: true,
      id: Date.now() + Math.random() // Unique ID
    };

    setCustomSpells(prev => ({
      ...prev,
      [level]: [...(prev[level] || []), newSpell]
    }));
  };

  // Function to remove a custom spell
  const removeCustomSpell = (level: number, spellId: string | number) => {
    setCustomSpells(prev => ({
      ...prev,
      [level]: (prev[level] || []).filter(spell => spell.id !== spellId)
    }));
  };

  // Function to update a custom spell
  const updateCustomSpell = (level: number, spellId: string | number, field: string, value: string) => {
    setCustomSpells(prev => ({
      ...prev,
      [level]: (prev[level] || []).map(spell =>
        spell.id === spellId
          ? { ...spell, [field]: value, [field.toLowerCase()]: value }
          : spell
      )
    }));
  };

  // Update automatic feats when character class, level, or race changes
  useEffect(() => {
    const autoFeats = getAutomaticFeats(character.class, character.level, character.race);
    setCharacterFeats(autoFeats);
  }, [character.class, character.level, character.race]);

  // Fantasy Calendar State
  const [currentDate, setCurrentDate] = useState({
    day: 14,
    season: 'Early Spring',
    year: 4122
  });

  // Weather State
  const [currentWeather, setCurrentWeather] = useState(0); // 0=morning, 1=day, 2=evening, 3=night, 4=rainy, 5=snowy

  // Pre-calculated random values for visual effects (to prevent hydration errors)
  const [effectParticles, setEffectParticles] = useState<Array<{
    left: number;
    top: number;
    width: number;
    height: number;
    duration: number;
    delay: number;
    rotation?: number;
    color?: string;
  }>>([]);

  // Load character data from localStorage on component mount
  useEffect(() => {
    const savedCharacter = localStorage.getItem('dnd-character-data');
    const savedActiveTab = localStorage.getItem('dnd-active-tab');
    const savedDarkMode = localStorage.getItem('dnd-dark-mode');
    const savedAsiChoices = localStorage.getItem('dnd-asi-choices');
    const savedImages = localStorage.getItem('dnd-images');
    const savedSpellList = localStorage.getItem('dnd-master-spell-list');
    const savedKnownSpells = localStorage.getItem('dnd-known-spells');
    const savedSpellSlots = localStorage.getItem('dnd-spell-slots');
    const savedKnownSpellsOverride = localStorage.getItem('dnd-known-spells-override');
    const savedManualFeats = localStorage.getItem('dnd-manual-feats');
    const savedCustomSpells = localStorage.getItem('dnd-custom-spells');
    const savedDeathSaves = localStorage.getItem('dnd-death-saves');
    const savedVibeEffects = localStorage.getItem('dnd-vibe-effects');

    if (savedCharacter) {
      try {
        const parsed = JSON.parse(savedCharacter);
        // Ensure sorceryPoints exists (migration for old data)
        if (!parsed.sorceryPoints) {
          parsed.sorceryPoints = { max: 0, used: 0 };
        }
        setCharacter(parsed);
      } catch (error) {
        console.warn('Failed to load character data from localStorage:', error);
      }
    }

    if (savedActiveTab) {
      setActiveTab(savedActiveTab);
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    if (savedAsiChoices) {
      try {
        setAsiChoices(JSON.parse(savedAsiChoices));
      } catch (error) {
        console.warn('Failed to load ASI choices from localStorage:', error);
      }
    }

    if (savedImages) {
      try {
        const images = JSON.parse(savedImages);
        if (images.statsImage) setStatsImage(images.statsImage);
        if (images.backgroundImage) setBackgroundImage(images.backgroundImage);
        if (images.characterImage) setCharacterImage(images.characterImage);
        if (images.backgroundBlur !== undefined) setBackgroundBlur(images.backgroundBlur);
      } catch (error) {
        console.warn('Failed to load images from localStorage:', error);
      }
    }

    // Load spell list from localStorage
    if (savedSpellList) {
      try {
        const spellList = JSON.parse(savedSpellList);
        setMasterSpellList(spellList);
      } catch (error) {
        console.warn('Failed to load spell list from localStorage:', error);
      }
    }

    // Load known spells from localStorage
    if (savedKnownSpells) {
      try {
        const knownSpellsArray = JSON.parse(savedKnownSpells);
        setKnownSpells(new Set(knownSpellsArray));
      } catch (error) {
        console.warn('Failed to load known spells from localStorage:', error);
      }
    }

    // Load spell slots from localStorage (but don't override calculated ones)
    if (savedSpellSlots) {
      try {
        const savedSlots = JSON.parse(savedSpellSlots);
        // Only load the 'used' values, keep the 'max' values from calculations
        setSpellSlots(prev => {
          const newSlots = { ...prev };
          Object.keys(savedSlots).forEach(level => {
            if (newSlots[parseInt(level)]) {
              newSlots[parseInt(level)].used = savedSlots[level].used || 0;
            }
          });
          return newSlots;
        });
      } catch (error) {
        console.warn('Failed to load spell slots from localStorage:', error);
      }
    }

    // Load known spells override from localStorage
    if (savedKnownSpellsOverride) {
      try {
        const override = parseInt(savedKnownSpellsOverride);
        setKnownSpellsOverride(isNaN(override) ? null : override);
      } catch (error) {
        console.warn('Failed to load known spells override from localStorage:', error);
      }
    }

    // Load manual feats from localStorage
    if (savedManualFeats) {
      try {
        const manualFeatsArray = JSON.parse(savedManualFeats);
        setManualFeats(manualFeatsArray);
      } catch (error) {
        console.warn('Failed to load manual feats from localStorage:', error);
      }
    }

    // Load custom spells from localStorage
    if (savedCustomSpells) {
      try {
        const customSpellsData = JSON.parse(savedCustomSpells);
        setCustomSpells(customSpellsData);
      } catch (error) {
        console.warn('Failed to load custom spells from localStorage:', error);
      }
    }

    // Load death saves from localStorage
    if (savedDeathSaves) {
      try {
        const deathSavesData = JSON.parse(savedDeathSaves);
        setDeathSaves(deathSavesData);
      } catch (error) {
        console.warn('Failed to load death saves from localStorage:', error);
      }
    }

    // Load vibe effects from localStorage
    if (savedVibeEffects) {
      try {
        const vibeData = JSON.parse(savedVibeEffects);
        setVibeEffects(vibeData.effect || 'none');
        setVibeOpacity(vibeData.opacity || 50);
      } catch (error) {
        console.warn('Failed to load vibe effects from localStorage:', error);
      }
    }

    // Load HP-related data from localStorage
    const savedHitPointRolls = localStorage.getItem('dnd-hit-point-rolls');
    if (savedHitPointRolls) {
      try {
        const rollsArray = JSON.parse(savedHitPointRolls);
        setHitPointRolls(rollsArray);
      } catch (error) {
        console.warn('Failed to load hit point rolls from localStorage:', error);
      }
    }

    const savedHPBonuses = localStorage.getItem('dnd-hp-bonuses');
    if (savedHPBonuses) {
      try {
        const hpData = JSON.parse(savedHPBonuses);
        setAdditionalHPBonuses(hpData.additionalHPBonuses || 0);
        setHasToughness(hpData.hasToughness || false);
        setIsPHBHillDwarf(hpData.isPHBHillDwarf || false);
      } catch (error) {
        console.warn('Failed to load HP bonuses from localStorage:', error);
      }
    }

    // Load Initiative modifiers from localStorage
    const savedInitiativeModifiers = localStorage.getItem('dnd-initiative-modifiers');
    if (savedInitiativeModifiers) {
      try {
        const initModifiers = JSON.parse(savedInitiativeModifiers);
        setInitiativeModifiers(initModifiers);
      } catch (error) {
        console.warn('Failed to load initiative modifiers from localStorage:', error);
      }
    }



    // Load Weather state from localStorage
    const savedWeather = localStorage.getItem('dnd-weather');
    if (savedWeather) {
      try {
        const weatherState = JSON.parse(savedWeather);
        setCurrentWeather(weatherState);
      } catch (error) {
        console.warn('Failed to load weather from localStorage:', error);
      }
    }

    // Load Calendar state from localStorage
    const savedCalendar = localStorage.getItem('dnd-calendar');
    if (savedCalendar) {
      try {
        const calendarData = JSON.parse(savedCalendar);
        setCurrentDate(prevDate => ({
          ...prevDate,
          season: calendarData.currentSeason !== undefined ? calendarData.currentSeason : prevDate.season,
          day: calendarData.currentDay !== undefined ? calendarData.currentDay : prevDate.day,
          year: calendarData.currentYear !== undefined ? calendarData.currentYear : prevDate.year
        }));
      } catch (error) {
        console.warn('Failed to load calendar from localStorage:', error);
      }
    }

    // Load skill bonuses from localStorage
    const savedSkillBonuses = localStorage.getItem('dnd-skill-bonuses');
    if (savedSkillBonuses) {
      try {
        setSkillBonuses(JSON.parse(savedSkillBonuses));
      } catch (error) {
        console.warn('Failed to load skill bonuses from localStorage:', error);
      }
    }

    // Load proficiencies from localStorage
    const savedProficiencies = localStorage.getItem('dnd-proficiencies');
    if (savedProficiencies) {
      try {
        setProficiencies(JSON.parse(savedProficiencies));
      } catch (error) {
        console.warn('Failed to load proficiencies from localStorage:', error);
      }
    }

    // Generate random particles for visual effects (client-side only)
    const generateParticles = (count: number, config: { colors?: string[] } = {}) => {
      const particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          left: Math.random() * 100,
          top: Math.random() * 100,
          width: 4 + Math.random() * 6,
          height: 4 + Math.random() * 6,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 3,
          rotation: Math.random() * 360,
          color: config.colors ? config.colors[Math.floor(Math.random() * config.colors.length)] : undefined
        });
      }
      return particles;
    };

    setEffectParticles(generateParticles(100, { colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'] }));
  }, []);

  // Save character data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dnd-character-data', JSON.stringify(character));
  }, [character]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('dnd-active-tab', activeTab);
  }, [activeTab]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('dnd-dark-mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save current weather to localStorage
  useEffect(() => {
    localStorage.setItem('dnd-weather', JSON.stringify(currentWeather));
  }, [currentWeather]);

  // Save ASI choices to localStorage
  useEffect(() => {
    localStorage.setItem('dnd-asi-choices', JSON.stringify(asiChoices));
  }, [asiChoices]);

  // Save known spells to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-known-spells', JSON.stringify([...knownSpells]));
    } catch (error) {
      console.warn('Failed to save known spells to localStorage:', error);
    }
  }, [knownSpells]);

  // Save spell slots to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-spell-slots', JSON.stringify(spellSlots));
    } catch (error) {
      console.warn('Failed to save spell slots to localStorage:', error);
    }
  }, [spellSlots]);

  // Save known spells override to localStorage
  useEffect(() => {
    try {
      if (knownSpellsOverride !== null) {
        localStorage.setItem('dnd-known-spells-override', knownSpellsOverride.toString());
      } else {
        localStorage.removeItem('dnd-known-spells-override');
      }
    } catch (error) {
      console.warn('Failed to save known spells override to localStorage:', error);
    }
  }, [knownSpellsOverride]);

  // Save manual feats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-manual-feats', JSON.stringify(manualFeats));
    } catch (error) {
      console.warn('Failed to save manual feats to localStorage:', error);
    }
  }, [manualFeats]);

  // Save custom spells to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-custom-spells', JSON.stringify(customSpells));
    } catch (error) {
      console.warn('Failed to save custom spells to localStorage:', error);
    }
  }, [customSpells]);

  // Save death saves to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-death-saves', JSON.stringify(deathSaves));
    } catch (error) {
      console.warn('Failed to save death saves to localStorage:', error);
    }
  }, [deathSaves]);

  // Save vibe effects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-vibe-effects', JSON.stringify({ effect: vibeEffects, opacity: vibeOpacity }));
    } catch (error) {
      console.warn('Failed to save vibe effects to localStorage:', error);
    }
  }, [vibeEffects, vibeOpacity]);

  // Auto-assign skills when race or class changes
  useEffect(() => {
    assignAutomaticSkills();
  }, [character.race, character.class]);

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
      case 1: // Day - Yellow sun with animated glow effect
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Animated background glow */}
              <div className="absolute w-16 h-16 rounded-full animate-pulse"
                   style={{
                     background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)'
                   }}></div>
              {/* Solid sun circle */}
              <div className="relative w-10 h-10 bg-yellow-400 rounded-full shadow-lg"></div>
            </div>
          </div>
        );
      case 2: // Evening - Orange/red sun with horizon line
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Animated background glow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-pulse"
                   style={{
                     background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(249, 115, 22, 0.2) 40%, rgba(251, 146, 60, 0.1) 70%, transparent 100%)'
                   }}></div>
              {/* Solid sun circle - positioned to be partially covered by horizon */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-orange-500 rounded-full shadow-lg"></div>
              {/* Horizon line covering bottom third */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-600 via-gray-700/50 to-transparent"></div>
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
      case 4: // Rainy - Storm cloud with rain
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Storm Cloud */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                {/* Main cloud body - darker for storm */}
                <div className="w-14 h-7 bg-gray-600 rounded-full relative shadow-lg">
                  {/* Cloud layers for depth */}
                  <div className="absolute -left-3 top-1 w-6 h-6 bg-gray-700 rounded-full"></div>
                  <div className="absolute -right-3 top-1 w-6 h-6 bg-gray-700 rounded-full"></div>
                  <div className="absolute left-2 -top-2 w-5 h-5 bg-gray-500 rounded-full"></div>
                  <div className="absolute right-2 -top-2 w-5 h-5 bg-gray-500 rounded-full"></div>
                  <div className="absolute left-4 -top-3 w-7 h-7 bg-gray-600 rounded-full"></div>
                  {/* Highlights for dimensionality */}
                  <div className="absolute left-1 top-0 w-3 h-2 bg-gray-400 rounded-full opacity-60"></div>
                  <div className="absolute right-1 top-0 w-3 h-2 bg-gray-400 rounded-full opacity-60"></div>
                </div>
              </div>
              {/* Rain drops - more realistic */}
              <div className="absolute top-8 left-5 w-0.5 h-5 bg-blue-400 rounded-full animate-pulse transform rotate-12"></div>
              <div className="absolute top-9 left-7 w-0.5 h-4 bg-blue-500 rounded-full animate-pulse transform rotate-6" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute top-8 left-9 w-0.5 h-5 bg-blue-400 rounded-full animate-pulse transform -rotate-6" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute top-10 left-6 w-0.5 h-3 bg-blue-500 rounded-full animate-pulse transform rotate-12" style={{animationDelay: '0.6s'}}></div>
              <div className="absolute top-8 left-11 w-0.5 h-4 bg-blue-400 rounded-full animate-pulse transform -rotate-12" style={{animationDelay: '0.8s'}}></div>
              <div className="absolute top-11 left-8 w-0.5 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        );
      case 5: // Snowy - Fluffy snow cloud
        return (
          <div className={iconStyle} onClick={cycleWeather}>
            <div className="relative w-full h-full">
              {/* Snow Cloud - Light and fluffy */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-13 h-7 bg-gray-200 rounded-full relative shadow-md">
                  {/* Cloud puffs for fluffy appearance */}
                  <div className="absolute -left-2 top-1 w-5 h-5 bg-white rounded-full"></div>
                  <div className="absolute -right-2 top-1 w-5 h-5 bg-white rounded-full"></div>
                  <div className="absolute left-1 -top-2 w-4 h-4 bg-white rounded-full opacity-90"></div>
                  <div className="absolute right-1 -top-2 w-4 h-4 bg-white rounded-full opacity-90"></div>
                  <div className="absolute left-3 -top-3 w-6 h-6 bg-white rounded-full"></div>
                  <div className="absolute right-3 -top-3 w-6 h-6 bg-white rounded-full"></div>
                  {/* Additional fluffy bits */}
                  <div className="absolute left-0 top-2 w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="absolute right-0 top-2 w-3 h-3 bg-gray-200 rounded-full"></div>
                  {/* Light highlights */}
                  <div className="absolute left-2 top-0 w-2 h-1 bg-white rounded-full opacity-80"></div>
                  <div className="absolute right-2 top-0 w-2 h-1 bg-white rounded-full opacity-80"></div>
                </div>
              </div>
              {/* Snowflakes - more detailed */}
              <div className="absolute top-8 left-4 text-white text-xs animate-bounce">❄</div>
              <div className="absolute top-10 left-6 text-white text-xs animate-bounce" style={{animationDelay: '0.3s'}}>❅</div>
              <div className="absolute top-9 left-8 text-white text-xs animate-bounce" style={{animationDelay: '0.6s'}}>❄</div>
              <div className="absolute top-11 left-5 text-white text-xs animate-bounce" style={{animationDelay: '0.9s'}}>❅</div>
              <div className="absolute top-8 left-10 text-white text-xs animate-bounce" style={{animationDelay: '1.2s'}}>❄</div>
              <div className="absolute top-12 left-7 text-white text-xs animate-bounce" style={{animationDelay: '1.5s'}}>❅</div>
              <div className="absolute top-10 left-9 text-white text-xs animate-bounce" style={{animationDelay: '1.8s'}}>❄</div>
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

  const [skillBonuses, setSkillBonuses] = useState<{ skill: string; bonus: number }[]>([]);

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

  // Helper function to get known spells for a specific level
  const getKnownSpellsForLevel = (level: number) => {
    const sortedSpells = masterSpellList.sort((a, b) => {
      // Handle invalid levels by treating them as level 0
      const levelA = isNaN(parseFloat(a.Level !== undefined ? a.Level : a.level)) ? 0 : parseFloat(a.Level !== undefined ? a.Level : a.level);
      const levelB = isNaN(parseFloat(b.Level !== undefined ? b.Level : b.level)) ? 0 : parseFloat(b.Level !== undefined ? b.Level : b.level);
      if (levelA !== levelB) return levelA - levelB;
      const nameA = a.Name || a.name || 'Unknown Spell';
      const nameB = b.Name || b.name || 'Unknown Spell';
      return nameA.localeCompare(nameB);
    });

    return sortedSpells
      .map((spell, index) => ({ spell, originalIndex: index }))
      .filter(({ spell, originalIndex }) => {
        const spellLevel = isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level)) ? 0 : parseFloat(spell.Level !== undefined ? spell.Level : spell.level);
        return spellLevel === level && knownSpells.has(originalIndex);
      })
      .map(({ spell }) => spell);
  };

  // Filter spells based on search term, class, and levels
  const getFilteredSpells = () => {
    return masterSpellList.filter(spell => {
      // Search term filter
      const searchMatch = spellSearchTerm === '' ||
        (spell.Name || spell.name || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
        (spell.School || spell.school || '').toLowerCase().includes(spellSearchTerm.toLowerCase()) ||
        (spell.Effect || spell.description || spell.effect || '').toLowerCase().includes(spellSearchTerm.toLowerCase());

      // Level filter
      const spellLevel = isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level)) ? 0 : parseFloat(spell.Level !== undefined ? spell.Level : spell.level);
      const levelMatch = selectedSpellLevels.has(spellLevel);

      // Class filter (simplified - would need actual spell class data)
      let classMatch = selectedSpellClass === 'All Classes' ||
        (spell.Classes && spell.Classes.includes(selectedSpellClass)) ||
        (spell.classes && spell.classes.includes(selectedSpellClass)) ||
        selectedSpellClass === 'All Classes';

      // Laserllama Alternate Ranger gets access to Ranger spells + expanded spell list
      if (selectedSpellClass === 'Ranger') {
        classMatch = classMatch ||
          (spell.Classes && spell.Classes.includes('Ranger')) ||
          (spell.classes && spell.classes.includes('Ranger')) ||
          // Additional utility and nature spells commonly added to Laserllama Ranger
          (spell.Name && ['Mending', 'Guidance', 'Resistance', 'Thaumaturgy', 'Create or Destroy Water', 'Purify Food and Drink', 'Detect Poison and Disease', 'Lesser Restoration', 'Zone of Truth', 'Water Breathing', 'Water Walk', 'Dispel Magic', 'Remove Curse'].includes(spell.Name)) ||
          (spell.name && ['Mending', 'Guidance', 'Resistance', 'Thaumaturgy', 'Create or Destroy Water', 'Purify Food and Drink', 'Detect Poison and Disease', 'Lesser Restoration', 'Zone of Truth', 'Water Breathing', 'Water Walk', 'Dispel Magic', 'Remove Curse'].includes(spell.name));
      }

      return searchMatch && levelMatch && classMatch;
    });
  };

  // Calculate spell slots based on character class and level
  const calculateSpellSlots = (characterClass: string, level: number) => {
    const spellSlotTable: {[key: string]: {[level: number]: number[]}} = {
      // [level]: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th]
      'Wizard': {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
      },
      'Sorcerer': {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
      },
      'Cleric': {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
      },
      'Bard': {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
      },
      'Druid': {
        1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
        13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
        15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
        17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
        18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
        19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
        20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
      },
      'Paladin': {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0]
      },
      'Ranger': {
        1: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0]
      },
      'Warlock': {
        1: [1, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [0, 2, 0, 0, 0, 0, 0, 0, 0],
        4: [0, 2, 0, 0, 0, 0, 0, 0, 0],
        5: [0, 0, 2, 0, 0, 0, 0, 0, 0],
        6: [0, 0, 2, 0, 0, 0, 0, 0, 0],
        7: [0, 0, 0, 2, 0, 0, 0, 0, 0],
        8: [0, 0, 0, 2, 0, 0, 0, 0, 0],
        9: [0, 0, 0, 0, 2, 0, 0, 0, 0],
        10: [0, 0, 0, 0, 2, 0, 0, 0, 0],
        11: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        12: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        13: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        14: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        15: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        16: [0, 0, 0, 0, 3, 0, 0, 0, 0],
        17: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        18: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        19: [0, 0, 0, 0, 4, 0, 0, 0, 0],
        20: [0, 0, 0, 0, 4, 0, 0, 0, 0]
      }
    };

    const slots = spellSlotTable[characterClass]?.[level] || [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const result: {[key: number]: {max: number, used: number}} = {};

    slots.forEach((maxSlots, index) => {
      if (maxSlots > 0) {
        result[index + 1] = { max: maxSlots, used: 0 };
      }
    });

    return result;
  };

  // Determine which spell levels a character can access based on class and level
  const getAccessibleSpellLevels = (characterClass: string, level: number): number[] => {
    const accessibleLevels = [0]; // Cantrips are always accessible for spellcasters

    // Non-spellcasters
    if (['Fighter', 'Barbarian', 'Rogue', 'Monk'].includes(characterClass)) {
      // Eldritch Knight (Fighter) and Arcane Trickster (Rogue) get spells at level 3
      if ((characterClass === 'Fighter' || characterClass === 'Rogue') && level >= 3) {
        // These subclasses learn spells more slowly than full casters
        if (level >= 3) accessibleLevels.push(1);
        if (level >= 7) accessibleLevels.push(2);
        if (level >= 13) accessibleLevels.push(3);
        if (level >= 19) accessibleLevels.push(4);
      }
      return accessibleLevels;
    }

    // Alternate Rangers start casting at level 1
    if (characterClass === 'Ranger') {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 5) accessibleLevels.push(2);
      if (level >= 9) accessibleLevels.push(3);
      if (level >= 13) accessibleLevels.push(4);
      if (level >= 17) accessibleLevels.push(5);
      return accessibleLevels;
    }

    // Paladins start casting at level 2
    if (characterClass === 'Paladin') {
      if (level >= 2) accessibleLevels.push(1);
      if (level >= 5) accessibleLevels.push(2);
      if (level >= 9) accessibleLevels.push(3);
      if (level >= 13) accessibleLevels.push(4);
      if (level >= 17) accessibleLevels.push(5);
      return accessibleLevels;
    }

    // Warlocks have unique spell progression
    if (characterClass === 'Warlock') {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 3) accessibleLevels.push(2);
      if (level >= 5) accessibleLevels.push(3);
      if (level >= 7) accessibleLevels.push(4);
      if (level >= 9) accessibleLevels.push(5);
      // Warlocks don't get 6th+ level spells through their pact magic
      return accessibleLevels;
    }

    // Full casters (Wizard, Sorcerer, Cleric, Bard, Druid)
    if (['Wizard', 'Sorcerer', 'Cleric', 'Bard', 'Druid'].includes(characterClass)) {
      if (level >= 1) accessibleLevels.push(1);
      if (level >= 3) accessibleLevels.push(2);
      if (level >= 5) accessibleLevels.push(3);
      if (level >= 7) accessibleLevels.push(4);
      if (level >= 9) accessibleLevels.push(5);
      if (level >= 11) accessibleLevels.push(6);
      if (level >= 13) accessibleLevels.push(7);
      if (level >= 15) accessibleLevels.push(8);
      if (level >= 17) accessibleLevels.push(9);
      return accessibleLevels;
    }

    return accessibleLevels;
  };

  // Functions for spell slot management
  const castSpell = (spellLevel: number) => {
    setSpellSlots(prev => {
      const newSlots = { ...prev };
      if (newSlots[spellLevel] && newSlots[spellLevel].used < newSlots[spellLevel].max) {
        newSlots[spellLevel].used += 1;
      }
      return newSlots;
    });
  };

  const shortRest = () => {
    // Warlocks restore all spell slots on short rest
    if (character.class === 'Warlock') {
      setSpellSlots(prev => {
        const newSlots = { ...prev };
        Object.keys(newSlots).forEach(level => {
          newSlots[parseInt(level)].used = 0;
        });
        return newSlots;
      });
    }
  };

  const longRest = () => {
    // All classes restore all spell slots on long rest
    setSpellSlots(prev => {
      const newSlots = { ...prev };
      Object.keys(newSlots).forEach(level => {
        newSlots[parseInt(level)].used = 0;
      });
      return newSlots;
    });
  };

  // Update spell slots when character class or level changes
  useEffect(() => {
    const newSlots = calculateSpellSlots(character.class, character.level);
    setSpellSlots(newSlots);
  }, [character.class, character.level]);

  // Inventory management state
  const [encumbrance, setEncumbrance] = useState({
    openSlots: 18,
    maxSlots: 18,
    yourBulk: 0,
    status: 'Normal'
  });

  // Calculate inventory slots based on creature size and STR modifier
  const calculateMaxSlots = () => {
    const strMod = getModifier(character.abilityScores.strength);
    const sizeData = {
      'Tiny': { base: 6, strMultiplier: 1 },
      'Small': { base: 14, strMultiplier: 1 },
      'Medium': { base: 18, strMultiplier: 1 },
      'Large': { base: 22, strMultiplier: 2 },
      'Huge': { base: 30, strMultiplier: 4 },
      'Gargantuan': { base: 46, strMultiplier: 8 }
    };

    const size = sizeData[carryingSize as keyof typeof sizeData];
    return size.base + (strMod * size.strMultiplier);
  };

  // Calculate minimum bulk based on creature size
  const calculateMinBulk = () => {
    const minBulkBySize = {
      'Tiny': 5,
      'Small': 10,
      'Medium': 20,
      'Large': 40,
      'Huge': 80,
      'Gargantuan': 160
    };
    return minBulkBySize[carryingSize as keyof typeof minBulkBySize];
  };

  // Calculate encumbrance status
  const calculateEncumbranceStatus = (currentBulk?: number) => {
    const maxSlots = calculateMaxSlots();
    const bulk = currentBulk !== undefined ? currentBulk : calculateYourBulk();
    const maxCapacity = maxSlots + Math.floor(maxSlots / 2);

    if (bulk <= maxSlots) {
      return 'Normal';
    } else if (bulk <= maxCapacity) {
      return 'Encumbered';
    } else {
      return 'Overloaded';
    }
  };

  // Calculate effective speed with encumbrance penalty
  const getEffectiveSpeed = (baseSpeed: number) => {
    if (encumbrance.status === 'Encumbered' || encumbrance.status === 'Overloaded') {
      return Math.floor(baseSpeed / 2);
    }
    return baseSpeed;
  };

  // Calculate total bulk from all inventory sources
  const calculateInventoryBulk = () => {
    let totalBulk = 0;

    // Add bulk from equipped items
    totalBulk += equippedItems.reduce((sum, item) => sum + (item.bulk || 0), 0);

    // Add bulk from inventory items
    totalBulk += inventoryItems.reduce((sum, item) => sum + (item.bulk || 0), 0);

    // Add bulk from purse (coins) - 50 coins = 1 bulk
    totalBulk += calculatePurseBulk();

    // Add bulk from ration box
    totalBulk += rationBox.totalBulk;

    // Add bulk from waterskin box
    totalBulk += waterskinBox.totalBulk;

    return totalBulk;
  };

  // Calculate Your Bulk using the D&D formula
  const calculateYourBulk = () => {
    const maxSlots = calculateMaxSlots();
    const inventoryBulk = calculateInventoryBulk();
    const usedSlots = inventoryBulk; // Used slots = inventory bulk
    const minBulk = calculateMinBulk();

    return Math.max(minBulk, usedSlots);
  };


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
    bagOfHolding: { owned: '', slots: 6 },
    portableHole: { owned: '', slots: 9 },
    handyHaversack: { owned: '', slots: 12 },
    quiverOfEhlonna: { owned: '', slots: 9 }
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

  const itemTypes = ['Armor', 'Ammunition', 'Attire', 'Ring', 'Shield', 'Weapon', 'Spell Focus'];

  // Save inventory data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-equipped-items', JSON.stringify(equippedItems));
    } catch (error) {
      console.warn('Failed to save equipped items to localStorage:', error);
    }
  }, [equippedItems]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-attuned-items', JSON.stringify(attunedItems));
    } catch (error) {
      console.warn('Failed to save attuned items to localStorage:', error);
    }
  }, [attunedItems]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-inventory-items', JSON.stringify(inventoryItems));
    } catch (error) {
      console.warn('Failed to save inventory items to localStorage:', error);
    }
  }, [inventoryItems]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-external-storage', JSON.stringify(externalStorage));
    } catch (error) {
      console.warn('Failed to save external storage to localStorage:', error);
    }
  }, [externalStorage]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-ammunition', JSON.stringify(ammunition));
    } catch (error) {
      console.warn('Failed to save ammunition to localStorage:', error);
    }
  }, [ammunition]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-armor', JSON.stringify(armor));
    } catch (error) {
      console.warn('Failed to save armor to localStorage:', error);
    }
  }, [armor]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-proficiencies', JSON.stringify(proficiencies));
    } catch (error) {
      console.warn('Failed to save proficiencies to localStorage:', error);
    }
  }, [proficiencies]);

  // Save resource tracking data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-purse', JSON.stringify(purse));
    } catch (error) {
      console.warn('Failed to save purse to localStorage:', error);
    }
  }, [purse]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-ration-box', JSON.stringify(rationBox));
    } catch (error) {
      console.warn('Failed to save ration box to localStorage:', error);
    }
  }, [rationBox]);

  useEffect(() => {
    try {
      localStorage.setItem('dnd-waterskin-box', JSON.stringify(waterskinBox));
    } catch (error) {
      console.warn('Failed to save waterskin box to localStorage:', error);
    }
  }, [waterskinBox]);

  // Save speeds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-speeds', JSON.stringify(speeds));
    } catch (error) {
      console.warn('Failed to save speeds to localStorage:', error);
    }
  }, [speeds]);

  // Save skill bonuses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-skill-bonuses', JSON.stringify(skillBonuses));
    } catch (error) {
      console.warn('Failed to save skill bonuses to localStorage:', error);
    }
  }, [skillBonuses]);

  // Save images to localStorage with error handling
  useEffect(() => {
    const images = {
      statsImage,
      backgroundImage,
      characterImage,
      backgroundBlur
    };

    try {
      const imageData = JSON.stringify(images);
      // Check if the data size is too large (approximate check)
      if (imageData.length > 5000000) { // 5MB limit
        console.warn('Image data too large for localStorage, skipping save');
        // Clear previous saved images if they exist
        localStorage.removeItem('dnd-images');
        return;
      }
      localStorage.setItem('dnd-images', imageData);
    } catch (error) {
      if (error instanceof DOMException && error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        console.warn('localStorage quota exceeded, clearing image data');
        // Clear all images from localStorage to free up space
        localStorage.removeItem('dnd-images');
        // Optionally notify user
        alert('Image storage limit exceeded. Please use smaller images or fewer images.');
      } else {
        console.warn('Failed to save images to localStorage:', error);
      }
    }
  }, [statsImage, backgroundImage, characterImage, backgroundBlur]);

  // Save HP-related data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dnd-hit-point-rolls', JSON.stringify(hitPointRolls));
    } catch (error) {
      console.warn('Failed to save hit point rolls to localStorage:', error);
    }
  }, [hitPointRolls]);

  useEffect(() => {
    try {
      const hpData = {
        additionalHPBonuses,
        hasToughness,
        isPHBHillDwarf
      };
      localStorage.setItem('dnd-hp-bonuses', JSON.stringify(hpData));
    } catch (error) {
      console.warn('Failed to save HP bonuses to localStorage:', error);
    }
  }, [additionalHPBonuses, hasToughness, isPHBHillDwarf]);

  // Update encumbrance calculations when dependencies change
  useEffect(() => {
    const newMaxSlots = calculateMaxSlots();
    const inventoryBulk = calculateInventoryBulk();
    const newOpenSlots = newMaxSlots - inventoryBulk;
    const newYourBulk = calculateYourBulk();
    const newStatus = calculateEncumbranceStatus(newYourBulk);

    setEncumbrance(prev => ({
      ...prev,
      maxSlots: newMaxSlots,
      openSlots: newOpenSlots,
      yourBulk: newYourBulk,
      status: newStatus
    }));
  }, [
    character.abilityScores.strength,
    carryingSize,
    equippedItems,
    inventoryItems,
    purse,
    rationBox.totalBulk,
    waterskinBox.totalBulk
  ]);

  const addEquippedItem = () => {
    setEquippedItems([...equippedItems, { type: '', item: '', itemBonus: '', range: '', notches: '', valueSP: 0, bulk: 0, reqAtt: false }]);
  };

  // Integration function to sync equipped items with other systems
  const syncEquippedItemToSystems = (equippedItem: any, index: number) => {
    const { type, item, itemBonus, notches } = equippedItem;

    switch (type) {
      case 'Armor':
        setArmor(prev => ({
          ...prev,
          armorType: {
            item: item || prev.armorType.item,
            karuta: item ? 'Armor Item' : prev.armorType.karuta,
            plus: itemBonus || prev.armorType.plus,
            notches: notches || prev.armorType.notches
          }
        }));
        break;

      case 'Shield':
        setArmor(prev => ({
          ...prev,
          shieldType: {
            item: item || prev.shieldType.item,
            karuta: item ? `${item}` : prev.shieldType.karuta,
            plus: itemBonus || prev.shieldType.plus,
            notches: notches || prev.shieldType.notches
          }
        }));
        break;

      case 'Attire':
        setArmor(prev => ({
          ...prev,
          magicalAttire: {
            item1: item || prev.magicalAttire.item1,
            item2: prev.magicalAttire.item2,
            plus: itemBonus || prev.magicalAttire.plus,
            notches: notches || prev.magicalAttire.notches,
            karuta: prev.magicalAttire.karuta
          }
        }));
        break;

      case 'Ammunition':
        // Find first empty ammunition slot or update existing
        setAmmunition(prev => {
          const newAmmunition = [...prev];
          const emptyIndex = newAmmunition.findIndex(ammo => ammo.name === '');
          if (emptyIndex !== -1) {
            newAmmunition[emptyIndex] = {
              name: item || '',
              weapon: '', // User can fill this in manually
              amount: itemBonus || '' // Using bonus field for amount
            };
          } else if (newAmmunition.length > 0) {
            // Update first slot if no empty slots
            newAmmunition[0] = {
              name: item || newAmmunition[0].name,
              weapon: newAmmunition[0].weapon,
              amount: itemBonus || newAmmunition[0].amount
            };
          }
          return newAmmunition;
        });
        break;

      case 'Weapon':
        // For weapons, we could potentially add them to a weapons system if it exists
        // For now, this will just keep them in equipped items
        break;

      default:
        // Other item types stay in equipped items only
        break;
    }
  };

  const removeEquippedItem = () => {
    if (equippedItems.length > 1) {
      setEquippedItems(equippedItems.slice(0, -1));
    }
  };

  const addInventoryItem = () => {
    setInventoryItems([...inventoryItems, { item: '', details: '', amount: 0, valueSP: 0, bulk: 0 }]);
  };

  const removeInventoryItem = () => {
    if (inventoryItems.length > 1) {
      setInventoryItems(inventoryItems.slice(0, -1));
    }
  };

  const addExternalStorageItem = () => {
    setExternalStorage([...externalStorage, { item: '', bulk: 0, location: '' }]);
  };

  const removeExternalStorageItem = () => {
    if (externalStorage.length > 1) {
      setExternalStorage(externalStorage.slice(0, -1));
    }
  };

  const unlockAttunementSlot = (slotNumber: number) => {
    setAttunedItems(attunedItems.map(slot => 
      slot.slot === slotNumber ? { ...slot, unlocked: true } : slot
    ));
  };

  const tabs = ['Stats', 'Inventory', 'Character', 'Spells', 'Library', 'Data'];

  // Save initiative modifiers to localStorage
  useEffect(() => {
    if (initiativeModifiers) {
      localStorage.setItem('dnd-initiative-modifiers', JSON.stringify(initiativeModifiers));
    }
  }, [initiativeModifiers]);


  return (
    <div 
      className={`min-h-screen p-4 font-sans relative ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-200 text-black'}`}
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

      {/* Vibe Effects Overlay */}
      {vibeEffects !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            opacity: vibeOpacity / 100,
            zIndex: 5
          }}
        >
          {vibeEffects === 'rain' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-blue-400"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: '2px',
                    height: `${20 + particle.width}px`,
                    animation: `fall ${0.5 + particle.duration * 0.25}s linear infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'snow' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: `${particle.width}px`,
                    height: `${particle.height}px`,
                    animation: `fall ${particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'stars' && (
            <div className="absolute inset-0">
              {effectParticles.map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${1 + particle.width * 0.2}px`,
                    height: `${1 + particle.height * 0.2}px`,
                    animation: `twinkle ${1 + particle.duration * 0.5}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'magic' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 30).map((particle, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                    width: `${10 + particle.width * 2}px`,
                    height: `${10 + particle.height * 2}px`,
                    background: `radial-gradient(circle, ${particle.color || '#a855f7'} 0%, transparent 70%)`,
                    animation: `float ${3 + particle.duration * 1.5}s ease-in-out infinite`,
                    animationDelay: `${particle.delay}s`
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'leaves' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 40).map((particle, i) => {
                const colors = ['#d97706', '#dc2626', '#ea580c', '#92400e'];
                return (
                  <div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `${particle.left}%`,
                      top: `-${particle.top}px`,
                      width: `${8 + particle.width}px`,
                      height: `${6 + particle.height * 0.8}px`,
                      backgroundColor: particle.color || colors[i % colors.length],
                      animation: `fallSway ${3 + particle.duration}s linear infinite`,
                      animationDelay: `${particle.delay}s`,
                      transform: `rotate(${particle.rotation}deg)`
                    }}
                  />
                );
              })}
            </div>
          )}

          {vibeEffects === 'embers' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 30).map((particle, i) => {
                const colors = ['#dc2626', '#ea580c', '#f97316', '#fb923c', '#fbbf24', '#fcd34d'];
                const emberColor = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${particle.left}%`,
                      bottom: `-${particle.top * 0.5}px`,
                      width: `${3 + particle.width * 0.5}px`,
                      height: `${3 + particle.height * 0.5}px`,
                      backgroundColor: emberColor,
                      boxShadow: `0 0 ${8 + particle.width}px ${emberColor}`,
                      animation: `rise ${4 + particle.duration}s ease-in infinite`,
                      animationDelay: `${particle.delay}s`
                    }}
                  />
                );
              })}
            </div>
          )}

          {vibeEffects === 'ash' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 50).map((particle, i) => (
                <div
                  key={i}
                  className="absolute bg-gray-600 rounded-sm"
                  style={{
                    left: `${particle.left}%`,
                    top: `-${particle.top}px`,
                    width: `${2 + particle.width * 0.4}px`,
                    height: `${2 + particle.height * 0.4}px`,
                    animation: `fallSway ${3 + particle.duration}s linear infinite`,
                    animationDelay: `${particle.delay}s`,
                    opacity: 0.6
                  }}
                />
              ))}
            </div>
          )}

          {vibeEffects === 'desert' && (
            <div className="absolute inset-0">
              {effectParticles.slice(0, 60).map((particle, i) => {
                const colors = ['#d4a574', '#c19a6b', '#b8956a', '#d2b48c', '#c8ad7f'];
                const sandColor = colors[i % colors.length];
                return (
                  <div
                    key={i}
                    className="absolute rounded-sm"
                    style={{
                      left: `-${particle.left * 0.5}%`,
                      top: `${particle.top * 0.8}%`,
                      width: `${1 + particle.width * 0.3}px`,
                      height: `${1 + particle.height * 0.3}px`,
                      backgroundColor: sandColor,
                      animation: `blowSand ${2 + particle.duration * 0.5}s linear infinite`,
                      animationDelay: `${particle.delay}s`,
                      opacity: 0.7
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fallSway {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(25vh) translateX(20px) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(-10px) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(15px) rotate(270deg);
          }
          100% {
            transform: translateY(100vh) translateX(0) rotate(360deg);
          }
        }
        @keyframes rise {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-50vh) translateX(20px);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) translateX(0);
            opacity: 0;
          }
        }
        @keyframes blowSand {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0.3;
          }
          25% {
            transform: translateX(30vw) translateY(-10px);
            opacity: 0.7;
          }
          50% {
            transform: translateX(60vw) translateY(5px);
            opacity: 0.9;
          }
          75% {
            transform: translateX(90vw) translateY(-5px);
            opacity: 0.6;
          }
          100% {
            transform: translateX(120vw) translateY(0);
            opacity: 0;
          }
        }
      `}</style>

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
            <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'} border-2 border-orange-500 rounded-lg shadow-xl p-3`}>
              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Level, Portrait & Character Info */}
                <div className="flex items-center gap-6">
                  {/* Level */}
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-lg p-4 text-center`}>
                    <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{character.level}</div>
                    <div className="text-sm text-gray-400">Level</div>
                  </div>

                  {/* Character Portrait with Frame */}
                  <div className="relative">
                    <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-br from-orange-500 to-amber-600' : 'bg-gradient-to-br from-orange-400 to-amber-500'} rounded-lg blur-sm opacity-40`}></div>
                    <div className={`relative w-32 h-32 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-lg p-1`}>
                      <div className={`w-full h-full ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} rounded-md border-2 flex items-center justify-center overflow-hidden`}>
                        {statsImage ? (
                          <img
                            src={statsImage}
                            alt="Character portrait"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl text-gray-400">IMG</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <input
                      type="text"
                      value={character.name}
                      onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                      className={`text-2xl font-bold text-orange-400 mb-1 bg-transparent border-b-2 border-transparent hover:border-orange-400/30 focus:border-orange-400 focus:outline-none transition-colors w-full`}
                      placeholder="Character Name"
                    />
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {character.race} {character.class} • {character.alignment}
                    </p>
                  </div>
                </div>

                {/* Right Column - Ability Scores */}
                <div className="flex items-center justify-end gap-2 h-32">
                  {Object.entries(character.abilityScores).map(([ability, score], index) => {
                    const finalScore = getFinalAbilityScore(ability);
                    const asiBonus = getAsiBonus(ability);
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
                      <div
                        key={ability}
                        className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} ${borderColors[index]} rounded-xl border-2 px-2 py-1 text-center shadow-lg transform transition-transform hover:scale-105 min-w-16 relative group`}
                        title={asiBonus > 0 ? `Base: ${score} + ASI: ${asiBonus} = Total: ${finalScore}` : `Score: ${score}`}
                      >
                        <div className={`text-xs font-bold ${textColors[index]} mb-1`}>{ability.slice(0, 3).toUpperCase()}</div>
                        <input
                          type="number"
                          value={asiBonus > 0 ? finalScore : score}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            if (asiBonus > 0) {
                              // If there's an ASI bonus, update the base score by subtracting the ASI bonus
                              updateCharacter({
                                abilityScores: { ...character.abilityScores, [ability]: newValue - asiBonus }
                              });
                            } else {
                              // No ASI bonus, update directly
                              updateCharacter({
                                abilityScores: { ...character.abilityScores, [ability]: newValue }
                              });
                            }
                          }}
                          className={`w-full text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} bg-transparent border-0 text-center rounded-lg py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 ${isDarkMode ? 'focus:bg-slate-600/50' : 'focus:bg-gray-300/50'}`}
                        />
                        <div className={`text-sm font-semibold ${isDarkMode ? 'text-white/90' : 'text-gray-700'} mt-1`}>
                          {getModifier(finalScore) >= 0 ? '+' : ''}{getModifier(finalScore)}
                        </div>

                        {/* Hover tooltip for ASI breakdown */}
                        {asiBonus > 0 && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                            <div className="bg-slate-800 border border-orange-500 rounded px-2 py-1 text-xs whitespace-nowrap">
                              <div className="text-white">Base: {score}</div>
                              <div className="text-green-400">ASI: +{asiBonus}</div>
                              <div className="text-orange-400 border-t border-slate-600 pt-1">Total: {finalScore}</div>
                            </div>
                          </div>
                        )}
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
                <div className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
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
                              : isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-400'
                          }`}>
                            <div className="flex items-center gap-1">
                              <input
                                id={`saving-throw-${save}`}
                                type="checkbox"
                                checked={proficient}
                                onChange={(e) => updateCharacter({
                                  savingThrows: { ...character.savingThrows, [save]: e.target.checked }
                                })}
                                className="w-3 h-3 accent-green-500 rounded focus:ring-2 focus:ring-green-400"
                              />
                              <span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{abbreviations[save]}</span>
                            </div>
                            <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{modifier >= 0 ? '+' : ''}{modifier}</span>
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
                <div className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="pb-8 space-y-3">
                    {/* Passive Perception */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">👁️</span>
                        <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Passive Perception</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-blue-400">
                        {10 + getSkillModifier('Perception', 'wisdom')}
                      </span>
                    </div>
                    
                    {/* Passive Investigation */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">🔍</span>
                        <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Passive Investigation</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-purple-400">
                        {10 + getSkillModifier('Investigation', 'intelligence')}
                      </span>
                    </div>
                    
                    {/* Passive Insight */}
                    <div className={`flex items-center justify-between px-2 py-1 rounded-full border-2 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-400'} transform transition-all duration-200 hover:scale-105`}>
                      <div className="flex items-center">
                        <span className="mr-1 text-xs">🧠</span>
                        <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Passive Insight</span>
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
                <div className={`p-3 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="pb-8 space-y-3">
                    <div className={`grid grid-cols-10 gap-1 text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
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
                          className={`col-span-3 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="Ammo name"
                        />
                        <input
                          type="text"
                          value={ammo.weapon}
                          onChange={(e) => updateAmmunition(index, 'weapon', e.target.value)}
                          className={`col-span-4 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="Weapon"
                        />
                        <input
                          type="text"
                          value={ammo.amount}
                          onChange={(e) => updateAmmunition(index, 'amount', e.target.value)}
                          className={`col-span-3 text-center border rounded px-2 py-1 text-xs transition-all duration-200 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="Dice/Qty"
                        />
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
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="grid grid-cols-2 gap-2 pb-8 max-w-xs mx-auto">
                    <div className="text-center">
                      <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>AC</div>
                      <input
                        type="number"
                        value={character.armorClass || calculateTotalAC()}
                        onChange={(e) => updateCharacter({ armorClass: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold animate-[pulse_0.3s_ease-in-out] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          character.armorClass
                            ? (isDarkMode ? 'bg-yellow-700 border-yellow-500 text-yellow-200' : 'bg-yellow-100 border-yellow-400 text-yellow-800')
                            : (isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900')
                        }`}
                        placeholder={calculateTotalAC().toString()}
                        title={character.armorClass
                          ? "Manual AC override - clear to use auto-calculation"
                          : `Auto-calculated AC: ${calculateTotalAC()}\n\nBreakdown:\n• Armor: ${ARMOR_DATA[armor.armorType.item || 'None']?.ac || 10}\n• DEX Mod: ${(() => {
                            const armorData = ARMOR_DATA[armor.armorType.item || 'None'];
                            const dexMod = getModifier(character.abilityScores.dexterity);
                            if (armorData?.type === 'Light' || armorData?.type === 'None') return dexMod;
                            if (armorData?.type === 'Medium') return Math.min(dexMod, armorData.maxDex || 2);
                            return 0;
                          })()}\n• Shield: ${SHIELD_DATA[armor.shieldType.item || 'None']?.ac || 0}\n• Magic Bonus: ${(parseInt(armor.armorType.plus?.replace(/[^-\d]/g, '')) || 0) + (parseInt(armor.shieldType.plus?.replace(/[^-\d]/g, '')) || 0) + (parseInt(armor.magicalAttire.plus?.replace(/[^-\d]/g, '')) || 0)}`}
                      />
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Initiative</div>
                      <div
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold cursor-help ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        title="Auto-calculated from Dexterity and modifiers in Data tab"
                      >
                        {calculateInitiativeModifier() >= 0 ? '+' : ''}{calculateInitiativeModifier()}
                      </div>
                    </div>
                    <div className="text-center relative">
                      <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Speed</div>
                      <input
                        type="number"
                        value={character.speed}
                        onChange={(e) => updateCharacter({ speed: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Prof Bonus</div>
                      <input
                        type="number"
                        value={character.proficiencyBonus}
                        onChange={(e) => updateCharacter({ proficiencyBonus: parseInt(e.target.value) || 0 })}
                        className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 text-xl font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Combat Stats</h3>
                  </div>
                </div>
                
                {/* Health Box */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="space-y-4 pb-8">
                  {/* Health Bar - At the top */}
                  <div className="space-y-2">
                    <div className={`w-full h-6 border rounded-lg overflow-hidden relative ${
                      isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-gray-100'
                    }`}>
                      {/* Current HP Bar */}
                      <div
                        className="h-full transition-all duration-500 rounded-lg absolute left-0"
                        style={{
                          width: `${Math.min(100, Math.max(0, (character.hitPoints.current / calculateMaxHP()) * 100))}%`,
                          backgroundColor:
                            character.hitPoints.current <= calculateMaxHP() * 0.25 ? '#ef4444' :
                            character.hitPoints.current <= calculateMaxHP() * 0.5 ? '#f59e0b' :
                            character.hitPoints.current <= calculateMaxHP() * 0.75 ? '#eab308' :
                            '#10b981'
                        }}
                      ></div>
                      {/* Temp HP Bar */}
                      {(character.hitPoints.temporary || 0) > 0 && (
                        <div
                          className="h-full transition-all duration-500 rounded-lg absolute"
                          style={{
                            left: `${Math.min(100, Math.max(0, (character.hitPoints.current / calculateMaxHP()) * 100))}%`,
                            width: `${Math.min(100 - Math.min(100, (character.hitPoints.current / calculateMaxHP()) * 100), ((character.hitPoints.temporary || 0) / calculateMaxHP()) * 100)}%`,
                            backgroundColor: '#06b6d4'
                          }}
                        ></div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {Math.round((character.hitPoints.current / calculateMaxHP()) * 100)}%
                        {(character.hitPoints.temporary || 0) > 0 && `+${Math.round(((character.hitPoints.temporary || 0) / calculateMaxHP()) * 100)}%`}
                      </div>
                    </div>
                  </div>

                  {/* Hit Points */}
                  <div className="space-y-4">
                    {/* HP Section - Horizontal Layout */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>HP</div>
                        <input
                          type="number"
                          value={character.hitPoints.current}
                          onChange={(e) => updateCharacter({
                            hitPoints: { ...character.hitPoints, current: parseInt(e.target.value) || 0 }
                          })}
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center relative group">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Max HP</div>
                        <div
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold cursor-help ${
                            isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                          title="Auto-calculated from HP rolls in Data tab"
                        >
                          {calculateMaxHP()}
                        </div>

                        {/* Hover tooltip for HP calculation breakdown */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-slate-800 border border-orange-500 rounded px-3 py-2 text-xs whitespace-nowrap">
                            <div className="text-white font-bold mb-1">Max HP Calculation:</div>
                            <div className="text-gray-300">HP Rolls: {hitPointRolls.slice(0, character.level).reduce((sum, roll) => sum + (roll || 0), 0)}</div>
                            <div className="text-blue-400">CON Mod × Level: {getModifier(getFinalAbilityScore('constitution'))} × {character.level} = {getModifier(getFinalAbilityScore('constitution')) * character.level}</div>
                            {hasToughness && <div className="text-purple-400">Toughness: +{character.level * 2}</div>}
                            {isPHBHillDwarf && <div className="text-green-400">Hill Dwarf: +{character.level}</div>}
                            {additionalHPBonuses > 0 && <div className="text-yellow-400">Additional: +{additionalHPBonuses}</div>}
                            <div className="text-orange-400 border-t border-slate-600 pt-1 font-bold">Total: {calculateMaxHP()}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Temp HP</div>
                        <input
                          type="number"
                          value={character.hitPoints.temporary || ''}
                          onChange={(e) => updateCharacter({
                            hitPoints: { ...character.hitPoints, temporary: parseInt(e.target.value) || 0 }
                          })}
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Hit Dice Section */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Hit Dice</div>
                        <input
                          type="number"
                          value={currentHitDice || ''}
                          onChange={(e) => setCurrentHitDice(parseInt(e.target.value) || 0)}
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </div>
                      <div className="text-center relative group">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Max Dice</div>
                        <div
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold cursor-help ${
                            isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-600'
                          }`}
                          title="Auto-calculated from class and level"
                        >
                          {formatHitDiceDisplay()}
                        </div>

                        {/* Hover tooltip for hit dice explanation */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          <div className="bg-slate-800 border border-orange-500 rounded px-3 py-2 text-xs whitespace-nowrap">
                            <div className="text-white font-bold mb-1">Hit Dice Calculation:</div>
                            <div className="text-blue-400">Class: {character.class}</div>
                            <div className="text-green-400">Hit Die Type: {CLASS_HIT_DICE[character.class] || 'd8'}</div>
                            <div className="text-yellow-400">Level: {character.level}</div>
                            <div className="text-orange-400 border-t border-slate-600 pt-1 font-bold">Total: {formatHitDiceDisplay()}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Reduction</div>
                        <input
                          type="number"
                          value={damageReduction || ''}
                          onChange={(e) => setDamageReduction(parseInt(e.target.value) || 0)}
                          className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    {/* Resistance and Death Saves Section */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Resistance</div>
                        <textarea
                          placeholder="Resistances..."
                          rows={3}
                          className={`w-full text-xs text-center border rounded px-2 py-1 resize-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                      <div className="text-center">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Death Saves</div>
                        <div className="space-y-1">
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
                                className={`w-5 h-5 border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-400'} rounded cursor-pointer transition-colors ${
                                  failed ? 'bg-red-600 border-red-500' : isDarkMode ? 'bg-slate-700 hover:bg-red-600' : 'bg-gray-200 hover:bg-red-600'
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
                                className={`w-5 h-5 border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-400'} rounded cursor-pointer transition-colors ${
                                  succeeded ? 'bg-green-600 border-green-500' : isDarkMode ? 'bg-slate-700 hover:bg-green-600' : 'bg-gray-200 hover:bg-green-600'
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


              </div>

              {/* Right Block: 2 Columns */}
              <div className="grid grid-cols-2 gap-4">
              {/* Column 3: Skills and Ammunition */}
              <div className="space-y-4">
              {/* Editable Skills */}
              <div className={`p-3 rounded-lg border shadow-xl relative self-start ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>

                <div className="space-y-0.5 pb-3">
                  {/* All skills in a simple list */}
                  {Object.entries({
                    'Acrobatics': 'dexterity',
                    'Animal Handling': 'wisdom',
                    'Arcana': 'intelligence',
                    'Athletics': 'strength',
                    'Deception': 'charisma',
                    'History': 'intelligence',
                    'Insight': 'wisdom',
                    'Intimidation': 'charisma',
                    'Investigation': 'intelligence',
                    'Medicine': 'wisdom',
                    'Nature': 'intelligence',
                    'Perception': 'wisdom',
                    'Performance': 'charisma',
                    'Persuasion': 'charisma',
                    'Religion': 'intelligence',
                    'Sleight of Hand': 'dexterity',
                    'Stealth': 'dexterity',
                    'Survival': 'wisdom'
                  }).map(([skill, ability]) => {
                    const skillData = character.skills[skill] || { proficient: false, expertise: false };
                    const modifier = getSkillModifier(skill, ability as keyof typeof character.abilityScores);
                    const profBonus = skillData.proficient ? character.proficiencyBonus : 0;
                    const expBonus = skillData.expertise ? character.proficiencyBonus : 0;
                    const abilityMod = getModifier(getFinalAbilityScore(ability));

                    return (
                      <div key={skill} className="group flex items-center gap-2 hover:bg-gray-600/20 rounded px-1 py-0 relative">
                        {/* Proficiency Checkbox */}
                        <div
                          onClick={() => {
                            const newSkills = {
                              ...character.skills,
                              [skill]: {
                                ...skillData,
                                proficient: !skillData.proficient,
                                expertise: !skillData.proficient ? false : skillData.expertise,
                                source: 'manual' as const,
                                manualOverride: true
                              }
                            };
                            updateCharacter({ skills: newSkills });
                          }}
                          className={`w-4 h-4 border-2 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                            skillData.proficient
                              ? skillData.source === 'race'
                                ? 'bg-green-600 border-green-600 shadow-sm'
                                : skillData.source === 'class'
                                ? 'bg-purple-600 border-purple-600 shadow-sm'
                                : 'bg-blue-600 border-blue-600 shadow-sm'
                              : 'border-blue-600 bg-transparent hover:border-blue-400'
                          }`}
                          title={skillData.proficient ? `${skill} proficiency from ${skillData.source}` : `Click to add ${skill} proficiency`}
                        >
                          {skillData.proficient && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Expertise Checkbox */}
                        <div
                          onClick={() => {
                            if (skillData.proficient) {
                              const newSkills = {
                                ...character.skills,
                                [skill]: {
                                  ...skillData,
                                  expertise: !skillData.expertise,
                                  source: skillData.source === 'race' || skillData.source === 'class' ? skillData.source : 'manual' as const,
                                  manualOverride: skillData.source === 'race' || skillData.source === 'class' ? skillData.manualOverride : true
                                }
                              };
                              updateCharacter({ skills: newSkills });
                            }
                          }}
                          className={`w-4 h-4 border-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                            skillData.proficient
                              ? skillData.expertise
                                ? 'bg-orange-500 border-orange-500 shadow-sm cursor-pointer'
                                : 'border-orange-500 bg-transparent hover:border-orange-400 cursor-pointer'
                              : 'border-gray-400 bg-gray-300 opacity-40 cursor-not-allowed'
                          }`}
                          title={skillData.proficient ? (skillData.expertise ? 'Remove expertise' : 'Add expertise (double proficiency)') : 'Must be proficient first'}
                        >
                          {skillData.expertise && skillData.proficient && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>

                        {/* Skill Name */}
                        <div className={`flex-1 text-xs ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                          {skill}
                        </div>

                        {/* Modifier Display with enhanced styling */}
                        <div
                          className={`w-10 text-center font-mono text-xs border rounded transition-all duration-200 py-1 cursor-help ${
                            modifier >= 5
                              ? `border-green-500 bg-green-500/20 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`
                              : modifier >= 0
                              ? `border-blue-500 bg-blue-500/20 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`
                              : modifier >= -2
                              ? `border-yellow-500 bg-yellow-500/20 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`
                              : `border-red-500 bg-red-500/20 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`
                          }`}
                          title={`${skill} Calculation:\nAbility (${ability.toUpperCase()}): ${abilityMod >= 0 ? '+' : ''}${abilityMod}\nProficiency: ${profBonus > 0 ? `+${profBonus}` : '0'}\nExpertise: ${expBonus > 0 ? `+${expBonus}` : '0'}\nTotal: ${modifier >= 0 ? '+' : ''}${modifier}`}
                        >
                          {modifier >= 0 ? '+' : ''}{modifier}
                        </div>

                        {/* Hover tooltip for calculation breakdown */}
                        <div className="absolute left-full ml-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                          <div className="bg-slate-800 border border-orange-500 rounded px-2 py-1 text-xs whitespace-nowrap">
                            <div className="text-white font-bold">{skill}</div>
                            <div className="text-gray-300">{ability.toUpperCase()}: {abilityMod >= 0 ? '+' : ''}{abilityMod}</div>
                            {profBonus > 0 && <div className="text-blue-400">Prof: +{profBonus}</div>}
                            {expBonus > 0 && <div className="text-orange-400">Exp: +{expBonus}</div>}
                            <div className="text-orange-400 border-t border-slate-600 pt-1">Total: {modifier >= 0 ? '+' : ''}{modifier}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Skills Title */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Skills</h3>
                </div>
              </div>

              </div>

              {/* Column 4: Current Date and Survival Conditions */}
              <div className="space-y-4">
                {/* Current Date Display - Compact */}
                <div className={`p-3 rounded-lg border shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  {/* Weather Icon */}
                  <div className="flex justify-center mb-3">
                    <WeatherIcon type={currentWeather} />
                  </div>
                  
                  {/* Current Date Display */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400 mb-1">
                      {getOrdinalNumber(currentDate.day)} of {currentDate.season}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentDate.year} Year of the Ivory
                    </div>
                  </div>
                </div>

                {/* Survival Conditions */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="pb-8">
                <div className="space-y-1">
                  {/* Headers */}
                  <div className="grid gap-1 text-xs font-semibold text-gray-400 pb-1 border-b border-slate-600" style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div>Need</div>
                    <div className="text-center">Stage</div>
                    <div className="text-center">Effect</div>
                  </div>

                  {/* Hunger */}
                  <div className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                    character.survivalConditions.hunger.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.hunger.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Hunger</div>
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
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-400 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Thirst */}
                  <div className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                    character.survivalConditions.thirst.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.thirst.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Thirst</div>
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
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-400 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Fatigue */}
                  <div className={`grid gap-1 text-xs rounded px-1 py-0.5 ${
                    character.survivalConditions.fatigue.effect === -1 ? 'bg-green-500/20' :
                    character.survivalConditions.fatigue.effect === 1 ? 'bg-red-500/20' : ''
                  }`} style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Fatigue</div>
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
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                        readOnly
                        className={`w-4/5 text-xs text-center rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-400 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Additional Exhaustion */}
                  <div className="grid gap-1 text-xs rounded px-1 py-0.5" style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-xs`}>Addt'l</div>
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
                        className={`w-4/5 text-xs text-center border rounded px-1 py-0.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {/* Total Exhaustion */}
                  <div className="grid gap-1 text-xs border-t border-slate-600 pt-1 rounded px-1 py-0.5" style={{gridTemplateColumns: "0.8fr 1.4fr 0.6fr"}}>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-semibold text-xs`}>Total</div>
                    <div></div>
                    <div className="text-center">
                      <input
                        type="number"
                        value={character.survivalConditions.hunger.effect + character.survivalConditions.thirst.effect + character.survivalConditions.fatigue.effect + character.survivalConditions.additionalExhaustion}
                        readOnly
                        className={`w-full text-xs text-center border rounded px-1 py-0.5 font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
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

              {/* Quick Notes Box */}
              <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="pb-8">
                  <textarea
                    placeholder="Quick notes..."
                    rows={2}
                    className={`w-full text-sm border rounded px-2 py-2 resize-none transition-all duration-200 ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Quick Notes</h3>
                </div>
              </div>
              </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6">
                {/* Left side - Weapons */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="space-y-3 pb-8">
                    {/* Column Headers */}
                    <div className="grid gap-1 text-xs font-semibold text-gray-400 pb-2 border-b border-slate-600" style={{gridTemplateColumns: "1.8fr 0.8fr 0.5fr 0.5fr 0.4fr 0.8fr 0.7fr 1fr 0.5fr"}}>
                      <div className="text-center">Name</div>
                      <div className="text-center">Type</div>
                      <div className="text-center">Finesse</div>
                      <div className="text-center">Prof</div>
                      <div className="text-center cursor-help" title="Item Bonus">+</div>
                      <div className="text-center">Ability</div>
                      <div className="text-center">ATK Bon</div>
                      <div className="text-center">Damage</div>
                      <div className="text-center">Notch</div>
                    </div>

                    {character.weapons.map((weapon, index) => (
                      <div key={index} className="grid gap-1 items-center text-sm" style={{gridTemplateColumns: "1.8fr 0.8fr 0.5fr 0.5fr 0.4fr 0.8fr 0.7fr 1fr 0.5fr"}}>
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
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                            placeholder="Weapon name"
                          />
                        </div>

                        {/* Type */}
                        <div>
                          <select
                            value={weapon.type || 'Melee'}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              const newType = e.target.value;
                              let newAbility = weapon.ability;

                              // Auto-set ability based on weapon type
                              if (newType === 'Ranged') {
                                newAbility = 'DEX';
                              } else if (newType === 'Melee' && !weapon.finesse) {
                                newAbility = 'STR';
                              } else if (newType === 'Thrown') {
                                newAbility = weapon.finesse ? 'DEX' : 'STR';
                              }

                              newWeapons[index] = { ...weapon, type: newType, ability: newAbility };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs appearance-none ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="Melee">Melee</option>
                            <option value="Ranged">Ranged</option>
                            <option value="Thrown">Thrown</option>
                          </select>
                        </div>

                        {/* Finesse */}
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={weapon.finesse || false}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              const isFinesse = e.target.checked;
                              let newAbility = weapon.ability;

                              // Auto-adjust ability when finesse changes
                              if (weapon.type === 'Melee' || weapon.type === 'Thrown') {
                                newAbility = isFinesse ? 'DEX' : 'STR';
                              }

                              newWeapons[index] = { ...weapon, finesse: isFinesse, ability: newAbility };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className="w-3 h-3 accent-blue-500 rounded focus:ring-1 focus:ring-blue-400"
                            disabled={weapon.type === 'Ranged'}
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

                        {/* Weapon Bonus (+ field) */}
                        <div>
                          <input
                            type="text"
                            value={weapon.notches}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              newWeapons[index] = { ...weapon, notches: e.target.value };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                            placeholder="+0"
                          />
                        </div>

                        {/* Ability */}
                        <div>
                          <select
                            value={weapon.ability || 'STR'}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              newWeapons[index] = { ...weapon, ability: e.target.value };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center appearance-none ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="STR">STR</option>
                            <option value="DEX">DEX</option>
                            <option value="CON">CON</option>
                            <option value="INT">INT</option>
                            <option value="WIS">WIS</option>
                            <option value="CHA">CHA</option>
                          </select>
                        </div>

                        {/* ATK Bonus - Auto-calculated but editable */}
                        <div>
                          <input
                            type="text"
                            value={weapon.atkBonus || calculateWeaponAttackBonus(weapon)}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              newWeapons[index] = { ...weapon, atkBonus: e.target.value };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${
                              weapon.atkBonus
                                ? (isDarkMode ? 'bg-slate-600 border-yellow-500 text-yellow-200' : 'bg-yellow-50 border-yellow-400 text-gray-900')
                                : (isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900')
                            }`}
                            placeholder={calculateWeaponAttackBonus(weapon)}
                            title={weapon.atkBonus ? "Manual override - clear to use auto-calculation" : "Auto-calculated: ability mod + prof bonus + weapon bonus"}
                            onFocus={(e) => {
                              if (!weapon.atkBonus) {
                                e.target.value = calculateWeaponAttackBonus(weapon);
                              }
                            }}
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
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                            placeholder="1d8+2"
                          />
                        </div>

                        {/* Notch */}
                        <div>
                          <input
                            type="text"
                            value={weapon.notches || ''}
                            onChange={(e) => {
                              const newWeapons = [...character.weapons];
                              newWeapons[index] = { ...weapon, notches: e.target.value };
                              updateCharacter({ weapons: newWeapons });
                            }}
                            className={`w-full border rounded px-1 py-1 transition-all duration-200 text-xs text-center ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                            placeholder="0"
                          />
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
                                type: 'Melee',
                                finesse: false,
                                proficient: false,
                                notches: '',
                                range: '',
                                ability: 'STR',
                                atkBonus: '',
                                damage: ''
                              }]
                            });
                          }
                        }}
                        disabled={character.weapons.length >= 5}
                        className={`flex-1 py-1 px-3 text-xs rounded transition-colors ${
                          character.weapons.length >= 5
                            ? isDarkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : isDarkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
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
                            ? isDarkMode ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
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

                {/* Right side - Armor */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="space-y-2 pb-8">


                    {/* Header Row */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs font-semibold text-gray-400 text-right"></div>
                      <div className="w-32 text-xs font-semibold text-gray-400 px-2">Type</div>
                      <div className="w-40 text-xs font-semibold text-gray-400 px-2">Item</div>
                      <div className="w-12 text-xs font-semibold text-gray-400 text-center">+</div>
                      <div className="w-16 text-xs font-semibold text-gray-400 text-center">Notches</div>
                    </div>

                    {/* Armor Row */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs font-semibold text-gray-400 text-right">Armor</div>
                      <select
                        value={armor.armorType.item}
                        onChange={(e) => updateArmor('armorType', 'item', e.target.value)}
                        className={`w-32 min-w-[8rem] text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      >
                        {getArmorOptions().map(armorType => (
                          <option key={armorType} value={armorType}>{getArmorDisplayName(armorType)}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={armor.armorType.karuta}
                        onChange={(e) => updateArmor('armorType', 'karuta', e.target.value)}
                        className={`w-40 border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Armor Item"
                      />
                      <input
                        type="text"
                        value={armor.armorType.plus}
                        onChange={(e) => updateArmor('armorType', 'plus', e.target.value)}
                        className={`w-12 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="+"
                      />
                      <input
                        type="text"
                        value={armor.armorType.notches}
                        onChange={(e) => updateArmor('armorType', 'notches', e.target.value)}
                        className={`w-16 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Notches"
                      />
                    </div>

                    {/* Shield Row */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs font-semibold text-gray-400 text-right">Shield</div>
                      <select
                        value={armor.shieldType.item}
                        onChange={(e) => updateArmor('shieldType', 'item', e.target.value)}
                        className={`w-32 min-w-[8rem] text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                      >
                        {getShieldOptions().map(shieldType => (
                          <option key={shieldType} value={shieldType}>{shieldType}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={armor.shieldType.karuta || ''}
                        onChange={(e) => updateArmor('shieldType', 'karuta', e.target.value)}
                        className={`w-40 border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Shield Item"
                      />
                      <input
                        type="text"
                        value={armor.shieldType.plus}
                        onChange={(e) => updateArmor('shieldType', 'plus', e.target.value)}
                        className={`w-12 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="+"
                      />
                      <input
                        type="text"
                        value={armor.shieldType.notches}
                        onChange={(e) => updateArmor('shieldType', 'notches', e.target.value)}
                        className={`w-16 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Notches"
                      />
                    </div>

                    {/* Magical Attire Row 1 */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs font-semibold text-gray-400 text-right">Attire</div>
                      <select
                        value={armor.magicalAttire.item1}
                        onChange={(e) => updateArmor('magicalAttire', 'item1', e.target.value)}
                        className={`w-32 min-w-[8rem] text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                      >
                        {getMagicalAttireOptions().map(attire => (
                          <option key={attire} value={attire}>{attire}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={armor.magicalAttire.karuta || ''}
                        onChange={(e) => updateArmor('magicalAttire', 'karuta', e.target.value)}
                        className={`w-40 border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Attire Item"
                      />
                      <input
                        type="text"
                        value={armor.magicalAttire.plus}
                        onChange={(e) => updateArmor('magicalAttire', 'plus', e.target.value)}
                        className={`w-12 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="+"
                      />
                      <input
                        type="text"
                        value={armor.magicalAttire.notches}
                        onChange={(e) => updateArmor('magicalAttire', 'notches', e.target.value)}
                        className={`w-16 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Notches"
                      />
                    </div>

                    {/* Magical Attire Row 2 */}
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs font-semibold text-gray-400 text-right"></div>
                      <select
                        value={armor.magicalAttire.item2}
                        onChange={(e) => updateArmor('magicalAttire', 'item2', e.target.value)}
                        className={`w-32 min-w-[8rem] text-xs border rounded px-2 transition-all duration-200 py-1 appearance-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'}`}
                      >
                        {getMagicalAttireOptions().map(attire => (
                          <option key={attire} value={attire}>{attire}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={armor.magicalAttire.karuta || ''}
                        onChange={(e) => updateArmor('magicalAttire', 'karuta', e.target.value)}
                        className={`w-40 border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Attire Item"
                      />
                      <input
                        type="text"
                        className={`w-12 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="+"
                      />
                      <input
                        type="text"
                        className={`w-16 text-center border rounded transition-all duration-200 px-2 py-1 text-xs transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-1 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="Notches"
                      />
                    </div>

                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Armor</h3>
                  </div>
                </div>
            </div>

            {/* 4 Separate Boxes Layout */}
            <div className="grid grid-cols-4 gap-4 mt-8">

              {/* Box 1: Racial Features */}
              <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-semibold text-blue-400">Racial Features</h4>
                  <button
                    onClick={() => {
                      const name = prompt("Racial Feature Name:");
                      if (!name) return;
                      const description = prompt("Racial Feature Description:");
                      if (description === null) return;

                      setManualFeats([...manualFeats, {
                        name,
                        description: description || '',
                        source: 'race'
                      }]);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    title="Add Custom Racial Feature"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                  <div className="space-y-2">
                    {characterFeats.filter(feat => feat.source === 'race').map((feat, index) => (
                      <div key={index} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border border-blue-500/30 rounded p-2`}>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-blue-300">{feat.name}</span>
                          <span className="text-xs text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded">Race</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                      </div>
                    ))}
                    {manualFeats.filter(feat => feat.source === 'race').map((feat, index) => {
                      const manualIndex = manualFeats.findIndex(f => f === feat);
                      return (
                        <div key={`manual-${index}`} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border border-blue-500/30 rounded p-2`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-blue-300">{feat.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-blue-400 bg-blue-500/20 px-1 py-0.5 rounded">Race</span>
                              <button
                                onClick={() => {
                                  setManualFeats(manualFeats.filter((_, i) => i !== manualIndex));
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors"
                                title="Remove"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                        </div>
                      );
                    })}
                    {[...characterFeats.filter(feat => feat.source === 'race'), ...manualFeats.filter(feat => feat.source === 'race')].length === 0 && (
                      <div className="text-sm text-gray-500 italic">No racial features available</div>
                    )}
                  </div>
              </div>

              {/* Box 2: Class Features */}
              {characterFeats.filter(feat => feat.source === 'class').length > 0 && (
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h4 className="text-base font-semibold text-purple-400 mb-3">Class Features</h4>
                    <div className="space-y-2">
                      {characterFeats.filter(feat => feat.source === 'class').map((feat, index) => (
                        <div key={index} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border border-purple-500/30 rounded p-2`}>
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium text-purple-300">{feat.name}</span>
                              {feat.level && <span className="text-xs text-gray-400">(Lvl {feat.level})</span>}
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-500/20 px-1 py-0.5 rounded">Class</span>
                          </div>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{feat.description}</p>
                        </div>
                      ))}
                    </div>
                </div>
              )}

              {/* Box 3: Feats */}
              <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <h4 className="text-base font-semibold text-orange-400 mb-3">Feats</h4>
                <div className="space-y-2">
                  {manualFeats.slice(Math.ceil(manualFeats.length / 2)).map((feat, index) => (
                    <div key={index + Math.ceil(manualFeats.length / 2)} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border border-orange-500/30 rounded p-2`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="text"
                            value={feat.name}
                            onChange={(e) => {
                              const newFeats = [...manualFeats];
                              newFeats[index + Math.ceil(manualFeats.length / 2)] = { ...newFeats[index + Math.ceil(manualFeats.length / 2)], name: e.target.value };
                              setManualFeats(newFeats);
                            }}
                            className={`bg-transparent text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} border-none outline-none flex-1 min-w-0`}
                            placeholder="Feat name..."
                          />
                          <input
                            type="number"
                            value={feat.level || ''}
                            onChange={(e) => {
                              const newFeats = [...manualFeats];
                              newFeats[index + Math.ceil(manualFeats.length / 2)] = { ...newFeats[index + Math.ceil(manualFeats.length / 2)], level: parseInt(e.target.value) || undefined };
                              setManualFeats(newFeats);
                            }}
                            className="bg-transparent text-xs text-gray-400 border-none outline-none w-6 flex-shrink-0 text-center"
                            placeholder="L"
                            min="1"
                            max="20"
                          />
                        </div>
                        <button
                          onClick={() => removeManualFeat(index + Math.ceil(manualFeats.length / 2))}
                          className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                          title="Remove feat"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={feat.description}
                        onChange={(e) => {
                          const newFeats = [...manualFeats];
                          newFeats[index + Math.ceil(manualFeats.length / 2)] = { ...newFeats[index + Math.ceil(manualFeats.length / 2)], description: e.target.value };
                          setManualFeats(newFeats);
                        }}
                        className={`bg-transparent text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} border-none outline-none w-full resize-none`}
                        placeholder="Feat description..."
                        rows={2}
                      />
                    </div>
                  ))}

                  {/* Add New Feat Button */}
                  <button
                    onClick={() => addManualFeat('', '')}
                    className="w-full border-2 border-dashed border-orange-500/30 rounded p-3 text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors text-sm"
                  >
                    + Add Feat
                  </button>
                </div>
              </div>

              {/* Box 4: Feats */}
              <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <h4 className="text-base font-semibold text-orange-400 mb-3">Feats</h4>
                <div className="space-y-2">
                  {manualFeats.slice(0, Math.ceil(manualFeats.length / 2)).map((feat, index) => (
                    <div key={index} className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border border-orange-500/30 rounded p-2`}>
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                          <input
                            type="text"
                            value={feat.name}
                            onChange={(e) => {
                              const newFeats = [...manualFeats];
                              newFeats[index] = { ...newFeats[index], name: e.target.value };
                              setManualFeats(newFeats);
                            }}
                            className={`bg-transparent text-sm font-medium ${isDarkMode ? 'text-orange-300' : 'text-orange-700'} border-none outline-none flex-1 min-w-0`}
                            placeholder="Feat name..."
                          />
                          <input
                            type="number"
                            value={feat.level || ''}
                            onChange={(e) => {
                              const newFeats = [...manualFeats];
                              newFeats[index] = { ...newFeats[index], level: parseInt(e.target.value) || undefined };
                              setManualFeats(newFeats);
                            }}
                            className="bg-transparent text-xs text-gray-400 border-none outline-none w-6 flex-shrink-0 text-center"
                            placeholder="L"
                            min="1"
                            max="20"
                          />
                        </div>
                        <button
                          onClick={() => removeManualFeat(index)}
                          className="text-red-400 hover:text-red-300 text-xs flex-shrink-0"
                          title="Remove feat"
                        >
                          ✕
                        </button>
                      </div>
                      <textarea
                        value={feat.description}
                        onChange={(e) => {
                          const newFeats = [...manualFeats];
                          newFeats[index] = { ...newFeats[index], description: e.target.value };
                          setManualFeats(newFeats);
                        }}
                        className={`bg-transparent text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} border-none outline-none w-full resize-none`}
                        placeholder="Feat description..."
                        rows={2}
                      />
                    </div>
                  ))}

                  {/* Add New Feat Button */}
                  <button
                    onClick={() => addManualFeat('', '')}
                    className="w-full border-2 border-dashed border-orange-500/30 rounded p-3 text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors text-sm"
                  >
                    + Add Feat
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Character Tab */}
        {activeTab === 'Character' && (
          <div className={`min-h-screen p-8 font-serif rounded-xl ${isDarkMode ? 'bg-slate-900 text-stone-200' : 'bg-gray-200 text-stone-800'}`}>
            {/* Top Section: Header + Bio on Left, Portrait on Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Left Column: Header + Bio */}
              <div className="md:col-span-2 space-y-8">
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
                    {character.trueName?.toUpperCase() || 'CHARACTER NAME'}
                  </h1>
                  <div className={`py-1 px-3 inline-block rounded shadow-lg ${isDarkMode ? 'bg-orange-600 text-white' : 'bg-red-700 text-white'}`}>
                    <input
                      type="text"
                      value={character.mantra || 'Knowledge is the greatest treasure'}
                      onChange={(e) => updateCharacter({ mantra: e.target.value })}
                      className="bg-transparent font-semibold text-lg text-center border-none outline-none text-white placeholder-white/70"
                      placeholder="Character mantra or quote"
                    />
                  </div>
                </div>
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
              </div>

              {/* Character Portrait */}
              <div className={`rounded-lg shadow-2xl overflow-hidden border-4 w-full ${isDarkMode ? 'border-orange-400 bg-slate-800' : 'border-stone-300 bg-gray-100'}`}>
                {characterImage ? (
                  <img
                    src={characterImage}
                    alt="Character portrait"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full min-h-[500px] flex items-center justify-center ${isDarkMode ? 'bg-slate-700 text-stone-400' : 'bg-stone-200 text-stone-500'}`}>
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚔️</div>
                      <p className="text-sm">Portrait Place Holder</p>
                      <p className="text-xs mt-2">Upload in the Data Tab</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Proficiencies on Left, Profile Details & Ability Scores on Right */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Left Column: Proficiencies & Languages */}
              <div>
                {/* Proficiencies & Languages Section */}
                <div className={`border-2 rounded-lg shadow-xl p-4 ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-stone-300'}`}>
                  <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                    Proficiencies & Languages
                  </h3>

                  <div className="space-y-4 text-sm">
                    {/* Armor Proficiencies */}
                    <div>
                      <label className={`font-bold block mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Armor</label>
                      <textarea
                        value={proficiencies.armor.join(', ')}
                        onChange={(e) => setProficiencies({
                          ...proficiencies,
                          armor: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-stone-300 text-stone-800'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Light armor, Medium armor, Shields"
                        rows={2}
                      />
                    </div>

                    {/* Weapon Proficiencies */}
                    <div>
                      <label className={`font-bold block mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Weapons</label>
                      <textarea
                        value={proficiencies.weapons.join(', ')}
                        onChange={(e) => setProficiencies({
                          ...proficiencies,
                          weapons: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-stone-300 text-stone-800'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Simple weapons, Martial weapons"
                        rows={2}
                      />
                    </div>

                    {/* Tool Proficiencies */}
                    <div>
                      <label className={`font-bold block mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Tools</label>
                      <textarea
                        value={proficiencies.tools.join(', ')}
                        onChange={(e) => setProficiencies({
                          ...proficiencies,
                          tools: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-stone-300 text-stone-800'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Thieves' tools, Herbalism kit"
                        rows={2}
                      />
                    </div>

                    {/* Languages */}
                    <div>
                      <label className={`font-bold block mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Languages</label>
                      <textarea
                        value={proficiencies.languages.join(', ')}
                        onChange={(e) => setProficiencies({
                          ...proficiencies,
                          languages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                        })}
                        className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-stone-300 text-stone-800'} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                        placeholder="Common, Elvish, Draconic"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Details & Ability Scores */}
              <div className="md:col-span-2 space-y-8">
                {/* Profile Details Section */}
                <div className={`border-2 p-6 rounded-lg shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-gray-100 border-stone-300'}`}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      {/* True Name */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">True Name:</span>
                        <input
                          type="text"
                          value={character.trueName || 'Marcille Donato'}
                          onChange={(e) => updateCharacter({ trueName: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Age */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Age:</span>
                        <input
                          type="text"
                          value={character.age || '50 years old'}
                          onChange={(e) => updateCharacter({ age: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Race */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Race:</span>
                        <select
                          value={character.race}
                          onChange={(e) => updateCharacter({ race: e.target.value })}
                          className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                        >
                          {DND_RACES.map(race => (
                            <option key={race} value={race}>{race}</option>
                          ))}
                        </select>
                      </div>

                      {/* Gender */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Gender:</span>
                        <select
                          value={character.gender || 'Female'}
                          onChange={(e) => updateCharacter({ gender: e.target.value })}
                          className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                        >
                          {GENDER_OPTIONS.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                          ))}
                        </select>
                      </div>

                      {/* Birthplace */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Birthplace:</span>
                        <input
                          type="text"
                          value={character.birthplace || 'Northern Continent'}
                          onChange={(e) => updateCharacter({ birthplace: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Family */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Kin:</span>
                        <input
                          type="text"
                          value={character.family || 'Common, Elvish'}
                          onChange={(e) => updateCharacter({ family: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Physique */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Physique:</span>
                        <input
                          type="text"
                          value={character.physique || 'Height, roughly 160cm'}
                          onChange={(e) => updateCharacter({ physique: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Likes */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Likes:</span>
                        <input
                          type="text"
                          value={character.likes || 'Seafood, nuts'}
                          onChange={(e) => updateCharacter({ likes: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Dislikes */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Dislikes:</span>
                        <input
                          type="text"
                          value={character.dislikes || 'Any sort of weird food'}
                          onChange={(e) => updateCharacter({ dislikes: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Flaws */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Flaws:</span>
                        <input
                          type="text"
                          value={character.flaws || ''}
                          onChange={(e) => updateCharacter({ flaws: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                          placeholder="Character flaws..."
                        />
                      </div>

                      {/* Nicknames */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Nicknames:</span>
                        <input
                          type="text"
                          value={character.nicknames || ''}
                          onChange={(e) => updateCharacter({ nicknames: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                          placeholder="Character nicknames..."
                        />
                      </div>

                      {/* Alignment */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Alignment:</span>
                        <select
                          value={character.alignment}
                          onChange={(e) => updateCharacter({ alignment: e.target.value })}
                          className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                        >
                          {DND_ALIGNMENTS.map(alignment => (
                            <option key={alignment} value={alignment}>{alignment}</option>
                          ))}
                        </select>
                      </div>

                      {/* Background */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Background:</span>
                        <input
                          type="text"
                          value={character.background}
                          onChange={(e) => updateCharacter({ background: e.target.value })}
                          className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}
                        />
                      </div>

                      {/* Class */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold">Class:</span>
                        <select
                          value={character.class}
                          onChange={(e) => updateCharacter({ class: e.target.value })}
                          className={`flex-1 outline-none ${isDarkMode ? 'bg-slate-800 text-stone-200' : 'bg-stone-50 text-stone-800'}`}
                        >
                          {DND_CLASSES.map(className => (
                            <option key={className} value={className}>{className}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Ability Scores Radar Chart */}
                  <div className="mt-6 pt-4 border-t border-stone-300">
                    <div className="flex justify-center gap-8">
                      {/* Ability Scores Radar Chart */}
                      <div className="w-50 h-50 relative">
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
                            const labelX = 160 + Math.cos(angle) * 140;
                            const labelY = 160 + Math.sin(angle) * 140;

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

                      {/* Skills Bar Chart */}
                      <div className="w-56 h-44 pb-2">
                        <div className="space-y-1">
                          {(() => {
                            // Get all skills with their modifiers
                            const skillsWithModifiers = Object.entries({
                              'Acrobatics': 'dexterity', 'Animal Handling': 'wisdom', 'Arcana': 'intelligence',
                              'Athletics': 'strength', 'Deception': 'charisma', 'History': 'intelligence',
                              'Insight': 'wisdom', 'Intimidation': 'charisma', 'Investigation': 'intelligence',
                              'Medicine': 'wisdom', 'Nature': 'intelligence', 'Perception': 'wisdom',
                              'Performance': 'charisma', 'Persuasion': 'charisma', 'Religion': 'intelligence',
                              'Sleight of Hand': 'dexterity', 'Stealth': 'dexterity', 'Survival': 'wisdom'
                            }).map(([skill, ability]) => {
                              const modifier = getSkillModifier(skill, ability as keyof typeof character.abilityScores);
                              return { skill, modifier };
                            });

                            // Sort by modifier and get top 4 and bottom 4
                            const sorted = skillsWithModifiers.sort((a, b) => b.modifier - a.modifier);
                            const topSkills = sorted.slice(0, 4);
                            const bottomSkills = sorted.slice(-4).reverse();
                            const displaySkills = [...topSkills, ...bottomSkills];

                            const maxModifier = Math.max(...displaySkills.map(s => Math.abs(s.modifier)));

                            return displaySkills.map((item, index) => {
                              const isTop = index < 4;
                              const barWidth = Math.abs(item.modifier) / (maxModifier || 1) * 100;
                              const showDivider = index === 3; // Add divider after 4th item (between strongest and weakest)

                              return (
                                <div key={item.skill}>
                                  <div className="flex items-center text-xs">
                                    <div className={`w-20 text-right pr-2 ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                      {item.skill.slice(0, 8)}
                                    </div>
                                    <div className={`flex-1 relative h-4 rounded overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                      <div
                                        className={`h-full rounded transition-all duration-300 ${
                                          isTop
                                            ? (isDarkMode ? 'bg-green-500 bg-opacity-60' : 'bg-green-600 bg-opacity-60')
                                            : (isDarkMode ? 'bg-red-500 bg-opacity-60' : 'bg-red-600 bg-opacity-60')
                                        }`}
                                        style={{ width: `${barWidth}%` }}
                                      />
                                    </div>
                                    <div className={`w-8 text-center font-mono ${isDarkMode ? 'text-stone-300' : 'text-stone-700'}`}>
                                      {item.modifier >= 0 ? '+' : ''}{item.modifier}
                                    </div>
                                  </div>
                                  {showDivider && (
                                    <div className={`my-2 border-t border-dashed ${isDarkMode ? 'border-stone-500' : 'border-stone-400'}`}></div>
                                  )}
                                </div>
                              );
                            });
                          })()}
                        </div>
                        <div className={`mt-2 text-xs text-center opacity-60 ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                          <div className="flex justify-center gap-4">
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-green-500' : 'bg-green-600'}`}></div>
                              <span>Strongest</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-red-500' : 'bg-red-600'}`}></div>
                              <span>Weakest</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spells Tab */}
        {activeTab === 'Spells' && (
          <div className="space-y-8">
            {/* Top Row: Spellcasting Controls and Spell Slots Side by Side */}
            <div className="grid grid-cols-2 gap-6 items-start">
              {/* Left: Spellcasting Controls */}
              <div className={`p-6 rounded-lg border h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="grid grid-cols-2 gap-4">
                {/* Spellcasting Ability */}
                <div className="text-center">
                  <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Spellcasting Ability
                  </label>
                  <div
                    className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    title={`Auto-determined by class: ${character.class} uses ${getSpellcastingAbility()}`}
                  >
                    {getSpellcastingAbility().charAt(0).toUpperCase() + getSpellcastingAbility().slice(1)}
                  </div>
                </div>

                {/* Number of Known/Prepared Spells */}
                <div className="text-center">
                  <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Known/Prepared Spells
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={getEffectiveKnownSpells()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const calculated = calculateKnownSpells();
                        setKnownSpellsOverride(value === calculated ? null : value);
                        setCharacter({
                          ...character,
                          knownPreparedSpells: value
                        });
                      }}
                      onFocus={(e) => e.target.select()}
                      className={`w-full px-3 py-2 rounded border text-center font-bold ${
                        knownSpellsOverride !== null
                          ? 'bg-orange-900 border-orange-500 text-white'
                          : isDarkMode ? 'bg-transparent border-slate-600 text-white' : 'bg-transparent border-gray-400 text-gray-900'
                      } focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      title={knownSpellsOverride !== null
                        ? `Manual override: ${knownSpellsOverride} (Auto: ${calculateKnownSpells()})`
                        : `Auto-calculated: ${calculateKnownSpells()}`}
                    />
                    {knownSpellsOverride !== null && (
                      <button
                        onClick={() => {
                          setKnownSpellsOverride(null);
                          setCharacter({
                            ...character,
                            knownPreparedSpells: calculateKnownSpells()
                          });
                        }}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-300 text-xs"
                        title="Reset to auto-calculated value"
                      >
                        ↻
                      </button>
                    )}
                  </div>
                </div>

                {/* Spell DC */}
                <div className="text-center">
                  <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Spell DC
                  </label>
                  <div
                    className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    title={`Auto-calculated: 8 + Prof Bonus (${character.proficiencyBonus}) + ${getSpellcastingAbility().toUpperCase()} Mod (${getModifier(getFinalAbilityScore(getSpellcastingAbility())) >= 0 ? '+' : ''}${getModifier(getFinalAbilityScore(getSpellcastingAbility()))})`}
                  >
                    {calculateSpellDC()}
                  </div>
                </div>

                {/* Spell Attack */}
                <div className="text-center">
                  <label className={`block text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Spell Attack
                  </label>
                  <div
                    className={`w-full px-3 py-2 rounded border text-center font-bold cursor-help ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                    title={`Auto-calculated: Prof Bonus (${character.proficiencyBonus}) + ${getSpellcastingAbility().toUpperCase()} Mod (${getModifier(getFinalAbilityScore(getSpellcastingAbility())) >= 0 ? '+' : ''}${getModifier(getFinalAbilityScore(getSpellcastingAbility()))})`}
                  >
                    {calculateSpellAttack() >= 0 ? '+' : ''}{calculateSpellAttack()}
                  </div>
                </div>
                </div>
              </div>

              {/* Right: Spell Slots / Sorcery Points Tracker */}
              <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>

              {character.class === 'Sorcerer' ? (
                /* Sorcery Points System for Sorcerers */
                <div className="space-y-4">
                  {/* Sorcery Points Tracker */}
                  <div className="mb-6">
                    <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>Sorcery Points</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`flex-1 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full h-8 relative overflow-hidden`}>
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${character.sorceryPoints.max > 0 ? ((character.sorceryPoints.max - character.sorceryPoints.used) / character.sorceryPoints.max) * 100 : 0}%`,
                            backgroundColor: (() => {
                              const remaining = character.sorceryPoints.max - character.sorceryPoints.used;
                              const percentage = character.sorceryPoints.max > 0 ? (remaining / character.sorceryPoints.max) : 0;
                              if (percentage <= 0.25) return '#ef4444'; // red
                              if (percentage <= 0.5) return '#f59e0b'; // orange
                              if (percentage <= 0.75) return '#eab308'; // yellow
                              return '#10b981'; // green
                            })()
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} drop-shadow-md`}>
                            {character.sorceryPoints.max - character.sorceryPoints.used} / {character.sorceryPoints.max}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCharacter(prev => ({
                              ...prev,
                              sorceryPoints: {
                                ...prev.sorceryPoints,
                                used: Math.min(prev.sorceryPoints.max, prev.sorceryPoints.used + 1)
                              }
                            }));
                          }}
                          className={`px-3 py-1 text-sm rounded border transition-colors ${
                            isDarkMode ? 'bg-red-600 border-red-500 text-white hover:bg-red-500' : 'bg-red-200 border-red-300 text-red-700 hover:bg-red-300'
                          }`}
                          disabled={character.sorceryPoints.used >= character.sorceryPoints.max}
                        >
                          -
                        </button>
                        <button
                          onClick={() => {
                            setCharacter(prev => ({
                              ...prev,
                              sorceryPoints: {
                                ...prev.sorceryPoints,
                                used: Math.max(0, prev.sorceryPoints.used - 1)
                              }
                            }));
                          }}
                          className={`px-3 py-1 text-sm rounded border transition-colors ${
                            isDarkMode ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'
                          }`}
                          disabled={character.sorceryPoints.used <= 0}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                      You regain all expended Sorcery Points on a long rest.
                    </p>
                  </div>

                  {/* Spell Cost Table */}
                  <div>
                    <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sorcery Point Costs</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-300'}`}>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-slate-500' : 'border-gray-400'}`}>
                              <th className={`text-left py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spell Level</th>
                              <th className={`text-right py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cantrip</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>0</td></tr>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>1st</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2</td></tr>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>2nd</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div className={`p-3 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-200 border-gray-300'}`}>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-slate-500' : 'border-gray-400'}`}>
                              <th className={`text-left py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spell Level</th>
                              <th className={`text-right py-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Points</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>3rd</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5</td></tr>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4th</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>6</td></tr>
                            <tr><td className={`py-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>5th</td><td className={`text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>7</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Long Rest Button */}
                  <div className="flex gap-2 justify-end mt-4">
                    <button
                      onClick={() => {
                        setCharacter(prev => ({
                          ...prev,
                          sorceryPoints: {
                            ...prev.sorceryPoints,
                            used: 0
                          }
                        }));
                      }}
                      className={`px-3 py-1 text-xs rounded border transition-colors ${
                        isDarkMode ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'
                      }`}
                    >
                      Long Rest (Restore All)
                    </button>
                  </div>
                </div>
              ) : Object.keys(spellSlots).length > 0 ? (
                <div className="flex items-start gap-4">
                  {/* Vertical Label */}
                  <div className={`flex flex-col items-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-bold mt-8`}>
                    <div className="transform -rotate-90 whitespace-nowrap">TOTAL</div>
                    <div className="transform -rotate-90 whitespace-nowrap mt-8">SLOTS</div>
                  </div>

                  {/* Main Tracker Grid */}
                  <div className="flex-1">
                    <div className="grid grid-cols-9 gap-1 items-start">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
                        const slots = spellSlots[level];
                        const hasSlots = slots && slots.max > 0;

                        // Color scheme for spell levels
                        const levelColors = {
                          1: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', slot: 'border-blue-400', slotUsed: 'bg-blue-500', slotHover: 'hover:bg-blue-200' },
                          2: { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', slot: 'border-green-400', slotUsed: 'bg-green-500', slotHover: 'hover:bg-green-200' },
                          3: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', slot: 'border-purple-400', slotUsed: 'bg-purple-500', slotHover: 'hover:bg-purple-200' },
                          4: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', slot: 'border-red-400', slotUsed: 'bg-red-500', slotHover: 'hover:bg-red-200' },
                          5: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', slot: 'border-yellow-400', slotUsed: 'bg-yellow-500', slotHover: 'hover:bg-yellow-200' },
                          6: { bg: 'bg-indigo-100', border: 'border-indigo-300', text: 'text-indigo-800', slot: 'border-indigo-400', slotUsed: 'bg-indigo-500', slotHover: 'hover:bg-indigo-200' },
                          7: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', slot: 'border-pink-400', slotUsed: 'bg-pink-500', slotHover: 'hover:bg-pink-200' },
                          8: { bg: 'bg-cyan-100', border: 'border-cyan-300', text: 'text-cyan-800', slot: 'border-cyan-400', slotUsed: 'bg-cyan-500', slotHover: 'hover:bg-cyan-200' },
                          9: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800', slot: 'border-orange-400', slotUsed: 'bg-orange-500', slotHover: 'hover:bg-orange-200' }
                        };

                        const colors = levelColors[level as keyof typeof levelColors];

                        return (
                          <div key={level} className={`flex flex-col items-center relative ${hasSlots ? 'p-1 rounded-lg ' + colors.bg + ' ' + colors.border + ' border' : ''}`}>
                            {/* Quick Use Buttons */}
                            {hasSlots && (
                              <div className="absolute -top-1 -right-1 flex gap-1">
                                {/* Restore One Slot Button */}
                                <button
                                  onClick={() => {
                                    setSpellSlots(prev => ({
                                      ...prev,
                                      [level]: {
                                        ...prev[level],
                                        used: Math.max(0, prev[level].used - 1)
                                      }
                                    }));
                                  }}
                                  className="w-3 h-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                  title="Restore one slot"
                                  disabled={slots.used <= 0}
                                >
                                  -
                                </button>
                                {/* Use One Slot Button */}
                                <button
                                  onClick={() => {
                                    setSpellSlots(prev => ({
                                      ...prev,
                                      [level]: {
                                        ...prev[level],
                                        used: Math.min(prev[level].max, prev[level].used + 1)
                                      }
                                    }));
                                  }}
                                  className="w-3 h-3 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                  title="Use one slot"
                                  disabled={slots.used >= slots.max}
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Square container for level number */}
                            <div
                              className={`w-8 h-8 flex items-center justify-center border-2 mb-2 rounded transition-all duration-300 ${
                                hasSlots
                                  ? colors.bg + ' ' + colors.border + ' ' + colors.text + ' shadow-sm'
                                  : 'bg-gray-600 border-gray-500 text-gray-400'
                              }`}
                            >
                              <span className="text-sm font-bold">
                                {hasSlots ? slots.max : 0}
                              </span>
                            </div>

                            {/* Level Label */}
                            <div className={`text-xs mb-1 font-bold transition-colors duration-300 ${hasSlots ? colors.text : 'text-gray-400'}`}>{level}</div>

                            {/* Circles for tracking used slots */}
                            <div className="flex flex-col gap-1 items-center">
                              {hasSlots && Array.from({ length: slots.max }, (_, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (index < slots.used) {
                                      // Clicking on a used slot restores it
                                      setSpellSlots(prev => ({
                                        ...prev,
                                        [level]: {
                                          ...prev[level],
                                          used: Math.max(0, prev[level].used - 1)
                                        }
                                      }));
                                    } else {
                                      // Clicking on an available slot uses it
                                      castSpell(level);
                                    }
                                  }}
                                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 hover:scale-125 hover:shadow-lg ${
                                    index < slots.used
                                      ? colors.slotUsed + ' border-gray-300 hover:brightness-110 shadow-md' // Used slot - filled
                                      : 'bg-transparent ' + colors.slot + ' ' + colors.slotHover + ' hover:border-2 hover:shadow-md' // Available slot - outline
                                  }`}
                                  title={index < slots.used ? 'Click to restore this slot' : 'Click to use this slot'}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} py-8`}>
                  <p>No spell slots available for {character.class} level {character.level}</p>
                  <p className="text-xs mt-2">Some classes gain spellcasting at higher levels</p>
                </div>
              )}

              {/* Rest Buttons at Bottom Right */}
              <div className="flex gap-2 justify-end mt-6">
                <button
                  onClick={shortRest}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    isDarkMode ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' : 'bg-blue-200 border-blue-300 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  Short Rest {character.class === 'Warlock' ? '(Restore All)' : ''}
                </button>
                <button
                  onClick={longRest}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    isDarkMode ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' : 'bg-green-200 border-green-300 text-green-700 hover:bg-green-300'
                  }`}
                >
                  Long Rest (Restore All)
                </button>
              </div>
              </div>
            </div>

            {/* Spell Level Boxes */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
              <div className="space-y-4">
                {/* Cantrips Box */}
                <div className={`p-4 rounded border ${
                  isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'
                }`}>
                  <div className="flex justify-between items-center mb-4 py-2">
                    <div className={`text-left text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Cantrips</div>
                    <button
                      onClick={() => addCustomSpell(0)}
                      className={`text-sm px-2 py-1 rounded border transition-colors ${
                        isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Add custom cantrip"
                    >
                      +
                    </button>
                  </div>
                  <div className={`grid text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} style={{ gridTemplateColumns: '20fr 7fr 7fr 7fr 8fr 28fr 6fr 6fr 4fr 5fr 6fr' }}>
                    <div className="text-center">Spell Name</div>
                    <div className="text-center">School</div>
                    <div className="text-center">Casting Time</div>
                    <div className="text-center">Range</div>
                    <div className="text-center">Area / Targets</div>
                    <div className="text-center">Effect</div>
                    <div className="text-center">Save /Att</div>
                    <div className="text-center">Duration</div>
                    <div className="text-center">Tags</div>
                    <div className="text-center">Comp</div>
                    <div className="text-center">Cast</div>
                  </div>

                  {/* Display Known Cantrips */}
                  {getKnownSpellsForLevel(0).map((spell, spellIndex) => (
                    <div
                      key={`cantrip-${spellIndex}`}
                      className="grid mt-1 cursor-pointer hover:bg-slate-600/30 transition-colors"
                      style={{ gridTemplateColumns: '20fr 7fr 7fr 7fr 8fr 28fr 6fr 6fr 4fr 5fr 6fr' }}
                      onMouseEnter={(e) => {
                        setHoveredSpell(spell);
                        setMousePosition({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseMove={(e) => {
                        setMousePosition({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => {
                        setHoveredSpell(null);
                      }}
                    >
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.Name || spell.name || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.School || spell.school || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.CastingTime || spell.casting_time || spell.castingTime || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.Range || spell.range || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell['Area or Targets'] || spell.area_of_effect || spell.areaOfEffect || spell.targets || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.Effect || spell.description || spell.effect || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell['Save or Attack'] || spell.save || spell.attack || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.Duration || spell.duration || ''}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {(spell.Conc ? 'C' : '') + (spell.Ritual ? 'R' : '')}
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        {spell.Comp || spell.components || ''}
                      </div>
                    </div>
                  ))}

                  {/* Display Custom Cantrips */}
                  {(customSpells[0] || []).map((spell) => (
                    <div
                      key={`custom-cantrip-${spell.id}`}
                      className="grid mt-1 transition-colors"
                      style={{ gridTemplateColumns: '20fr 7fr 7fr 7fr 8fr 28fr 6fr 6fr 4fr 5fr 6fr' }}
                    >
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500 relative">
                        <input
                          type="text"
                          value={spell.Name || spell.name}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Name', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Spell name..."
                        />
                        <button
                          onClick={() => removeCustomSpell(0, spell.id)}
                          className="absolute -top-1 -right-1 text-red-400 hover:text-red-300 text-xs bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center"
                          title="Remove custom cantrip"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.School || spell.school}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'School', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="School..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.CastingTime || spell.casting_time}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'CastingTime', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Cast time..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.Range || spell.range}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Range', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Range..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell['Area or Targets'] || spell.area_of_effect}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Area or Targets', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Area/Targets..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <textarea
                          value={spell.Effect || spell.description || spell.effect}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Effect', e.target.value)}
                          className="bg-transparent text-xs text-white border-none outline-none w-full resize-none"
                          placeholder="Effect..."
                          rows={2}
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell['Save or Attack'] || spell.save}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Save or Attack', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Save/Attack..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.Duration || spell.duration}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Duration', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Duration..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.Tags || spell.tags}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Tags', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Tags..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="text"
                          value={spell.Comp || spell.components}
                          onChange={(e) => updateCustomSpell(0, spell.id, 'Comp', e.target.value)}
                          className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                          placeholder="Components..."
                        />
                      </div>
                      <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                        <input
                          type="checkbox"
                          className="rounded"
                          title="Prepared/Known"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {Array.from({ length: 9 }, (_, i) => i + 1).filter(level =>
                  getAccessibleSpellLevels(character.class, character.level).includes(level)
                ).map(level => (
                  <div key={level} className={`p-4 rounded border ${
                    isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-100 border-gray-300'
                  }`}>
                    <div className="flex justify-between items-center mb-4 py-2">
                      <div className={`text-left text-lg font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Level {level}</div>
                      <button
                        onClick={() => addCustomSpell(level)}
                        className={`text-sm px-2 py-1 rounded border transition-colors ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                        }`}
                        title={`Add custom level ${level} spell`}
                      >
                        +
                      </button>
                    </div>
                    <div className={`grid text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`} style={{ gridTemplateColumns: '24fr 8fr 8fr 8fr 9fr 32fr 7fr 7fr 5fr 6fr' }}>
                      <div className="text-center">Spell Name</div>
                      <div className="text-center">School</div>
                      <div className="text-center">Casting Time</div>
                      <div className="text-center">Range</div>
                      <div className="text-center">Area / Targets</div>
                      <div className="text-center">Effect</div>
                      <div className="text-center">Save /Att</div>
                      <div className="text-center">Duration</div>
                      <div className="text-center">Tags</div>
                      <div className="text-center">Comp</div>
                    </div>

                    {/* Display Known Spells for Current Level */}
                    {getKnownSpellsForLevel(level).map((spell, spellIndex) => (
                      <div
                        key={`level-${level}-spell-${spellIndex}`}
                        className="grid mt-1 cursor-pointer hover:bg-slate-600/30 transition-colors"
                        style={{ gridTemplateColumns: '24fr 8fr 8fr 8fr 9fr 32fr 7fr 7fr 5fr 6fr' }}
                        onMouseEnter={(e) => {
                          setHoveredSpell(spell);
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e) => {
                          setMousePosition({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => {
                          setHoveredSpell(null);
                        }}
                      >
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.Name || spell.name || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.School || spell.school || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.CastingTime || spell.casting_time || spell.castingTime || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.Range || spell.range || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell['Area or Targets'] || spell.area_of_effect || spell.areaOfEffect || spell.targets || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.Effect || spell.description || spell.effect || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell['Save or Attack'] || spell.save || spell.attack || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.Duration || spell.duration || ''}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {(spell.Conc ? 'C' : '') + (spell.Ritual ? 'R' : '')}
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          {spell.Comp || spell.components || ''}
                        </div>
                      </div>
                    ))}

                    {/* Display Custom Spells for Current Level */}
                    {(customSpells[level] || []).map((spell) => (
                      <div
                        key={`custom-level-${level}-spell-${spell.id}`}
                        className="grid mt-1 transition-colors"
                        style={{ gridTemplateColumns: '24fr 8fr 8fr 8fr 9fr 32fr 7fr 7fr 5fr 6fr' }}
                      >
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500 relative">
                          <input
                            type="text"
                            value={spell.Name || spell.name}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Name', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Spell name..."
                          />
                          <button
                            onClick={() => removeCustomSpell(level, spell.id)}
                            className="absolute -top-1 -right-1 text-red-400 hover:text-red-300 text-xs bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center"
                            title={`Remove custom level ${level} spell`}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell.School || spell.school}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'School', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="School..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell.CastingTime || spell.casting_time}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'CastingTime', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Cast time..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell.Range || spell.range}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Range', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Range..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell['Area or Targets'] || spell.area_of_effect}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Area or Targets', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Area/Targets..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <textarea
                            value={spell.Effect || spell.description || spell.effect}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Effect', e.target.value)}
                            className="bg-transparent text-xs text-white border-none outline-none w-full resize-none"
                            placeholder="Effect..."
                            rows={2}
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell['Save or Attack'] || spell.save}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Save or Attack', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Save/Attack..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell.Duration || spell.duration}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Duration', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Duration..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="text"
                            value={spell.Tags || spell.tags}
                            onChange={(e) => updateCustomSpell(level, spell.id, 'Tags', e.target.value)}
                            className="bg-transparent text-xs text-white text-center border-none outline-none w-full"
                            placeholder="Tags..."
                          />
                        </div>
                        <div className="px-2 py-1 text-xs text-white text-center bg-slate-600/50 rounded border border-slate-500">
                          <input
                            type="checkbox"
                            className="rounded"
                            title="Prepared/Known"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Library Tab */}
        {activeTab === 'Library' && (
          <div className="space-y-8">
            {/* Spell Filters */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
              <h3 className="text-xl font-semibold text-orange-400 mb-4">Spell Filters</h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Search Spells</label>
                  <input
                    type="text"
                    placeholder="Search by name, school, or description..."
                    value={spellSearchTerm}
                    onChange={(e) => setSpellSearchTerm(e.target.value)}
                    className={`w-full border rounded px-3 py-2 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                {/* Class Filter */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Class</label>
                  <select
                    value={selectedSpellClass}
                    onChange={(e) => setSelectedSpellClass(e.target.value)}
                    className={`w-full border rounded px-3 py-2 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="All Classes">All Classes</option>
                    <option value="Bard">Bard</option>
                    <option value="Cleric">Cleric</option>
                    <option value="Druid">Druid</option>
                    <option value="Paladin">Paladin</option>
                    <option value="Ranger">Ranger</option>
                    <option value="Sorcerer">Sorcerer</option>
                    <option value="Warlock">Warlock</option>
                    <option value="Wizard">Wizard</option>
                    <option value="Eldritch Knight">Eldritch Knight</option>
                    <option value="Arcane Trickster">Arcane Trickster</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Spell Levels</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(level =>
                      getAccessibleSpellLevels(character.class, character.level).includes(level)
                    ).map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          id={`spell-level-${level}`}
                          type="checkbox"
                          checked={selectedSpellLevels.has(level)}
                          onChange={(e) => {
                            const newLevels = new Set(selectedSpellLevels);
                            if (e.target.checked) {
                              newLevels.add(level);
                            } else {
                              newLevels.delete(level);
                            }
                            setSelectedSpellLevels(newLevels);
                          }}
                          className="w-4 h-4 text-orange-400 bg-transparent border-slate-600 rounded focus:ring-orange-500 mr-1"
                        />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {level === 0 ? 'C' : level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSelectedSpellLevels(new Set(getAccessibleSpellLevels(character.class, character.level)))}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Accessible Levels
                </button>
                <button
                  onClick={() => setSelectedSpellLevels(new Set([0]))}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cantrips Only
                </button>
                <button
                  onClick={() => setSelectedSpellLevels(new Set())}
                  className={`px-3 py-1 text-xs rounded border transition-colors ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white hover:bg-slate-500' : 'bg-gray-200 border-gray-300 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Spell Library Table */}
            <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-orange-400">Master Spell Library</h3>
                {masterSpellList.length > 0 && (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Showing {getFilteredSpells().length} of {masterSpellList.length} spells
                  </div>
                )}
              </div>

              {masterSpellList.length > 0 ? (
                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className={`grid text-xs font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 py-2 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`} style={{ gridTemplateColumns: '5fr 5fr 20fr 8fr 8fr 8fr 12fr 25fr 8fr 8fr' }}>
                    <div className="text-center">Known</div>
                    <div className="text-center">Level</div>
                    <div className="text-center">Name</div>
                    <div className="text-center">School</div>
                    <div className="text-center">Casting Time</div>
                    <div className="text-center">Range</div>
                    <div className="text-center">Area or Targets</div>
                    <div className="text-center">Effect</div>
                    <div className="text-center">Save or Attack</div>
                    <div className="text-center">Duration</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-1 max-h-[72rem] overflow-y-auto">
                    {getFilteredSpells()
                      .sort((a, b) => {
                        // Sort by level first, then by name - handle invalid levels
                        const levelA = isNaN(parseFloat(a.Level !== undefined ? a.Level : a.level)) ? 0 : parseFloat(a.Level !== undefined ? a.Level : a.level);
                        const levelB = isNaN(parseFloat(b.Level !== undefined ? b.Level : b.level)) ? 0 : parseFloat(b.Level !== undefined ? b.Level : b.level);
                        if (levelA !== levelB) return levelA - levelB;
                        const nameA = a.Name || a.name || 'Unknown Spell';
                        const nameB = b.Name || b.name || 'Unknown Spell';
                        return nameA.localeCompare(nameB);
                      })
                      .map((spell, index) => (
                        <div key={index} className={`grid text-xs py-2 border-b border-slate-700 hover:bg-slate-700/50 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`} style={{ gridTemplateColumns: '5fr 5fr 20fr 8fr 8fr 8fr 12fr 25fr 8fr 8fr' }}>
                          <div className="text-center">
                            <input
                              id={`known-spell-${index}`}
                              type="checkbox"
                              checked={knownSpells.has(index)}
                              onChange={(e) => {
                                const newKnownSpells = new Set(knownSpells);
                                if (e.target.checked) {
                                  newKnownSpells.add(index);
                                } else {
                                  newKnownSpells.delete(index);
                                }
                                setKnownSpells(newKnownSpells);
                              }}
                              className="w-4 h-4 text-orange-400 bg-transparent border-slate-600 rounded focus:ring-orange-500"
                            />
                          </div>
                          <div className="text-center">
                            {isNaN(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))
                              ? 'Unknown'
                              : parseFloat(spell.Level !== undefined ? spell.Level : spell.level) === 0
                                ? 'Cantrip'
                                : Math.floor(parseFloat(spell.Level !== undefined ? spell.Level : spell.level))
                            }
                          </div>
                          <div className="text-center px-1 truncate">{spell.Name || spell.name || 'Unknown Spell'}</div>
                          <div className="text-center px-1 truncate">{spell.School || spell.school || 'Unknown'}</div>
                          <div className="text-center px-1 truncate">{spell.CastingTime || spell.casting_time || spell.castingTime || 'Unknown'}</div>
                          <div className="text-center px-1 truncate">{spell.Range || spell.range || 'Unknown'}</div>
                          <div className="text-center px-1 truncate">{spell['Area or Targets'] || spell.area_of_effect || spell.areaOfEffect || spell.targets || 'Unknown'}</div>
                          <div className="text-center px-1">{spell.Effect || spell.description || spell.effect || 'No description available'}</div>
                          <div className="text-center px-1 truncate">{spell['Save or Attack'] || spell.save || spell.attack || 'None'}</div>
                          <div className="text-center px-1 truncate">{spell.Duration || spell.duration || 'Unknown'}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <p>Upload a JSON file to view your master spell list.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'Inventory' && (
          <div className="space-y-6">
            {/* Row 1: Top 5 Boxes */}
            <div className="grid grid-cols-5 gap-4">
              
              {/* 1. Survival Guide & Encumbrance Column */}
              <div className="space-y-4">
                <div className={`p-2 rounded-lg border shadow-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Survival Guide
                    </div>
                    <div className="text-right">
                      <a
                        href="https://docs.google.com/spreadsheets/d/1gMKYyf5Z2LdGhP4zDMvolMItEbtA_w6pSNoHvhgl-fY/edit?gid=1041257008#gid=1041257008"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center px-3 py-2 rounded-lg border transition-all duration-200 text-2xl ${
                          isDarkMode
                            ? 'bg-gradient-to-br from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 border-orange-500 shadow-md hover:shadow-orange-500/30'
                            : 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 border-orange-400 shadow-md hover:shadow-orange-400/30'
                        }`}
                      >
                        📖
                      </a>
                    </div>
                  </div>
                </div>

                {/* Encumbrance Box */}
                <div className={`p-2 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="grid grid-cols-3 gap-1 text-center text-sm mb-2">
                    <div>
                      <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Open Slots</div>
                      <div className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 ${
                        isDarkMode ? 'border-green-400' : 'border-green-400'
                      }`}>
                        {encumbrance.openSlots}
                      </div>
                    </div>
                    <div>
                      <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Max Slots</div>
                      <div
                        className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 cursor-help ${
                          isDarkMode ? 'border-orange-400' : 'border-orange-400'
                        }`}
                        title={`${carryingSize} size (${
                          carryingSize === 'Tiny' ? '6' :
                          carryingSize === 'Small' ? '14' :
                          carryingSize === 'Medium' ? '18' :
                          carryingSize === 'Large' ? '22' :
                          carryingSize === 'Huge' ? '30' : '46'
                        }) + STR modifier (${getModifier(character.abilityScores.strength) >= 0 ? '+' : ''}${getModifier(character.abilityScores.strength)}) = ${encumbrance.maxSlots}`}
                      >
                        {encumbrance.maxSlots}
                      </div>
                    </div>
                    <div>
                      <div className={`text-[10px] mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Bulk</div>
                      <div className={`w-full text-center text-lg font-bold border rounded px-1 py-1 text-white bg-gray-700 ${
                        isDarkMode ? 'border-blue-400' : 'border-blue-400'
                      }`}>
                        {encumbrance.yourBulk}
                      </div>
                    </div>
                  </div>
                  <div className="text-center pb-8">
                    <div className={`text-xs ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>Capacity:</div>
                    {/* Health Bar Style Display */}
                    <div className="w-full bg-gray-600 rounded-full h-3 mb-1">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          encumbrance.openSlots <= 0 ? 'bg-red-500' :
                          encumbrance.openSlots / encumbrance.maxSlots > 0.5 ? 'bg-green-500' :
                          encumbrance.openSlots / encumbrance.maxSlots > 0.2 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{
                          width: `${Math.max(0, Math.min(100, (encumbrance.openSlots / encumbrance.maxSlots) * 100))}%`
                        }}
                      />
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                      {encumbrance.openSlots >= 0
                        ? `${Math.round((encumbrance.openSlots / encumbrance.maxSlots) * 100)}%`
                        : `${Math.abs(encumbrance.openSlots)} over capacity (${encumbrance.yourBulk}/${encumbrance.maxSlots + Math.floor(encumbrance.maxSlots / 2)} max)`
                      }
                    </div>
                    <div className="text-center">
                      {encumbrance.openSlots >= 0 ? (
                        <div className={`text-sm font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          Unencumbered
                        </div>
                      ) : encumbrance.yourBulk <= encumbrance.maxSlots + Math.floor(encumbrance.maxSlots / 2) ? (
                        <div>
                          <div
                            className={`text-sm font-bold cursor-help ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                            title="You have disadvantage on ability checks, attack rolls, and saving throws that use Strength, Dexterity, or Constitution."
                          >
                            Encumbered!
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Speed halved, disadvantage on STR/DEX/CON
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className={`text-sm font-bold cursor-help ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                            title="You have exceeded maximum carrying capacity!"
                          >
                            ⚠ OVERLOADED! ⚠
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>
                            Exceeded max capacity!
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Encumbrance</h3>
                  </div>
                </div>
              </div>

              {/* 3. Purse Box */}
              <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`}>
                        <th className={`text-left py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Coin</th>
                        <th className={`text-center py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Amount</th>
                        <th className={`text-center py-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Value (SP)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(purse).map(([coinType, data]) => (
                        <tr key={coinType} className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-400'}`}>
                          <td className={`py-1 text-left ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{coinType.charAt(0).toUpperCase()}P</td>
                          <td className="py-1 text-center">
                            <input
                              type="number"
                              min="0"
                              value={data.amount || ''}
                              onChange={(e) => setPurse({
                                ...purse,
                                [coinType]: { ...data, amount: parseInt(e.target.value) || 0 }
                              })}
                              className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="0"
                            />
                          </td>
                          <td className="py-1 text-center">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={(data.amount * data.value).toFixed(2)}
                              onChange={(e) => {
                                const spValue = parseFloat(e.target.value) || 0;
                                const newAmount = spValue / data.value;
                                setPurse({
                                  ...purse,
                                  [coinType]: { ...data, amount: Math.round(newAmount * 100) / 100 }
                                });
                              }}
                              className={`w-16 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-2 text-center pb-8">
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Coins: {Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0)}
                    {Object.values(purse).reduce((sum, coin) => sum + coin.amount, 0) > 100 && (
                      <span className="text-yellow-500 font-bold ml-1">⚠ Over 100 coin limit!</span>
                    )}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Bulk = {calculatePurseBulk()}</div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} mt-2`}>Total = {calculateTotalValue().toFixed(1)} SP</div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Purse</h3>
                </div>
              </div>

              {/* 4. Ration Box */}
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="space-y-2 pb-8">
                    <div className={`grid grid-cols-3 gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                      <div># of Boxes</div>
                      <div># of Rations</div>
                      <div>Total Bulk</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        min="0"
                        value={rationBox.boxes || ''}
                        onChange={(e) => {
                          const boxes = parseInt(e.target.value) || 0;
                          const totalBulk = Math.max(boxes, rationBox.rations);
                          setRationBox({...rationBox, boxes, totalBulk});
                        }}
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.rations || ''}
                        onChange={(e) => {
                          const rations = parseInt(e.target.value) || 0;
                          const totalBulk = Math.max(rationBox.boxes, rations);
                          setRationBox({...rationBox, rations, totalBulk});
                        }}
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                      <input
                        type="number"
                        min="0"
                        value={rationBox.totalBulk || ''}
                        readOnly
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-200 border-gray-400 text-gray-700'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Ration Box</h3>
                  </div>
                </div>

                {/* 5. Waterskin Box (beneath Ration Box) */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="space-y-2 pb-8">
                    <div className={`grid grid-cols-3 gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                      <div># of Skins</div>
                      <div># of Rations</div>
                      <div>Total Bulk</div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.skins || ''}
                        onChange={(e) => {
                          const skins = parseInt(e.target.value) || 0;
                          const totalBulk = Math.max(skins, waterskinBox.rations);
                          setWaterskinBox({...waterskinBox, skins, totalBulk});
                        }}
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.rations || ''}
                        onChange={(e) => {
                          const rations = parseInt(e.target.value) || 0;
                          const totalBulk = Math.max(waterskinBox.skins, rations);
                          setWaterskinBox({...waterskinBox, rations, totalBulk});
                        }}
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                      <input
                        type="number"
                        min="0"
                        value={waterskinBox.totalBulk || ''}
                        readOnly
                        className={`w-full text-center text-xs border rounded px-1 transition-all duration-200 py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-not-allowed ${
                          isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-200 border-gray-400 text-gray-700'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Waterskin</h3>
                  </div>
                </div>
              </div>

              {/* 6. Magical Containers Box */}
              <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
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
                        <td className="py-1 text-center">
                          <input
                            type="text"
                            value={magicalContainers.bagOfHolding.owned}
                            onChange={(e) => setMagicalContainers({
                              ...magicalContainers,
                              bagOfHolding: { ...magicalContainers.bagOfHolding, owned: e.target.value }
                            })}
                            className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        </td>
                        <td className="py-1 text-center">{magicalContainers.bagOfHolding.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Portable Hole</td>
                        <td className="py-1 text-center">
                          <input
                            type="text"
                            value={magicalContainers.portableHole.owned}
                            onChange={(e) => setMagicalContainers({
                              ...magicalContainers,
                              portableHole: { ...magicalContainers.portableHole, owned: e.target.value }
                            })}
                            className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        </td>
                        <td className="py-1 text-center">{magicalContainers.portableHole.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Handy Haversack</td>
                        <td className="py-1 text-center">
                          <input
                            type="text"
                            value={magicalContainers.handyHaversack.owned}
                            onChange={(e) => setMagicalContainers({
                              ...magicalContainers,
                              handyHaversack: { ...magicalContainers.handyHaversack, owned: e.target.value }
                            })}
                            className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        </td>
                        <td className="py-1 text-center">{magicalContainers.handyHaversack.slots}</td>
                      </tr>
                      <tr className="border-b border-slate-600">
                        <td className="py-1 text-left">Quiver of Ehlonna</td>
                        <td className="py-1 text-center">
                          <input
                            type="text"
                            value={magicalContainers.quiverOfEhlonna.owned}
                            onChange={(e) => setMagicalContainers({
                              ...magicalContainers,
                              quiverOfEhlonna: { ...magicalContainers.quiverOfEhlonna, owned: e.target.value }
                            })}
                            className={`w-6 text-center text-xs border rounded px-1 transition-all duration-200 ${
                              isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                            }`}
                          />
                        </td>
                        <td className="py-1 text-center">{magicalContainers.quiverOfEhlonna.slots}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Magical Containers</h3>
                </div>
              </div>

              {/* 7. Purchase Calculator Box */}
              <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
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
                              value={data.purchase || ''}
                              onChange={(e) => setPurchaseCalculator({
                                ...purchaseCalculator,
                                [coinType]: { ...data, purchase: parseInt(e.target.value) || 0 }
                              })}
                              className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="0"
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

            {/* Equipment Sections - 2 Column Layout */}
            <div className="grid gap-6" style={{gridTemplateColumns: '1fr 1.15fr'}}>

              {/* Left Column: Equipped Items + External Storage + Attuned Items */}
              <div className="space-y-6">
                
                {/* 1. Equipped Items */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-1">Type</th>
                          <th className="text-left py-1">Item</th>
                          <th className="text-center py-1">Bonus</th>
                          <th className="text-center py-1">Range</th>
                          <th className="text-center py-1">Notches</th>
                          <th className="text-center py-1">SP</th>
                          <th className="text-center py-1">Bulk</th>
                          <th className="text-center py-1">Att?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equippedItems.map((equippedItem, index) => (
                          <tr key={index} className="border-b border-slate-600">
                            <td className="py-1">
                              <select
                                value={equippedItem.type}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].type = e.target.value;
                                  setEquippedItems(newItems);
                                  // Trigger sync when type changes
                                  syncEquippedItemToSystems(newItems[index], index);
                                }}
                                className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                              >
                                <option value="">-</option>
                                {itemTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-1">
                              <input
                                type="text"
                                value={equippedItem.item}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].item = e.target.value;
                                  setEquippedItems(newItems);
                                  // Trigger sync when item name changes
                                  syncEquippedItemToSystems(newItems[index], index);
                                }}
                                className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                                  // Trigger sync when bonus changes
                                  syncEquippedItemToSystems(newItems[index], index);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                                  // Trigger sync when notches change
                                  syncEquippedItemToSystems(newItems[index], index);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={equippedItem.valueSP || ''}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].valueSP = parseFloat(e.target.value) || 0;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                                placeholder="0"
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={equippedItem.bulk || ''}
                                onChange={(e) => {
                                  const newItems = [...equippedItems];
                                  newItems[index].bulk = parseFloat(e.target.value) || 0;
                                  setEquippedItems(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                                placeholder="0"
                              />
                            </td>
                            <td className="py-1 text-center">
                              <input
                                id={`reqAtt-${index}`}
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
                  <div className="flex gap-2 mt-2 mb-8">
                    <button
                      onClick={addEquippedItem}
                      className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add Item
                    </button>

                    <button
                      onClick={removeEquippedItem}
                      disabled={equippedItems.length <= 1}
                      className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                        equippedItems.length <= 1
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-red-800 hover:bg-red-900 text-white'
                      }`}
                      title={equippedItems.length <= 1 ? "Cannot remove - minimum 1 item required" : "Remove last item"}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">Equipped Items</h3>
                  </div>
                </div>

                {/* 2. External Storage */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-600">
                          <th className="text-left py-1">Item</th>
                          <th className="text-center py-1 w-10">Bulk</th>
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
                                className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                            <td className="py-1">
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={storageItem.bulk || ''}
                                onChange={(e) => {
                                  const newItems = [...externalStorage];
                                  newItems[index].bulk = parseFloat(e.target.value) || 0;
                                  setExternalStorage(newItems);
                                }}
                                className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                                placeholder="0"
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
                                className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                                }`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 mt-2 mb-8">
                    <button
                      onClick={addExternalStorageItem}
                      className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
                    >
                      Add Item
                    </button>

                    <button
                      onClick={removeExternalStorageItem}
                      disabled={externalStorage.length <= 1}
                      className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                        externalStorage.length <= 1
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-red-800 hover:bg-red-900 text-white'
                      }`}
                      title={externalStorage.length <= 1 ? "Cannot remove - minimum 1 item required" : "Remove last item"}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <h3 className="text-sm font-bold text-gray-400">External Storage</h3>
                  </div>
                </div>

                {/* 3. Attuned Items */}
                <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
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
                                  className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                                  className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                    isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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

              {/* Right Column: Inventory */}
              <div className={`p-4 rounded-lg border shadow-xl relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-1 w-32">Item</th>
                        <th className="text-left py-1">Details</th>
                        <th className="text-center py-1 w-8">Amount</th>
                        <th className="text-center py-1 w-10">SP</th>
                        <th className="text-center py-1 w-10">Bulk</th>
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
                              className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                              className={`w-full text-xs border rounded px-1 transition-all duration-200 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="Details"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              value={inventoryItem.amount || ''}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].amount = parseInt(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              onFocus={(e) => e.target.select()}
                              className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="0"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={inventoryItem.valueSP || ''}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].valueSP = parseFloat(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="0"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={inventoryItem.bulk || ''}
                              onChange={(e) => {
                                const newItems = [...inventoryItems];
                                newItems[index].bulk = parseFloat(e.target.value) || 0;
                                setInventoryItems(newItems);
                              }}
                              onFocus={(e) => e.target.select()}
                              className={`w-12 text-center text-xs border rounded px-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2 mt-2 mb-8">
                  <button
                    onClick={addInventoryItem}
                    className="w-3/5 py-1 px-3 text-xs rounded transition-colors bg-green-500 hover:bg-green-600 text-white"
                  >
                    Add Item
                  </button>

                  <button
                    onClick={removeInventoryItem}
                    disabled={inventoryItems.length <= 1}
                    className={`w-2/5 py-1 px-3 text-xs rounded transition-colors ${
                      inventoryItems.length <= 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-red-800 hover:bg-red-900 text-white'
                    }`}
                    title={inventoryItems.length <= 1 ? "Cannot remove - minimum 1 item required" : "Remove last item"}
                  >
                    Remove
                  </button>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <h3 className="text-sm font-bold text-gray-400">Inventory</h3>
                </div>
              </div>


            </div>

          </div>
        )}

        {/* Data Tab */}
        {activeTab === 'Data' && (
          <div className="space-y-8">
            {/* 4-Column Layout */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-6 items-start">

              {/* Column 1: Level & Hit Points */}
              <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                {/* Level Selection */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-orange-400 mb-2">Level</div>
                  <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your character's level (1-20)
                  </div>
                  <select
                    value={character.level || 1}
                    onChange={(e) => updateCharacter({ level: parseInt(e.target.value) })}
                    className={`w-full text-center border rounded px-2 py-1 transition-all duration-200 font-bold ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
                    }`}
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Points</h3>
                <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Roll for HP at each level. Track your health and hit dice.
                </div>

                {/* HP Levels 1-10 and 11-20 in two columns */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column: Levels 1-10 */}
                    <div className="space-y-1">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className={`w-6 text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
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
                                : 'bg-gray-100 border-gray-300 text-gray-900'
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
                          <div className={`w-6 text-xs font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-center`}>
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
                                : 'bg-gray-100 border-gray-300 text-gray-900'
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
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Addt'l Bonuses</span>
                    <input
                      type="number"
                      value={additionalHPBonuses}
                      onChange={(e) => setAdditionalHPBonuses(parseInt(e.target.value) || 0)}
                      className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="+0"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Toughness?</span>
                    <select
                      value={hasToughness ? 'Yes' : 'No'}
                      onChange={(e) => setHasToughness(e.target.value === 'Yes')}
                      className={`text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PHB Hill Dwarf?</span>
                    <select
                      value={isPHBHillDwarf ? 'Yes' : 'No'}
                      onChange={(e) => setIsPHBHillDwarf(e.target.value === 'Yes')}
                      className={`text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                        isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Sorcery Points */}
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-300'} ${character.class !== 'Sorcerer' ? 'opacity-50' : ''}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Sorcery Points</h3>
                  <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Maximum Sorcery Points (for Sorcerer class)
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Max Points</span>
                    <input
                      type="number"
                      min="0"
                      value={character.sorceryPoints.max}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value) || 0;
                        setCharacter(prev => ({
                          ...prev,
                          sorceryPoints: {
                            ...prev.sorceryPoints,
                            max: newMax,
                            used: Math.min(prev.sorceryPoints.used, newMax)
                          }
                        }));
                      }}
                      disabled={character.class !== 'Sorcerer'}
                      className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                        character.class !== 'Sorcerer'
                          ? isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-gray-100 border-gray-300 text-gray-900'
                      }`}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Skill Bonuses */}
                <div className={`mt-6 pt-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-orange-400">Skill Bonuses</h3>
                    <button
                      onClick={() => {
                        setSkillBonuses([...skillBonuses, { skill: 'Acrobatics', bonus: 0 }]);
                      }}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                      title="Add Skill Bonus"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <div className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add bonuses to specific skills (e.g., Custom Lineage skill proficiency)
                  </div>
                  <div className="space-y-2">
                    {skillBonuses.map((sb, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <select
                          value={sb.skill}
                          onChange={(e) => {
                            const newBonuses = [...skillBonuses];
                            newBonuses[index].skill = e.target.value;
                            setSkillBonuses(newBonuses);
                          }}
                          className={`flex-1 min-w-0 text-sm border rounded px-2 py-1 transition-all duration-200 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        >
                          <option value="Acrobatics">Acrobatics</option>
                          <option value="Animal Handling">Animal Handling</option>
                          <option value="Arcana">Arcana</option>
                          <option value="Athletics">Athletics</option>
                          <option value="Deception">Deception</option>
                          <option value="History">History</option>
                          <option value="Insight">Insight</option>
                          <option value="Intimidation">Intimidation</option>
                          <option value="Investigation">Investigation</option>
                          <option value="Medicine">Medicine</option>
                          <option value="Nature">Nature</option>
                          <option value="Perception">Perception</option>
                          <option value="Performance">Performance</option>
                          <option value="Persuasion">Persuasion</option>
                          <option value="Religion">Religion</option>
                          <option value="Sleight of Hand">Sleight of Hand</option>
                          <option value="Stealth">Stealth</option>
                          <option value="Survival">Survival</option>
                        </select>
                        <input
                          type="number"
                          value={sb.bonus}
                          onChange={(e) => {
                            const newBonuses = [...skillBonuses];
                            newBonuses[index].bonus = parseInt(e.target.value) || 0;
                            setSkillBonuses(newBonuses);
                          }}
                          className={`w-14 flex-shrink-0 text-center text-sm border rounded px-1 py-1 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                          placeholder="0"
                        />
                        <button
                          onClick={() => {
                            setSkillBonuses(skillBonuses.filter((_, i) => i !== index));
                          }}
                          className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {skillBonuses.length === 0 && (
                      <div className="text-sm text-gray-500 italic">No skill bonuses added</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Speed, Hit Die, Initiative */}
              <div className="space-y-6 h-fit">
                {/* Speed Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Speed</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Enter any base speeds you have below.</p>
                  <div className="space-y-2">
                    {Object.entries(speeds).map(([speedType, value]) => (
                      <div key={speedType} className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} capitalize`}>{speedType}</label>
                        <input
                          type="number"
                          min="0"
                          value={value}
                          onChange={(e) => setSpeeds({
                            ...speeds,
                            [speedType]: parseInt(e.target.value) || 0
                          })}
                          className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                            isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-gray-100 border-gray-300 text-gray-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hit Die Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Hit Die</h3>
                  <div className="mb-3">
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Auto-calculated based on your class and level.</p>
                    <p className="text-xs text-blue-400">
                      {character.class}: {CLASS_HIT_DICE[character.class] || 'd8'} × {character.level} level{character.level !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(calculateHitDice()).map(([dieType, count]) => (
                      <div key={dieType} className="flex items-center justify-between">
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{dieType}</label>
                        <div
                          className={`w-12 text-center text-sm border rounded px-1 py-1 ${
                            count > 0
                              ? isDarkMode
                                ? 'bg-slate-600 border-slate-500 text-white font-bold'
                                : 'bg-gray-100 border-gray-300 text-gray-900 font-bold'
                              : isDarkMode
                              ? 'bg-slate-700 border-slate-600 text-gray-500'
                              : 'bg-gray-100 border-gray-300 text-gray-400'
                          }`}
                        >
                          {count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-400 italic">
                    Note: Hit dice are used during short rests to recover HP. You regain spent hit dice on a long rest (up to half your total).
                  </div>
                </div>

                {/* Initiative Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Initiative</h3>

                  {/* Total Initiative Display */}
                  <div className="mb-4 text-center">
                    <div className="text-xs text-gray-400 mb-1">Total Initiative Modifier</div>
                    <div className={`text-2xl font-bold px-4 py-2 rounded-lg border ${
                      isDarkMode ? 'bg-slate-700 border-slate-600 text-orange-400' : 'bg-gray-100 border-gray-300 text-orange-600'
                    }`}>
                      {calculateInitiativeModifier() >= 0 ? '+' : ''}{calculateInitiativeModifier()}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">DEX: {getModifier(getFinalAbilityScore('dexterity')) >= 0 ? '+' : ''}{getModifier(getFinalAbilityScore('dexterity'))} + Modifiers: {calculateInitiativeModifier() - getModifier(getFinalAbilityScore('dexterity')) >= 0 ? '+' : ''}{calculateInitiativeModifier() - getModifier(getFinalAbilityScore('dexterity'))}</div>
                  </div>

                  <p className="text-xs text-gray-400 mb-4">Select applicable modifiers:</p>
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
                          id={`init-modifier-${modifier}`}
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
                        className={`w-16 text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-slate-700 border-slate-600 text-white'
                            : 'bg-gray-100 border-gray-300 text-gray-900'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Feat/ASI Choices & Master Spell List */}
              <div className="space-y-6 h-fit">
                {/* Feat/ASI Choices Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Feat/ASI Choices</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Track your ability score improvements and feats by level.</p>

                  <div className="space-y-2">
                    {Object.entries(asiChoices).map(([levelKey, choice]) => (
                    <div key={levelKey} className="border border-slate-600 rounded p-2">
                      <div className="space-y-1">
                        {/* Level and ASI/Feat Toggle on same row */}
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Level {levelKey.replace('level', '')}</h4>
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
                              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ASI</span>
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
                              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Feat</span>
                            </label>
                          </div>
                        </div>

                        {choice.type === 'ASI' ? (
                          <div className="grid grid-cols-3 gap-1">
                            {Object.entries(choice.abilityIncreases).map(([ability, increase]) => (
                              <label key={ability} className="flex items-center text-xs">
                                <input
                                  id={`asi-${levelKey}-${ability}`}
                                  type="checkbox"
                                  checked={increase > 0}
                                  onChange={(e) => {
                                    setAsiChoices(prev => {
                                      const currentChoices = prev[levelKey as keyof typeof prev].abilityIncreases;
                                      const checkedCount = Object.values(currentChoices).filter(val => val > 0).length;

                                      if (e.target.checked) {
                                        // If trying to check more than 2 boxes, prevent it
                                        if (checkedCount >= 2) {
                                          return prev;
                                        }

                                        // Calculate the bonus: +2 if only one ability, +1 if two abilities
                                        const newCheckedCount = checkedCount + 1;
                                        const bonusPerAbility = newCheckedCount === 1 ? 2 : 1;

                                        // Update all checked abilities with correct bonus
                                        const updatedIncreases = { ...currentChoices };
                                        Object.keys(updatedIncreases).forEach(key => {
                                          if (updatedIncreases[key as keyof typeof updatedIncreases] > 0) {
                                            updatedIncreases[key as keyof typeof updatedIncreases] = bonusPerAbility;
                                          }
                                        });
                                        updatedIncreases[ability as keyof typeof updatedIncreases] = bonusPerAbility;

                                        return {
                                          ...prev,
                                          [levelKey]: {
                                            ...prev[levelKey as keyof typeof prev],
                                            abilityIncreases: updatedIncreases
                                          }
                                        };
                                      } else {
                                        // Unchecking a box
                                        const updatedIncreases = { ...currentChoices, [ability]: 0 };

                                        // Recalculate bonuses for remaining checked abilities
                                        const remainingChecked = Object.values(updatedIncreases).filter(val => val > 0).length;
                                        const bonusPerAbility = remainingChecked === 1 ? 2 : 1;

                                        Object.keys(updatedIncreases).forEach(key => {
                                          if (updatedIncreases[key as keyof typeof updatedIncreases] > 0) {
                                            updatedIncreases[key as keyof typeof updatedIncreases] = bonusPerAbility;
                                          }
                                        });

                                        return {
                                          ...prev,
                                          [levelKey]: {
                                            ...prev[levelKey as keyof typeof prev],
                                            abilityIncreases: updatedIncreases
                                          }
                                        };
                                      }
                                    });
                                  }}
                                  className="mr-1 scale-75"
                                />
                                <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{ability.slice(0, 3).toUpperCase()}</span>
                                {increase > 0 && (
                                  <span className="text-green-400 text-xs ml-1">+{increase}</span>
                                )}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
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
                              onBlur={(e) => {
                                // When user finishes typing a feat name, add it to manual feats if not empty
                                if (e.target.value.trim() && !manualFeats.some(feat => feat.name === e.target.value.trim())) {
                                  addManualFeat(e.target.value.trim(), `Feat gained at level ${levelKey.replace('level', '')}`);
                                }
                              }}
                              className={`w-full text-xs border rounded px-2 transition-all duration-200 py-1 ${
                                isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'
                              }`}
                            />
                            <p className="text-xs text-gray-500 italic">This feat will also appear in the Character Features section below.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Master Spell List Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Master Spell List</h3>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const jsonData = JSON.parse(event.target?.result as string);
                            console.log('Raw JSON data:', jsonData);

                            let spellArray = [];

                            // Handle different JSON structures
                            if (Array.isArray(jsonData)) {
                              spellArray = jsonData;
                            } else if (jsonData.spells && Array.isArray(jsonData.spells)) {
                              spellArray = jsonData.spells;
                            } else if (jsonData.data && Array.isArray(jsonData.data)) {
                              spellArray = jsonData.data;
                            } else if (typeof jsonData === 'object') {
                              // Handle object format where spell names are keys (like tadzik/5e-spells format)
                              const spellNames = Object.keys(jsonData);
                              if (spellNames.length > 0 && typeof jsonData[spellNames[0]] === 'object') {
                                // Convert object format to array format
                                spellArray = spellNames.map(spellName => ({
                                  name: spellName,
                                  Name: spellName,
                                  level: jsonData[spellName].level,
                                  Level: jsonData[spellName].level,
                                  school: jsonData[spellName].school,
                                  School: jsonData[spellName].school,
                                  casting_time: jsonData[spellName].casting_time,
                                  CastingTime: jsonData[spellName].casting_time,
                                  range: jsonData[spellName].range,
                                  Range: jsonData[spellName].range,
                                  components: jsonData[spellName].components,
                                  Components: jsonData[spellName].components,
                                  duration: jsonData[spellName].duration,
                                  Duration: jsonData[spellName].duration,
                                  description: jsonData[spellName].description,
                                  Description: jsonData[spellName].description,
                                  effect: jsonData[spellName].description,
                                  Effect: jsonData[spellName].description
                                }));
                              } else {
                                // If it's an object with spell properties, treat each property as a potential spell array
                                for (const key in jsonData) {
                                  if (Array.isArray(jsonData[key])) {
                                    spellArray = jsonData[key];
                                    break;
                                  }
                                }
                                // If no arrays found, try to treat the object itself as a single spell
                                if (spellArray.length === 0) {
                                  spellArray = [jsonData];
                                }
                              }
                            }

                            console.log('Processed spell array:', spellArray);
                            setMasterSpellList(spellArray);

                            // Save spell data to localStorage
                            try {
                              localStorage.setItem('dnd-master-spell-list', JSON.stringify(spellArray));
                            } catch (error) {
                              console.warn('Failed to save spell data to localStorage:', error);
                            }

                            if (spellArray.length === 0) {
                              alert('No spells found in the JSON file. Please check the file structure.');
                            } else {
                              alert(`Successfully loaded ${spellArray.length} spells!`);
                            }
                          } catch (error) {
                            console.error('JSON parsing error:', error);
                            alert('Error reading JSON file. Please check the file format.');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className={`w-full px-2 py-1 text-xs rounded border bg-transparent ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 ${
                      isDarkMode ? 'border-slate-600 focus:border-orange-400' : 'border-gray-400 focus:border-orange-500'
                    } focus:outline-none focus:ring-1 focus:ring-orange-500`}
                  />
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Upload JSON file</p>
                  {masterSpellList.length > 0 && (
                    <div className="mt-2 text-center">
                      <p className="text-xs text-green-400">✓ {masterSpellList.length} spells loaded</p>
                    </div>
                  )}
                </div>

                {/* Vibe Effects Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Vibe Effects</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Select an ambiance effect for your adventure.</p>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {['none', 'rain', 'snow', 'stars', 'magic', 'leaves', 'embers', 'ash', 'desert'].map((effect) => (
                      <label key={effect} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="vibeEffect"
                          value={effect}
                          checked={vibeEffects === effect}
                          onChange={(e) => setVibeEffects(e.target.value)}
                          className="mr-2"
                        />
                        <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {effect}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Opacity: {vibeOpacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={vibeOpacity}
                      onChange={(e) => setVibeOpacity(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Column 4: Calendar & Carrying Size */}
              <div className="space-y-6 h-fit">
                {/* Calendar Box */}
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
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
                          className={`w-full text-center text-sm border rounded px-2 py-1 transition-all duration-200 ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                          className={`w-full text-center text-sm border rounded px-2 py-1 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                        className={`w-full text-sm border rounded px-2 py-1 transition-all duration-200 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-gray-100 border-gray-300 text-gray-900'
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
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Carrying Size</h3>
                  <p className="text-xs text-gray-400 mb-4">Select the size you count as when determining carrying capacity.</p>
                  <select
                    value={carryingSize}
                    onChange={(e) => setCarryingSize(e.target.value)}
                    className={`w-full border rounded px-3 py-2 ${
                      isDarkMode
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-900'
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
                <div className={`p-4 rounded-lg border shadow-xl h-fit ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-300'}`}>
                  <h3 className="text-lg font-semibold text-orange-400 mb-2">Images</h3>
                  <p className="text-xs text-gray-400 mb-4">Upload images for character display and background.</p>
                  
                  <div className="space-y-4">
                    {/* Stats Image URL */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Stats Page Image URL</label>
                      <input
                        type="text"
                        placeholder="https://imgur.com/your-image.jpg"
                        value={statsImage}
                        onChange={(e) => handleImageUrlChange(e.target.value, setStatsImage)}
                        className={`w-full text-sm border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      {statsImage && (
                        <div className="mt-2">
                          <img src={statsImage} alt="Stats preview" className="w-full h-20 object-cover rounded border" />
                        </div>
                      )}
                    </div>

                    {/* Background Image URL with Blur */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Background Image URL</label>
                      <input
                        type="text"
                        placeholder="https://imgur.com/your-background.jpg"
                        value={backgroundImage}
                        onChange={(e) => handleImageUrlChange(e.target.value, setBackgroundImage)}
                        className={`w-full text-sm border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                      <div className="mt-2">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Blur: {backgroundBlur}px</label>
                        <input
                          type="range"
                          min="0"
                          max="10"
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

                    {/* Character Image URL */}
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Character Tab Image URL</label>
                      <input
                        type="text"
                        placeholder="https://imgur.com/your-character.jpg"
                        value={characterImage}
                        onChange={(e) => handleImageUrlChange(e.target.value, setCharacterImage)}
                        className={`w-full text-sm border rounded px-3 py-2 ${
                          isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-500' : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
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

        {/* Spell Hover Card */}
        {hoveredSpell && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 10,
              maxWidth: '400px',
            }}
          >
            <div className={`p-4 rounded-lg border shadow-xl ${
              isDarkMode
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-900'
            }`}>
              <div className="space-y-3">
                {/* Spell Name and Level */}
                <div className="border-b border-slate-600 pb-2">
                  <h3 className="text-lg font-bold text-orange-400">
                    {hoveredSpell.Name || hoveredSpell.name || 'Unknown Spell'}
                  </h3>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isNaN(parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level))
                      ? 'Unknown Level'
                      : parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level) === 0
                        ? 'Cantrip'
                        : `Level ${Math.floor(parseFloat(hoveredSpell.Level !== undefined ? hoveredSpell.Level : hoveredSpell.level))}`
                    } • {hoveredSpell.School || hoveredSpell.school || 'Unknown School'}
                  </div>
                </div>

                {/* Spell Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-semibold text-orange-300">Casting Time:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell.CastingTime || hoveredSpell.casting_time || hoveredSpell.castingTime || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-300">Range:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell.Range || hoveredSpell.range || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-300">Duration:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell.Duration || hoveredSpell.duration || 'Unknown'}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-orange-300">Components:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell.Components || hoveredSpell.components || 'Unknown'}</div>
                  </div>
                </div>

                {/* Area/Targets */}
                {(hoveredSpell['Area or Targets'] || hoveredSpell.area_of_effect || hoveredSpell.areaOfEffect || hoveredSpell.targets) && (
                  <div className="text-sm">
                    <span className="font-semibold text-orange-300">Area/Targets:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell['Area or Targets'] || hoveredSpell.area_of_effect || hoveredSpell.areaOfEffect || hoveredSpell.targets}</div>
                  </div>
                )}

                {/* Save/Attack */}
                {(hoveredSpell['Save or Attack'] || hoveredSpell.save || hoveredSpell.attack) && (
                  <div className="text-sm">
                    <span className="font-semibold text-orange-300">Save/Attack:</span>
                    <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{hoveredSpell['Save or Attack'] || hoveredSpell.save || hoveredSpell.attack}</div>
                  </div>
                )}

                {/* Effect/Description */}
                <div className="text-sm">
                  <span className="font-semibold text-orange-300">Effect:</span>
                  <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-900'} mt-1 max-h-32 overflow-y-auto`}>
                    {hoveredSpell.Effect || hoveredSpell.description || hoveredSpell.effect || 'No description available'}
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