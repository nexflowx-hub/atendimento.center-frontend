import {
  BarChart3,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Clock3,
  ContactRound,
  Inbox,
  Instagram,
  KnowledgePanel,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Tags,
  UserRoundCheck,
  Workflow,
  Zap,
} from 'lucide-react';

const conversations = [
  { initials: 'MS', name: 'Maria Souza', time: '09:41', text: 'Olá! Gostaria de agendar uma consulta de rotina.', tag: 'Agendamento', active: true },
  { initials: 'JP', name: 'João Pereira', time: '09:32', text: 'Quais são os horários disponíveis?', tag: 'Informação' },
  { initials: 'AC', name: 'Ana Clara', time: '09:22', text: 'Preciso de remarcar minha consulta de sexta.', tag: 'Remarcação' },
  { initials: 'LM', name: 'Lucas Martins', time: '09:15', text: 'Meu exame ficou pronto?', tag: 'Resultados' },
  { initials: 'PL', name: 'Patrícia Lima', time: '09:05', text: 'Obrigada pelo atendimento!', tag: 'Agradecimento' },
];

const flows = [
  ['Agendamento de consulta', '128 execuções', '+24%'],
  ['Lembrete de consulta', '96 execuções', '+17%'],
  ['Pós-atendimento', '75 execuções', '+12%'],
  ['Resultados de exames', '58 execuções', '+8%'],
];

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <a className="brand dashboard-brand" href="/"><span>Atendimento.</span><strong>Center</strong><small>by Atlas Global</small></a>
        <nav>
          <a className="active"><Inbox size={19} /> Caixa de entrada</a>
          <a><ContactRound size={19} /> Contactos</a>
          <a><CalendarDays size={19} /> Agendamentos</a>
          <a><Workflow size={19} /> Automação</a>
          <a><Bot size={19} /> IA & Conhecimento</a>
          <a><BarChart3 size={19} /> Relatórios</a>
          <a><Settings size={19} /> Configurações</a>
        </nav>
        <div className="tenant-card"><i /><div><b>Clínica Vida+</b><small>Plano Business</small></div></div>
        <div className="user-card"><div className="avatar avatar-large">MA</div><div><b>Mariana Alves</b><small>Administrador</small></div><ChevronDown size={17} /></div>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <label className="search-box"><Search size={18} /><input placeholder="Pesquisar conversas, contactos ou ações" /></label>
          <div className="channel-tabs"><button className="selected">● WhatsApp</button><button>◎ Site</button><button><Instagram size={16} /> Instagram</button></div>
          <button className="button button-primary compact"><Zap size={17} /> Nova automação</button>
          <button className="tenant-switch"><span className="avatar">CV</span> Clínica Vida+ <ChevronDown size={16} /></button>
        </header>

        <div className="workspace">
          <section className="conversation-panel">
            <header><b>Todas as conversas</b><ChevronDown size={16} /></header>
            {conversations.map((conversation) => (
              <article className={conversation.active ? 'conversation-row active' : 'conversation-row'} key={conversation.name}>
                <div className="avatar">{conversation.initials}</div>
                <div className="conversation-copy"><b>{conversation.name}</b><p>{conversation.text}</p><span>{conversation.tag}</span></div>
                <time>{conversation.time}</time>
              </article>
            ))}
            <button className="text-button">Ver todas as conversas</button>
          </section>

          <section className="chat-column">
            <div className="kpi-row">
              <article><small>Atendimentos hoje</small><b>128</b><span>↑ 18%</span></article>
              <article><small>Tempo médio de resposta</small><b>2m 32s</b><span>↓ 12%</span></article>
              <article><small>Agendamentos confirmados</small><b>24</b><span>↑ 33%</span></article>
              <article><small>Taxa de automação</small><b>42%</b><span>↑ 9%</span></article>
            </div>
            <div className="chat-card">
              <header className="chat-header"><div><MessageSquareText size={20} /><b>Maria Souza</b><span>Agendamento</span></div><div><Tags size={18} /><Star size={18} /></div></header>
              <div className="chat-stream">
                <div className="chat-message incoming"><p>Olá! Gostaria de agendar uma consulta de rotina.</p><time>09:41</time></div>
                <div className="chat-message outgoing"><p>Olá, Maria! Claro, será um prazer ajudar. Em quais dias e horários você tem preferência?</p><time>09:42 ✓✓</time></div>
                <div className="chat-message incoming"><p>Prefiro na próxima quarta-feira, período da manhã.</p><time>09:43</time></div>
                <div className="chat-message outgoing"><p>Temos disponibilidade às 09:00 ou 10:30. Qual prefere?</p><time>09:43 ✓✓</time></div>
                <div className="chat-message incoming"><p>09:00 está ótimo!</p><time>09:44</time></div>
                <div className="chat-message outgoing"><p>Perfeito! Sua consulta está confirmada para quarta-feira, 22/05 às 09:00.</p><time>09:45 ✓✓</time></div>
              </div>
              <div className="composer"><input placeholder="Escrever mensagem..." /><button><Paperclip size={18} /></button><button><Zap size={18} /></button><button className="send-button"><Send size={18} /></button></div>
            </div>
          </section>

          <aside className="intelligence-panel">
            <article className="panel-card ai-card"><header><Bot size={20} /><b>Assistente IA</b><span>Ativo</span></header><small>Sugestão de resposta</small><p>Perfeito! Posso confirmar a sua consulta para quarta-feira, 22/05 às 09:00?</p><button>Aplicar sugestão</button></article>
            <article className="panel-card"><h3>Resumo da conversa</h3><p>Maria deseja agendar uma consulta de rotina na próxima quarta-feira de manhã.</p><div className="tag-line"><span>Intenção: Agendamento</span><span>Prioridade: Média</span></div></article>
            <article className="panel-card"><h3>Próximas ações</h3><button className="action-row"><CheckCircle2 size={17} /> Confirmar consulta</button><button className="action-row"><Bell size={17} /> Enviar lembrete</button><button className="action-row"><UserRoundCheck size={17} /> Transferir para receção</button></article>
            <article className="panel-card confidence"><div><h3>Confiança da IA</h3><b>92%</b></div><span>Alta</span><div className="sparkline"><i /><i /><i /><i /><i /><i /></div></article>
          </aside>
        </div>

        <section className="analytics-row">
          <article className="analytics-card flows-card"><header><b>Fluxos ativos</b><span>Base de conhecimento</span><span>Performance</span></header>{flows.map(([name, executions, growth]) => <div className="flow-row" key={name}><Workflow size={17} /><div><b>{name}</b><small>{executions}</small></div><span>Ativo</span><i>{growth}</i></div>)}</article>
          <article className="analytics-card performance-card"><header><b>Performance</b><span>7 dias</span></header><div className="chart-legend"><span><i className="blue-dot" /> Conversas</span><span><i className="green-dot" /> Agendamentos</span></div><div className="line-chart"><svg viewBox="0 0 360 150" role="img" aria-label="Gráfico demonstrativo"><polyline points="10,120 60,80 110,55 160,42 210,90 260,52 350,28" fill="none" stroke="#1677ff" strokeWidth="4" /><polyline points="10,140 60,112 110,110 160,92 210,120 260,82 350,65" fill="none" stroke="#18b77b" strokeWidth="4" /></svg></div></article>
          <article className="analytics-card faq-card"><header><b>Perguntas mais frequentes</b></header>{[['Como remarcar minha consulta?', '42'], ['Quais os horários disponíveis?', '35'], ['Preciso de encaminhamento?', '28'], ['Como pego os resultados?', '24']].map(([question, count]) => <div key={question}><span>{question}</span><b>{count}</b></div>)}</article>
          <article className="analytics-card activity-card"><header><b>Últimas automações</b></header>{[['Lembrete de consulta', '08:00'], ['Confirmação de agendamento', '07:45'], ['Pesquisa de satisfação', '20:30'], ['Boas-vindas — Novo contacto', '14:10']].map(([name, time]) => <div key={name}><CheckCircle2 size={16} /><span><b>{name}</b><small>{time}</small></span><i>Sucesso</i></div>)}</article>
        </section>
      </section>
    </main>
  );
}
