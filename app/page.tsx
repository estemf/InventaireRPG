'use client';

// Redirection automatique vers le tableau de bord
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

//Appel de la page dashboard au chargement de la page

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return null;
}
