import type { Metadata } from 'next'
import './globals.css'

// Métadonnées de l'application
export const metadata: Metadata = {
  title: 'Inventaire RPG',
  description: 'Une application de gestion d\'inventaire pour jeu de rôle',
}

// Composant de mise en page racine
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {/* Contenu principal de l'application */}
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
