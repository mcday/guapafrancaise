import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { DicteePage } from '@/pages/DicteePage'
import { ComprehensionPage } from '@/pages/ComprehensionPage'
import { OralExamPage } from '@/pages/OralExamPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dictee', element: <DicteePage /> },
      { path: 'comprehension', element: <ComprehensionPage /> },
      { path: 'oral', element: <OralExamPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
