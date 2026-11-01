/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChickenSkin {
  id: string;
  name: string;
  cost: number;
  bodyColor: string;
  bellyColor: string;
  combColor: string;
  beakColor: string;
  wingColor: string;
  footColor: string;
  eyeColor: string;
  description: string;
}

export interface ChickenHat {
  id: string;
  name: string;
  cost: number;
  type: 'none' | 'tophat' | 'crown' | 'aviator' | 'ninja' | 'chef';
  description: string;
}

export const SKINS: ChickenSkin[] = [
  {
    id: 'face_hero',
    name: 'Gravity Hero',
    cost: 0,
    bodyColor: '#3B82F6',
    bellyColor: '#60A5FA',
    combColor: '#1D4ED8',
    beakColor: '#F59E0B',
    wingColor: '#2563EB',
    footColor: '#EF4444',
    eyeColor: '#1E293B',
    description: 'The smiling champion defying the laws of gravity!'
  },
  {
    id: 'classic',
    name: 'Classic Clucker',
    cost: 0,
    bodyColor: '#FFFFFF',
    bellyColor: '#E6EDF5',
    combColor: '#DE3838',
    beakColor: '#FF9E1B',
    wingColor: '#EDF2F7',
    footColor: '#FF9E1B',
    eyeColor: '#1A202C',
    description: 'The heroic barnyard rebel who defies Isaac Newton!'
  },
  {
    id: 'golden',
    name: 'Golden Phoenix',
    cost: 50,
    bodyColor: '#F6E05E',
    bellyColor: '#ECC94B',
    combColor: '#DD6B20',
    beakColor: '#C05621',
    wingColor: '#D69E2E',
    footColor: '#DD6B20',
    eyeColor: '#2D3748',
    description: 'Shimmering in pure barnyard gold.'
  },
  {
    id: 'cyber',
    name: 'Cyber Robo-Hen',
    cost: 100,
    bodyColor: '#4FD1C5',
    bellyColor: '#319795',
    combColor: '#E53E3E',
    beakColor: '#F6AD55',
    wingColor: '#285E61',
    footColor: '#718096',
    eyeColor: '#E53E3E',
    description: 'Equipped with anti-grav magnetic thrusters.'
  },
  {
    id: 'midnight',
    name: 'Shadow Raven',
    cost: 150,
    bodyColor: '#2D3748',
    bellyColor: '#1A202C',
    combColor: '#9B2C2C',
    beakColor: '#CBD5E0',
    wingColor: '#4A5568',
    footColor: '#4A5568',
    eyeColor: '#ECC94B',
    description: 'A shadowy bird that slips unseen through gravity portals.'
  },
  {
    id: 'bubblegum',
    name: 'Pastel Flamingo',
    cost: 75,
    bodyColor: '#FBB6CE',
    bellyColor: '#ED64A6',
    combColor: '#D53F8C',
    beakColor: '#F6AD55',
    wingColor: '#F687B3',
    footColor: '#ED64A6',
    eyeColor: '#1A202C',
    description: 'Pretty in pink, fabulous in zero-G!'
  }
];

export const HATS: ChickenHat[] = [
  { id: 'none', name: 'No Hat', cost: 0, type: 'none', description: 'Au naturel feathers.' },
  { id: 'tophat', name: 'Dapper Top Hat', cost: 30, type: 'tophat', description: 'For gentlemanly gravity inversions.' },
  { id: 'crown', name: 'Royal Crown', cost: 80, type: 'crown', description: 'Monarch of the skies and ceilings.' },
  { id: 'aviator', name: 'Sky Goggles', cost: 40, type: 'aviator', description: 'Aerodynamic vision for high-G maneuvers.' },
  { id: 'ninja', name: 'Shinobi Headband', cost: 60, type: 'ninja', description: 'Silent leaps between ceiling rafters.' },
  { id: 'chef', name: 'Master Chef Toque', cost: 45, type: 'chef', description: 'Ready to bake up some upside-down pies.' }
];
