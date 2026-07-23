'use client';

import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  ContactRound,
  Inbox,
  LogOut,
  MessageSquareText,
  RefreshCw,
  Search,
  Send,
  Settings,
  Smartphone,
  Workflow,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getConversation,
  getProfile,
  listConversations,
  sendConversationMessage,
  updateConversationStatus,
} from '@/lib/api';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import type {
  AuthenticatedProfile,
  ChatwootConversation,
  ChatwootMessage,
  ConversationListResponse,
} from '@/lib/types';

function contactName(conversation: ChatwootConversation | null): string {
  return conversation?.meta?.sender?.name || conversation?.meta?.sender?.phone_number || `Conversa #${conversation?.id ?? ''}`;
}

function initials(value: string): string {
  const letters = value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return letters || 'AC';
}

function timeLabel(timestamp?: number): string {
  if (!timestamp) return '—';
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp * 1000));
}

function lastMessage(conversation: ChatwootConversation): ChatwootMessage | undefined {
  return conversation.last_non_activity_message || conversation.messages?.at(-1) || undefined;
}

export function DashboardApp() {
  const router = useRouter();
  const [profile, setProfile] = useState<AuthenticatedProfile | null>(null);
  const [list, setList] = useState<ConversationListResponse | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selected, setSelected] = useState<ChatwootConversation | null>(null);
  const [status, setStatus] = useState<'open' | 'resolved' | 'pending'>('open');
  const [search, setSearch] = useState('');
  const [composer, setComposer] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const conversations = list?.data?.payload ?? [];
  const counts = list?.data?.meta ?? {};

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let active = true;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        router.replace('/login');
        return;
      }

      try {
        const currentProfile = await getProfile();
        const currentList = await listConversations(status, search);
        if (!active) return;
        setProfile(currentProfile);
        setList(currentList);
        const firstId = currentList.data?.payload?.[0]?.id ?? null;
        setSelectedId((current) => current ?? firstId);
      } catch (loadError) {
        if (loadError instanceof Error && loadError.message === 'AUTH_REQUIRED') {
          router.replace('/login');
          return;
        }
        setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar o painel.');
      } finally {
        if (active) setLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (loading) return;
    const timeout = window.setTimeout(() => {
      void refreshList(false);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [search, status]);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    void refreshConversation(selectedId);
  }, [selectedId]);

  useEffect(() => {
    if (loading) return;
    const interval = window.setInterval(() => {
      void refreshList(true);
      if (selectedId) void refreshConversation(selectedId, true);
    }, 10000);
    return () => window.clearInterval(interval);
  }, [loading, selectedId, status, search]);

  async function refreshList(preserveSelection = true) {
    try {
      const response = await listConversations(status, search);
      setList(response);
      const available = response.data?.payload ?? [];
      if (!preserveSelection || !selectedId || !available.some((item) => item.id === selectedId)) {
        setSelectedId(available[0]?.id ?? null);
      }
      setError('');
    } catch (loadError) {
      if (loadError instanceof Error && loadError.message === 'AUTH_REQUIRED') {
        router.replace('/login');
        return;
      }
      setError(loadError instanceof Error ? loadError.message : 'Falha ao atualizar conversas.');
    }
  }

  async function refreshConversation(conversationId: number, silent = false) {
    if (!silent) setConversationLoading(true);
    try {
      const response = await getConversation(conversationId);
      setSelected(response);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Falha ao abrir a conversa.');
    } finally {
      if (!silent) setConversationLoading(false);
    }
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = composer.trim();
    if (!selectedId || !content || sending) return;

    setSending(true);
    try {
      await sendConversationMessage(selectedId, content);
      setComposer('');
      await Promise.all([refreshConversation(selectedId, true), refreshList(true)]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Não foi possível enviar a mensagem.');
    } finally {
      setSending(false);
    }
  }

  async function toggleSelectedStatus() {
    if (!selectedId || !selected) return;
    const nextStatus = selected.status === 'resolved' ? 'open' : 'resolved';
    try {
      await updateConversationStatus(selectedId, nextStatus);
      await Promise.all([refreshConversation(selectedId, true), refreshList(false)]);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Não foi possível alterar o estado.');
    }
  }

  async function logout() {
    await getSupabaseBrowserClient().auth.signOut();
    router.replace('/login');
  }

  const messages = useMemo(
    () => (selected?.messages ?? []).filter((message) => !message.private),
    [selected],
  );

  if (loading) {
    return <main className="dashboard-loading"><RefreshCw className="spin" size={28} /><b>A preparar o Atendimento.Center…</b></main>;
  }

  const tenantName = profile?.tenant.name ?? 'Atendimento.Center';
  const userName = profile?.user.name ?? 'Utilizador';

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="brand dashboard-brand" href="/"><span>Atendimento.</span><strong>Center</strong><small>by Atlas Global</small></a>
        <nav>
          <a className="active" href="/app"><Inbox size={19} /> Caixa de entrada</a>
          <a aria-disabled="true"><ContactRound size={19} /> Contactos</a>
          <a aria-disabled="true"><Workflow size={19} /> Automação</a>
          <a aria-disabled="true"><Bot size={19} /> IA & Conhecimento</a>
          <a aria-disabled="true"><BarChart3 size={19} /> Relatórios</a>
          <a aria-disabled="true"><Settings size={19} /> Configurações</a>
        </nav>
        <div className="tenant-card"><i /><div><b>{tenantName}</b><small>Operação ativa</small></div></div>
        <button className="user-card user-button" type="button" onClick={logout}>
          <div className="avatar avatar-large">{initials(userName)}</div><div><b>{userName}</b><small>{profile?.user.email}</small></div><LogOut size={17} />
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar nas conversas" /></label>
          <div className="channel-tabs"><button className="selected"><Smartphone size={15} /> WhatsApp</button></div>
          <button className="button button-light compact" type="button" onClick={() => void refreshList(true)}><RefreshCw size={16} /> Atualizar</button>
          <button className="tenant-switch" type="button"><span className="avatar">{initials(tenantName)}</span>{tenantName}<ChevronDown size={16} /></button>
        </header>

        {error ? <div className="dashboard-alert">{error}</div> : null}

        <div className="workspace">
          <section className="conversation-panel">
            <header>
              <b>{status === 'open' ? 'Conversas abertas' : status === 'resolved' ? 'Conversas resolvidas' : 'Conversas pendentes'}</b>
              <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                <option value="open">Abertas</option>
                <option value="pending">Pendentes</option>
                <option value="resolved">Resolvidas</option>
              </select>
            </header>
            {conversations.length ? conversations.map((conversation) => {
              const name = contactName(conversation);
              const message = lastMessage(conversation);
              return (
                <button className={conversation.id === selectedId ? 'conversation-row active conversation-button' : 'conversation-row conversation-button'} key={conversation.id} type="button" onClick={() => setSelectedId(conversation.id)}>
                  <div className="avatar">{initials(name)}</div>
                  <div className="conversation-copy"><b>{name}</b><p>{message?.content || 'Nova conversa'}</p><span>{conversation.status}</span></div>
                  <time>{timeLabel(conversation.last_activity_at || message?.created_at)}</time>
                </button>
              );
            }) : (
              <div className="empty-state compact-empty"><MessageSquareText size={30} /><b>Nenhuma conversa</b><p>Assim que o primeiro WhatsApp estiver ligado, as mensagens aparecerão aqui.</p></div>
            )}
          </section>

          <section className="chat-column">
            <div className="kpi-row">
              <article><small>Conversas abertas</small><b>{status === 'open' ? counts.all_count ?? conversations.length : '—'}</b><span>Ao vivo</span></article>
              <article><small>Não atribuídas</small><b>{counts.unassigned_count ?? 0}</b><span>Equipa</span></article>
              <article><small>Visíveis nesta página</small><b>{conversations.length}</b><span>Chatwoot</span></article>
              <article><small>Canal</small><b>WA</b><span>Evolution</span></article>
            </div>

            <div className="chat-card">
              {selected ? (
                <>
                  <header className="chat-header">
                    <div><MessageSquareText size={20} /><b>{contactName(selected)}</b><span>{selected.status}</span></div>
                    <button className="button button-light compact" type="button" onClick={toggleSelectedStatus}><CheckCircle2 size={16} />{selected.status === 'resolved' ? 'Reabrir' : 'Resolver'}</button>
                  </header>
                  <div className="chat-stream">
                    {conversationLoading ? <div className="empty-state"><RefreshCw className="spin" size={24} /><p>A carregar mensagens…</p></div> : null}
                    {!conversationLoading && messages.length === 0 ? <div className="empty-state"><MessageSquareText size={30} /><b>Sem mensagens visíveis</b></div> : null}
                    {messages.map((message) => (
                      <div className={message.message_type === 1 ? 'chat-message outgoing' : 'chat-message incoming'} key={message.id}>
                        <p>{message.content || 'Anexo ou conteúdo não textual'}</p>
                        <time>{timeLabel(message.created_at)}{message.message_type === 1 && message.status ? ` · ${message.status}` : ''}</time>
                      </div>
                    ))}
                  </div>
                  <form className="composer" onSubmit={handleSend}>
                    <input value={composer} onChange={(event) => setComposer(event.target.value)} placeholder={selected.can_reply === false ? 'Esta conversa não aceita resposta' : 'Escrever mensagem…'} disabled={sending || selected.can_reply === false} />
                    <button className="send-button" type="submit" disabled={sending || !composer.trim() || selected.can_reply === false}><Send size={18} /></button>
                  </form>
                </>
              ) : (
                <div className="empty-state large-empty"><Inbox size={40} /><h2>A caixa de entrada está pronta.</h2><p>Conecte o primeiro número WhatsApp para iniciar o atendimento diretamente neste dashboard.</p></div>
              )}
            </div>
          </section>

          <aside className="intelligence-panel">
            <article className="panel-card ai-card"><header><Bot size={20} /><b>Assistente IA</b><span>Preparado</span></header><small>Próxima etapa</small><p>As sugestões de resposta serão ativadas depois de validarmos o atendimento humano ponta a ponta.</p><button disabled>Em preparação</button></article>
            <article className="panel-card"><h3>Canal WhatsApp</h3><p>Provider inicial: Evolution API/Baileys. A ligação e o QR Code serão controlados pelo nosso dashboard.</p><div className="tag-line"><span>Motor: Chatwoot headless</span><span>Interface: Atendimento.Center</span></div></article>
            <article className="panel-card"><h3>Estado da operação</h3><button className="action-row" type="button"><CheckCircle2 size={17} /> Autenticação ativa</button><button className="action-row" type="button"><CheckCircle2 size={17} /> Tenant isolado</button><button className="action-row" type="button"><CheckCircle2 size={17} /> API Chatwoot ligada</button></article>
          </aside>
        </div>
      </section>
    </main>
  );
}
