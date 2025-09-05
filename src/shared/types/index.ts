export type EntityId = string;
export type UserId = string;

export type Entity = {
  id: EntityId;
  name: string;
  address: string;
  capacity: number;
  imageUrl?: string;
  description?: string;
  priceSeed: number;
  createdAt: Date;
  ownerId: UserId;
};

export type CreateEntityInput = Omit<Entity, 'id' | 'createdAt' | 'ownerId'>;
export type UpdateEntityInput = Partial<CreateEntityInput>;

export interface UserData {
  calories: number
  protein: number
  fat: number
  carbs: number
  dailyGoal: number
}

export interface NutritionData {
  label: string
  value: string
  color: string
}

export interface Ingredient {
  name: string
  amount: string
}

export interface Meal {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  bgColor: string
  iconColor: string
} 