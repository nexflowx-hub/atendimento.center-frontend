export interface AuthenticatedProfile {
  success: boolean;
  user: {
    id: string;
    email: string | null;
    name: string;
  };
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: string;
  };
}

export interface ChatwootContact {
  id?: number;
  name?: string;
  email?: string;
  phone_number?: string;
  thumbnail?: string;
  avatar_url?: string;
}

export interface ChatwootMessage {
  id: number;
  content: string | null;
  message_type: number;
  created_at: number;
  private?: boolean;
  status?: string | null;
  sender?: ChatwootContact;
}

export interface ChatwootConversation {
  id: number;
  status: 'open' | 'resolved' | 'pending' | 'snoozed';
  unread_count?: number;
  last_activity_at?: number;
  created_at?: number;
  labels?: string[];
  can_reply?: boolean;
  messages?: ChatwootMessage[];
  meta?: {
    sender?: ChatwootContact;
    assignee?: ChatwootContact | null;
    channel?: string;
  };
  last_non_activity_message?: ChatwootMessage | null;
}

export interface ConversationListResponse {
  data: {
    meta: {
      mine_count?: number;
      unassigned_count?: number;
      assigned_count?: number;
      all_count?: number;
    };
    payload: ChatwootConversation[];
  };
}
