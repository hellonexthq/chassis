import type { AppProps } from 'next/app'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-size: 16px;
          color: var(--colors-black);
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
