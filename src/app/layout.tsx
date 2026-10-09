import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Toast } from '@/components/Toast';
import { CommandPalette } from '@/components/CommandPalette';
import { QuickActionModal } from '@/components/QuickActionModal';

export const metadata: Metadata = {
  title: 'CampusOS — Your Campus. Your Day. All in One Place.',
  description:
    'All-in-one college student companion for organizing academic tasks, calculating attendance, discovering campus events, and recovering lost items.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface min-h-screen">
        <AppProvider>
          <Header />
          <main className="w-full pt-28 bg-surface">
            {children}
          </main>
          <Toast />
          <CommandPalette />
          <QuickActionModal />
        </AppProvider>
      </body>
    </html>
  );
}
