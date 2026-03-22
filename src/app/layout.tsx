import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mutlu Kasap | Mersin\'in Taze Eti Kapınıza Gelsin',
  description:
    'Mersin\'de online kasap siparişi. Dana, kuzu, tavuk ve hazır ürünleri kolayca sipariş edin, kapınıza getirelim.',
  keywords: 'kasap, mersin, online et siparişi, dana eti, kuzu eti, tavuk',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: '#181818',
              color: '#F5F5F0',
              border: '1px solid #2A2A2A',
              borderRadius: '10px',
            },
            success: {
              iconTheme: { primary: '#D4A017', secondary: '#000' },
            },
          }}
        />
      </body>
    </html>
  );
}
