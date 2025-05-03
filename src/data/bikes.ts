import { Bike } from '../types';

// Helper function to get bike image path
const getBikeImagePath = (bikeName: string): string => {
  // Remove any existing extension
  const baseName = bikeName.replace(/\.(jpg|avif)$/, '');
  // Return path with jpg extension since most images are in jpg format
  return `/images/bikes/${baseName}.jpg`;
};

export const bikes: Bike[] = [
  {
    id: 'b1a2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Honda Activa 6G',
    type: 'scooter',
    pricePerDay: 350,
    imageUrl: getBikeImagePath('Honda Activa 6G'),
    isAvailable: true,
    description: 'Most popular scooter in India, perfect for city commutes with excellent mileage.'
  },
  {
    id: 'b2b2c3d4-e5f6-7890-abcd-ef1234567891',
    name: 'TVS Jupiter',
    type: 'scooter',
    pricePerDay: 300,
    imageUrl: getBikeImagePath('TVS Jupiter.jpg'),
    isAvailable: true,
    description: 'Comfortable scooter with large storage space and smooth ride quality.'
  },
  {
    id: 'b3a2c3d4-e5f6-7890-abcd-ef1234567892',
    name: 'Royal Enfield Classic 350',
    type: 'touring',
    pricePerDay: 800,
    imageUrl: getBikeImagePath('Royal Enfield Classic 350'),
    isAvailable: true,
    description: 'Iconic motorcycle with a powerful thump, perfect for long rides and highways.'
  },
  {
    id: 'b4a2c3d4-e5f6-7890-abcd-ef1234567893',
    name: 'Hero Splendor Plus',
    type: 'commuter',
    pricePerDay: 250,
    imageUrl: getBikeImagePath('Hero Splendor Plus'),
    isAvailable: true,
    description: 'India\'s best-selling motorcycle known for reliability and fuel efficiency.'
  },
  {
    id: 'b5a2c3d4-e5f6-7890-abcd-ef1234567894',
    name: 'Bajaj Pulsar NS200',
    type: 'sports',
    pricePerDay: 700,
    imageUrl: getBikeImagePath('Bajaj Pulsar NS200'),
    isAvailable: true,
    description: 'Sporty performance motorcycle with aggressive styling and quick acceleration.'
  },
  {
    id: 'b6a2c3d4-e5f6-7890-abcd-ef1234567895',
    name: 'Royal Enfield Himalayan',
    type: 'adventure',
    pricePerDay: 900,
    imageUrl: getBikeImagePath('Royal Enfield Himalayan'),
    isAvailable: true,
    description: 'Purpose-built adventure tourer designed for all terrains including mountains.'
  },
  {
    id: 'b7a2c3d4-e5f6-7890-abcd-ef1234567896',
    name: 'Ather 450X',
    type: 'electric',
    pricePerDay: 500,
    imageUrl: getBikeImagePath('Ather 450X'),
    isAvailable: true,
    description: 'Premium electric scooter with smart features and impressive performance.'
  },
  {
    id: 'b8a2c3d4-e5f6-7890-abcd-ef1234567897',
    name: 'Suzuki Access 125',
    type: 'scooter',
    pricePerDay: 320,
    imageUrl: getBikeImagePath('Suzuki Access 125'),
    isAvailable: true,
    description: 'Powerful 125cc scooter with excellent build quality and features.'
  },
  {
    id: 'b9a2c3d4-e5f6-7890-abcd-ef1234567898',
    name: 'KTM Duke 200',
    type: 'sports',
    pricePerDay: 750,
    imageUrl: getBikeImagePath('KTM Duke 200'),
    isAvailable: true,
    description: 'Lightweight sporty motorcycle with aggressive styling and handling.'
  },
  {
    id: 'b0a2c3d4-e5f6-7890-abcd-ef1234567899',
    name: 'Yamaha R15 V4',
    type: 'sports',
    pricePerDay: 800,
    imageUrl: getBikeImagePath('Yamaha R15 V4'),
    isAvailable: true,
    description: 'Race-inspired sports bike with aerodynamic design and impressive performance.'
  },
  {
    id: 'b3a2c3d4-e5f6-7890-abcd-ef1234567892',
    name: 'Royal Enfield Bullet 350',
    type: 'touring',
    pricePerDay: 850,
    imageUrl: getBikeImagePath('Royal Enfield Bullet 350'),
    isAvailable: true,
    description: 'Iconic motorcycle with a powerful thump, perfect for long rides and highways.'
  }
];
