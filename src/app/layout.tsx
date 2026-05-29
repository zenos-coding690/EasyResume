import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/LanguageContext";
import { TokenProvider } from "@/context/TokenContext";
import { ResumeProvider } from "@/context/ResumeContext";
import { CoverLetterProvider } from "@/context/CoverLetterContext";
import { AuthProvider } from "@/context/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: "myeasyresume",
  description: "Create impactful resumes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("font-sans", plusJakartaSans.variable)}>
      <body className="antialiased">
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1905969436771517');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1905969436771517&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <AuthProvider>
          <LanguageProvider>
            <TokenProvider>
              <ResumeProvider>
                <CoverLetterProvider>
                  {children}
                </CoverLetterProvider>
              </ResumeProvider>
            </TokenProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
