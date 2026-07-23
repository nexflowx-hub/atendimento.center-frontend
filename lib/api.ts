import { getSupabaseBrowserClient } from './supabase';
import type {
  AuthenticatedProfile,
  ChatwootConversation,
  ChatwootMessage,
  ConversationListResponse,
} from './types';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.atendimento.center/api/v1').replace(/\/$/, '');

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error('AUTH_REQUIRED');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${data.session.access_token}`,
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    cache: 'no-store',
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    if (response.status === 401) {
      await supabase.auth.signOut();
      throw new Error('AUTH_REQUIRED');
    }

    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : `API respondeu HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function getProfile(): Promise<AuthenticatedProfile> {
  return apiRequest<AuthenticatedProfile>('/me');
}

export function listConversations(status = 'open', query = ''): Promise<ConversationListResponse> {
  const params = new URLSearchParams({ status, assigneeType: 'all', page: '1' });
  if (query.trim()) {
    params.set('q', query.trim());
  }
  return apiRequest<ConversationListResponse>(`/conversations?${params.toString()}`);
}

export function getConversation(conversationId: number): Promise<ChatwootConversation> {
  return apiRequest<ChatwootConversation>(`/conversations/${conversationId}`);
}

export function sendConversationMessage(
  conversationId: number,
  content: string,
): Promise<ChatwootMessage> {
  return apiRequest<ChatwootMessage>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export function updateConversationStatus(
  conversationId: number,
  status: 'open' | 'resolved' | 'pending',
): Promise<unknown> {
  return apiRequest(`/conversations/${conversationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
