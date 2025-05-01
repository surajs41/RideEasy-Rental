
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  drivingLicenseNumber: string;
  dateOfBirth: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
};

export type Bike = {
  id: string;
  name: string;
  type: 'scooter' | 'commuter' | 'electric' | 'touring' | 'sports' | 'adventure';
  pricePerDay: number;
  imageUrl: string;
  isAvailable: boolean;
  description: string;
};

export type Booking = {
  id: string;
  userId: string;
  bikeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid';
};

export type LoginForm = {
  email: string;
  password: string;
};

export type RegistrationForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  drivingLicenseNumber: string;
  dateOfBirth: string;
};
