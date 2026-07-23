'use client';

import { ArrowRight, KeyRound, Mail } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const recoveryFromUrl = window.location.hash.includes('type=recovery');
    if (recoveryFromUrl) {
      setRecoveryMode(true);
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session && !recoveryFromUrl) {
        router.replace('/app');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    const supabase = getSupabaseBrowserClient();

    if (recoveryMode) {
      if (password.length < 8) {
        setError('A nova password deve ter pelo menos 8 caracteres.');
        setBusy(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('Não foi possível atualizar a password. Solicite um novo link.');
        setBusy(false);
        return;
      }

      window.history.replaceState({}, document.title, '/login');
      router.replace('/app');
      router.refresh();
      return;
    }

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
          <h1>{recoveryMode ? 'Defina a sua nova password.' : 'Entre na sua central de atendimento.'}</h1>
          <p>{recoveryMode ? 'Escolha uma password forte para concluir a recuperação da conta.' : 'Conversas, equipa e inteligência operacional numa única experiência — sem exposição do ambiente técnico.'}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {!recoveryMode ? (
            <label>
              <span>E-mail</span>
              <div><Mail size={18} /><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
            </label>
          ) : null}
          <label>
            <span>{recoveryMode ? 'Nova password' : 'Password'}</span>
            <div><KeyRound size={18} /><input type="password" autoComplete={recoveryMode ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={recoveryMode ? 8 : undefined} required /></div>
          </label>
          {error ? <p className="auth-alert error">{error}</p> : null}
          {message ? <p className="auth-alert success">{message}</p> : null}
          <button className="button button-primary auth-submit" type="submit" disabled={busy}>
            {busy ? 'A processar…' : recoveryMode ? 'Guardar nova password' : 'Entrar no painel'} <ArrowRight size={18} />
          </button>
          {!recoveryMode ? <button className="auth-recovery" type="button" onClick={recoverPassword} disabled={busy}>Recuperar password</button> : null}
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
