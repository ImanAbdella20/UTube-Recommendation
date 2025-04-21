import SideBar from '@/components/SideBar'
import VideoGrid from '@/components/VideoGrid'

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="flex w-full absolute left-32 top-19">
      <SideBar />
      <div className="flex-1 p-6 ml-64">
        <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
        <VideoGrid searchParams={searchParams} />
      </div>
    </div>
  )
}