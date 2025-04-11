export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="container mx-auto flex items-center justify-center py-5">
      {children}
    </div>
  )
}
