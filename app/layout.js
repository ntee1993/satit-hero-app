import './global.css'

export const metadata = {
  title: 'SATIT CRAFT PRO',
  description: 'แอปพลิเคชันเตรียมพร้อม ป.1'
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="bg-emerald-500 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  )
}
