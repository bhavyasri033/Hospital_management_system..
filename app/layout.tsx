import type { Metadata } from 'next'
import './globals.css'
import { DoctorsProvider } from './components/doctors-context'
import { PatientsProvider } from './components/patients-context'
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from "./context/user-context"
import { ThemeProvider } from "./context/theme-context"

export const metadata: Metadata = {
  title: 'MedCare - Hospital Management System',
  description: 'Modern hospital management system for efficient patient and doctor management',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UserProvider>
            <DoctorsProvider>
              <PatientsProvider>
                {children}
                <Toaster />
              </PatientsProvider>
            </DoctorsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
