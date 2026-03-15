import { Toy } from './toy.model';

export interface CartItem {
  id: number;
  toy: Toy;
  quantity: number;
  status: 'rezervisano' | 'pristiglo' | 'otkazano';
  dateAdded: string;
  userRating?: number;
}
