import type { Metadata } from 'next';
import './globals.css';
import './live.css';

export const metadata: Metadata = {
  title: 'Atendimento.Center | Atendimento inteligente',
  description: 'Centralize WhatsApp, inteligência artificial e equipa humana numa única plataforma.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
