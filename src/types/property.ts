export type TransactionType = 'sale' | 'rent';

export type PropertyType = 
  | 'apartment' 
  | 'house' 
  | 'villa' 
  | 'land' 
  | 'office' 
  | 'commercial' 
  | 'building' 
  | 'other';

export type PricePeriod = 'month' | 'year' | 'total';

export type PropertyStatus = 'available' | 'rented' | 'sold' | 'unavailable';

export interface Property {
  id: string;
  title: string;
  slug: string;
  reference: string;
  description: string;
  transaction_type: TransactionType;
  property_type: PropertyType;
  price: number;
  price_period?: PricePeriod;
  location: string;
  city: string;
  neighborhood?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  features: string[];
  main_image: string;
  images: string[];
  featured: boolean;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  transactionType: 'all' | TransactionType;
  propertyType: 'all' | PropertyType;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Appartement',
  house: 'Maison',
  villa: 'Villa',
  land: 'Terrain',
  office: 'Bureau',
  commercial: 'Commerce',
  building: 'Immeuble',
  other: 'Autre'
};

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  sale: 'Vente',
  rent: 'Location'
};

export const STATUS_LABELS: Record<PropertyStatus, { label: string; color: string }> = {
  available: { label: 'Disponible', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rented: { label: 'Loué', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  sold: { label: 'Vendu', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  unavailable: { label: 'Indisponible', color: 'bg-gray-100 text-gray-800 border-gray-300' }
};

export const AVAILABLE_FEATURES = [
  'Parking',
  'Climatisation',
  'Balcon',
  'Terrasse',
  'Cuisine équipée',
  'Eau',
  'Électricité',
  'Gardien',
  'Ascenseur',
  'Sécurité',
  'Piscine',
  'Jardin'
];
