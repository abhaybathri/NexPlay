import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api/axios.js";

import { VideoPlayer } from "../components/VideoPlayer.jsx";
import { VideoActions } from "../components/VideoActions.jsx";
import { ChannelInfo } from "../components/ChannelInfo.jsx";
import { Description } from "../components/Description.jsx";
import { PostComment } from "../components/PostComment.jsx";
import { VideoComment } from "../components/VideoComments.jsx";

export function WatchVideo() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        setLoading(true);

        const response = await api.get(`/video/g/${videoId}`);

        setVideo(response.data.data);
      } catch (error) {
        console.error("Failed to fetch video:", error);
      } finally {
        setLoading(false);
      }
    }

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <p className="text-lg font-medium">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
      {/* Video Player */}
      <div className="flex h-[70vh] w-full items-center justify-center overflow-hidden rounded-xl bg-black">
        <VideoPlayer videoUrl={video.videoUrl} />
      </div>

      {/* Video Title & Actions */}
      <VideoActions
        title={video.title}
        videoId={video._id}
      />

      {/* Channel Information */}
      <ChannelInfo owner={video.owner} />

      {/* Description */}
      <Description
        createdAt={video.createdAt}
        content={video.description}
      />

      {/* Comments */}
      <div className="space-y-6">
        <PostComment videoId={video._id} />

        <VideoComment videoId={video._id} />
      </div>
    </div>
  );
}