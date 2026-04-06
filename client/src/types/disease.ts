export interface Treatment {
  id: number;
  name: string;
  type: string; // "Fungicide", "Pesticide", etc.
  dosage: string;
  instructions?: string;
}

export interface Disease {
  id: number;
  name: string;
  symptoms: string;
  imageUrl: string;
  treatments: Treatment[];
}

export interface CropData {
  id: number;
  name: string;
  image?: string;
  diseases: Disease[];
}