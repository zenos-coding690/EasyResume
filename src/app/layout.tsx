import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/LanguageContext";
import { TokenProvider } from "@/context/TokenContext";
import { ResumeProvider } from "@/context/ResumeContext";
import { CoverLetterProvider } from "@/context/CoverLetterContext";

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
        <LanguageProvider>
          <TokenProvider>
            <ResumeProvider>
              <CoverLetterProvider>
                {children}
              </CoverLetterProvider>
            </ResumeProvider>
          </TokenProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
