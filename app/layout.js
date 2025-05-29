export const metadata = {
  title: 'Web Generator',
  description: 'Generate gambar otomatis dari link berita',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
      <script async src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </html>
  )
}
