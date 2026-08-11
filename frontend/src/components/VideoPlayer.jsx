export function VideoPlayer({ videoUrl }) {
    if (!videoUrl) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-black text-zinc-500 text-sm">
                Video unavailable
            </div>
        )
    }

    return (
        <video
            src={videoUrl}
            controls
            className="h-full w-full bg-black"
            preload="metadata"
            style={{ display: 'block' }}
        >
            Your browser does not support video playback.
        </video>
    )
}
