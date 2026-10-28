import type { ReactNode } from 'react';

// Keystatic admin has its own layout — no Header/Footer
export default function KeystaticLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
