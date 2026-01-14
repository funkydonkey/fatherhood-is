import { Crimson_Pro } from 'next/font/google';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-crimson-pro',
});

export default function RedesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${crimsonPro.variable} font-serif`}>
      {children}
    </div>
  );
}
