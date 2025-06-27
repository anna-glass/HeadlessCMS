export type Message = {
    id: number;
    user_id: string;
    content: string;
    intent: 'inventory' | 'story' | 'photos';
    media?: string[];
    created_at: string;
  };
  