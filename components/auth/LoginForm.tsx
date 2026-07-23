'use client';

import { ArrowRight, KeyRound, Mail } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/app');
      }
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Não foi possível iniciar sessão. Confirme o e-mail e a password.');
      setBusy(false);
      return;
    }

    router.replace('/app');
    router.refresh();
  }

  async function recoverPassword() {
    if (!email.trim()) {
      setError('Introduza primeiro o e-mail da conta.');
      return;
    }

    setBusy(true);
    setError('');
    const supabase = getSupabaseBrowserClient();
    const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });

    if (recoveryError) {
      setError('Não foi possível enviar a recuperação de password.');
    } else {
      setMessage('Enviámos as instruções de recuperação para o seu e-mail.');
    }
    setBusy(false);
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <a className="brand auth-brand" href="/"><span>Atendimento.</span><strong>Center</strong><small>by Atlas Global</small></a>
        <div className="auth-copy">
          <span className="auth-badge">Plataforma privada</span>
          <h1>Entre na sua central de atendimento.</h1>
          <p>Conversas, equipa e inteligência operacional numa única experiência — sem exposição do ambiente técnico.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>
            <div><Mail size={18} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          </label>
          <label>
            <span>Password</span>
            <div><KeyRound size={18} /><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
          </label>
          {error ? <p className="auth-alert error">{error}</p> : null}
          {message ? <p className="auth-alert success">{message}</p> : null}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>
            {busy ? 'A autenticar…' : 'Entrar no painel'} <ArrowRight size={18} />
          </button>
          <button className="auth-recovery" type="button" onClick={recoverPassword} disabled={busy}>Recuperar password</button>
        </form>
      </section>
      <aside className="auth-visual">
        <div>
          <span>Atendimento humano + automação</span>
          <h2>O WhatsApp da sua empresa, organizado para crescer.</h2>
          <ul>
            <li>Caixa de entrada centralizada</li>
            <li>Histórico e contexto por contacto</li>
            <li>Operação assistida pela Atlas</li>
          </ul>
        </div>
      </aside>
    </main>
  );
}
