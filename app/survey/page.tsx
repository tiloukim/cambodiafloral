import { Suspense } from 'react'
import SurveyClient from './SurveyClient'

export const metadata = { title: 'Thanks for telling us', robots: { index: false } }

export default function SurveyPage() {
  return (
    <Suspense>
      <SurveyClient />
    </Suspense>
  )
}
