
'use client'
import Script from 'next/script'

export default function AnalyticsLight() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const umami = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC || 'https://umami.is/script.js'

  return (
    <>
      {plausible && (
        <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" />
      )}
      {umami && (
        <Script async defer data-website-id={umami} src={umamiSrc} />
      )}
    </>
  )
}
