import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle2,
  HeartPulse,
  House,
  Inbox,
  MessageCircleMore,
  PackageCheck,
  PlayCircle,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  UserRoundCheck,
  Wrench,
  Zap,
} from 'lucide-react';

const features = [
  { icon: Inbox, title: 'Caixa de entrada partilhada', text: 'Centralize todos os canais e distribua conversas para a sua equipa.' },
  { icon: Bot, title: 'IA para respostas automáticas', text: 'Responda instantaneamente com inteligência e aumente a satisfação.' },
  { icon: UserRoundCheck, title: 'Transferência para humano', text: 'Transfira para o agente ideal no momento certo, sem perder o contexto.' },
  { icon: CalendarCheck, title: 'Agendamento & lembretes', text: 'Agende serviços e envie lembretes automáticos para reduzir faltas.' },
  { icon: Zap, title: 'Automação de follow-up', text: 'Acompanhe leads e clientes com fluxos automáticos personalizados.' },
  { icon: BarChart3, title: 'Relatórios & métricas', text: 'Acompanhe indicadores em tempo real e tome decisões melhores.' },
];

const sectors = [
  { icon: Stethoscope, title: 'Clínicas', text: 'Consultas, lembretes e acompanhamento de pacientes.' },
  { icon: HeartPulse, title: 'Farmácias', text: 'Atendimento rápido, produtos e programas de fidelização.' },
  { icon: House, title: 'Imobiliárias', text: 'Captação de leads, visitas e qualificação automática.' },
  { icon: Wrench, title: 'Serviços', text: 'Orçamentos, suporte e acompanhamento com agilidade.' },
  { icon: ShoppingBag, title: 'Comércio', text: 'Atendimento, pós-venda e aumento da recompra.' },
];

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="hero-section">
        <nav className="site-nav container">
          <a className="brand" href="#top" aria-label="Atendimento.Center">
            <span>Atendimento.</span><strong>Center</strong>
            <small>by Atlas Global</small>
          </a>
          <div className="nav-links">
            <a href="#produto">Produto</a>
            <a href="#setores">Setores</a>
            <a href="#funcionalidades">Funcionalidades</a>
            <a href="#planos">Planos</a>
            <a href="#contacto">Contacto</a>
          </div>
          <a className="button button-primary nav-cta" href="/app">Pedir demonstração</a>
        </nav>

        <div id="top" className="hero-grid container">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={16} /> Uma solução Atlas Global</span>
            <h1>Atendimento inteligente começa <em>aqui.</em></h1>
            <p>Centralize WhatsApp, inteligência artificial e equipa humana numa única plataforma.</p>
            <div className="benefit-line">
              <span><CheckCircle2 size={18} /> Atenda mais rápido.</span>
              <span><CheckCircle2 size={18} /> Organize contactos.</span>
              <span><CheckCircle2 size={18} /> Automatize processos.</span>
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href="/app">Solicitar demonstração</a>
              <a className="button button-secondary" href="#produto"><PlayCircle size={19} /> Ver como funciona</a>
            </div>
          </div>

          <div className="product-preview" aria-label="Pré-visualização do Atendimento.Center">
            <div className="preview-sidebar">
              <div className="mini-brand">Atendimento.<b>Center</b></div>
              <span className="active"><Inbox size={15} /> Caixa de entrada</span>
              <span><MessageCircleMore size={15} /> Conversas</span>
              <span><UserRoundCheck size={15} /> Contactos</span>
              <span><Zap size={15} /> Automação</span>
              <span><CalendarCheck size={15} /> Agendamentos</span>
              <span><BarChart3 size={15} /> Relatórios</span>
              <div className="preview-account"><i /> Clínica Vida+<small>Plano Business</small></div>
            </div>
            <div className="preview-list">
              <strong>Caixa de entrada</strong>
              <input aria-label="Pesquisar conversas" placeholder="Pesquisar conversas" readOnly />
              {['Maria Souza', 'João Pereira', 'Ana Clara', 'Lucas Martins'].map((name, index) => (
                <div className={index === 0 ? 'preview-contact selected' : 'preview-contact'} key={name}>
                  <div className="avatar">{name.split(' ').map((part) => part[0]).join('')}</div>
                  <div><b>{name}</b><small>{index === 0 ? 'Olá! Gostaria de agendar...' : 'Preciso de mais informações...'}</small></div>
                  <time>09:{41 - index * 6}</time>
                </div>
              ))}
            </div>
            <div className="preview-chat">
              <header><b>Maria Souza</b><span>WhatsApp</span></header>
              <div className="bubble incoming">Olá! Gostaria de agendar uma consulta para amanhã.</div>
              <div className="bubble outgoing">Claro! Temos horários às 10:00 ou 14:00. Qual prefere?</div>
              <div className="bubble incoming">Prefiro às 10:00.</div>
              <div className="message-box">Escrever mensagem... <ArrowRight size={16} /></div>
            </div>
            <aside className="preview-ai">
              <div className="ai-status"><Bot size={18} /><b>Assistente IA</b><span>Ativo</span></div>
              <small>Sugestão de resposta</small>
              <p>Oferecer confirmação de agendamento e lembrete automático.</p>
              <button>Aplicar sugestão</button>
              <div className="metric"><small>Conversas</small><b>128</b><i>+18%</i></div>
              <div className="metric"><small>Tempo de resposta</small><b>1m 32s</b><i>-24%</i></div>
              <div className="metric"><small>Agendamentos</small><b>24</b><i>+33%</i></div>
            </aside>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="features-section container">
        {features.map(({ icon: Icon, title, text }) => (
          <article className="feature-card" key={title}>
            <div className="icon-box"><Icon size={22} /></div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section id="setores" className="sectors-section container">
        <div className="section-heading"><span>Operações reais</span><h2>Perfeito para empresas que precisam atender melhor.</h2></div>
        <div className="sector-grid">
          {sectors.map(({ icon: Icon, title, text }) => (
            <article className="sector-card" key={title}>
              <Icon size={27} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="produto" className="steps-section container">
        <div className="section-heading"><span>Como funciona</span><h2>Da primeira mensagem à conversão.</h2></div>
        <div className="steps-grid">
          <article><b>1</b><div><h3>Receba contactos</h3><p>Capture contactos de WhatsApp, site, redes sociais e outros canais.</p></div></article>
          <article><b>2</b><div><h3>Automatize com IA</h3><p>A IA entende, responde, classifica e organiza tudo para a sua equipa.</p></div></article>
          <article><b>3</b><div><h3>Converta com a equipa</h3><p>Os agentes assumem quando necessário e fecham relações duradouras.</p></div></article>
        </div>
      </section>

      <section className="proof-section container">
        <div className="quote-mark">“</div>
        <blockquote>Reduzimos o tempo de resposta de horas para segundos e aumentamos os agendamentos em 42% no primeiro mês.</blockquote>
        <div className="proof-company"><HeartPulse size={30} /><div><b>Clínica Vida+</b><small>Exemplo demonstrativo</small></div></div>
        <div className="proof-stat"><b>-70%</b><small>Tempo de resposta</small></div>
        <div className="proof-stat"><b>+42%</b><small>Agendamentos</small></div>
      </section>

      <section id="planos" className="cta-section container">
        <div><Sparkles size={30} /><h2>Transforme o seu atendimento numa central inteligente.</h2></div>
        <a className="button button-light" href="/app">Começar agora <ArrowRight size={18} /></a>
      </section>

      <footer id="contacto" className="site-footer">
        <div className="container footer-grid">
          <div className="brand footer-brand"><span>Atendimento.</span><strong>Center</strong><small>Uma solução Atlas Global</small></div>
          <div><a href="#">Privacidade</a><a href="#">Termos</a><a href="#">Suporte</a></div>
          <small>© 2026 Atlas Global. Todos os direitos reservados.</small>
        </div>
      </footer>
    </main>
  );
}
