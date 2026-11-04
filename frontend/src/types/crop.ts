export interface Crop {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price_per_unit: number;
  status: string;
  created_at: string;
}

export type CropFormData = Omit<Crop, 'id' | 'created_at'>;