import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ExpenseTrack — Modern Minimal Expense Tracker',
  description: 'Track your private expenses with Indian categories, custom monthly income budget, CSV report export, and zero data leakage.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#121212] text-[#F5F5F5] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
