
export interface Video {
  id: string;
  url: string;
  title: string;
  category: string;
  thumbnail?: string;
  createdAt?: Date; // For Firestore timestamp sorting. Will be a JS Date object.
}