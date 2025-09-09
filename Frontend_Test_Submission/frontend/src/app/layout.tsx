import './globals.css'

export const metadata = {
  title: 'URL Shortener',
  description: 'Simple URL shortener application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">URL Shortener</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}