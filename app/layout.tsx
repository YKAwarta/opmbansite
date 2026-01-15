import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'The OPM & BAN Club | Alfaisal University',
  description: 'Official website of The OPM & BAN Club at Alfaisal University.',
  keywords: "OPM, BAN, Alfaisal University, project management, business analytics, certifications",
  openGraph: {
    title: 'The OPM & BAN Club | Alfaisal University',
    description: 'Official website of The OPM & BAN Club at Alfaisal University.',
    url: 'https://theopmbanclub.com',
    siteName: 'The OPM & BAN Club',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/club_logo_32.png', sizes: '32x32', type: 'image/png' },
      { url: '/club_logo_16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/club_logo_apple.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem={true}
        disableTransitionOnChange
        >
        {children}
        <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
