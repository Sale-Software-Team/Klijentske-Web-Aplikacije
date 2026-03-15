export interface Review {
  id: number;
  toyId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  reviewerType: 'dete' | 'roditelj';
}
