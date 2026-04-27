export type ItemType = 'book' | 'manga' | 'comic';
export type ItemStatus = 'wishlist' | 'owned' | 'reading' | 'read' | 'dnf';
export type ItemSource = 'google_books' | 'open_library' | 'anilist' | 'comicvine' | 'manual';

export interface Item {
  id: string;
  title: string;
  creator?: string;
  cover_url?: string;
  type: ItemType;
  isbn?: string;
  external_id?: string;
  source?: ItemSource;
  status: ItemStatus;
  rating?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  series?: string;
  volume?: number;
  date_added: string;
  date_finished?: string;
}
