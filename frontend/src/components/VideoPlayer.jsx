export function VideoPlayer({ videoUrl }) {
  if (!videoUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black text-gray-400">
        Video unavailable
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      className="h-full w-full object-contain"
      preload="metadata"
      controlsList="nodownload"
    >
      Your browser does not support the video tag.
    </video>
  );
}