import HomePage from '@/components/home/HomePage';
import ClientProviders from '@/components/providers/ClientProviders';

export default function Home() {
  return (
    <ClientProviders>
      <HomePage />
    </ClientProviders>
  );
}