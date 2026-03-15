export interface AgeGroup {
  ageGroupId: number;
  name: string;
  description: string;
}

export interface ToyType {
  typeId: number;
  name: string;
  description: string;
}

export interface ToyApi {
  toyId: number;
  name: string;
  description: string;
  type: ToyType;
  ageGroup: AgeGroup;
  targetGroup: string;
  productionDate: string;
  price: number;
  imageUrl: string;
  permalink: string;
}

export interface Toy extends ToyApi {
  reviews: Review[];
  averageRating: number;
}

import { Review } from './review.model';
