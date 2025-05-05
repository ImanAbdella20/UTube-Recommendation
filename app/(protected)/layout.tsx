import Header from '@/components/Header'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  )
}