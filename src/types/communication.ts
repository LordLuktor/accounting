export interface CommunicationCard {
  id: string;
  text: string;
  icon: string;
  category: 'actions' | 'descriptors' | 'people' | 'time' | 'feelings' | 'places' | 'objects';
  color: string;
  frequency?: number;
  isFavorite?: boolean;
}

export interface CommunicationBoard {
  id: string;
  name: string;
  description: string;
  cards: CommunicationCard[];
  isDefault: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunicationSession {
  id: string;
  user_id: string;
  board_id: string;
  selected_cards: string[];
  message: string;
  timestamp: string;
}