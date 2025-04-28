import SideBar from '@/components/SideBar'
import VideoGrid from '@/components/VideoGrid'

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen relative right-40">
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="lg:w-84 xl:w-72 lg:sticky  lg:h-screen lg:overflow-y-auto">
        <SideBar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-6">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        <VideoGrid searchParams={searchParams} />
      </main>
    </div>
  )
}