import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";

export function ChannelInfo({ owner }) {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!owner?.username) return;

    async function fetchChannel() {
      try {
        setLoading(true);

        const response = await api.get(`/users/c/${owner.username}`);
        setChannel(response.data.data);
      } catch (error) {
        console.error("Failed to fetch channel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannel();
  }, [owner?.username]);

  async function toggleSubscribe() {
    if (!channel || subscribing) return;

    setSubscribing(true);

    try {
      await api.post(`/subscription/toggle-subscribe/${channel._id}`);

      setChannel((prev) => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? Math.max(prev.subscribersCount - 1, 0)
          : prev.subscribersCount + 1,
      }));
    } catch (error) {
      console.error("Subscription failed:", error);
    } finally {
      setSubscribing(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-700 p-5">
        Loading channel...
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="rounded-xl border border-red-500 p-5">
        Failed to load channel.
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-700 p-5">
      <Link to={`/channel/${channel.username}`}>
      <div className="flex items-center gap-4">
        <img
          src={owner?.avatar}
          alt={owner?.username}
          className="h-16 w-16 rounded-full object-cover"
        />

        <div>
          <h2 className="text-lg font-semibold">
            {owner?.username}
          </h2>

          <p className="text-sm text-zinc-400">
            {channel.subscribersCount}{" "}
            {channel.subscribersCount === 1
              ? "Subscriber"
              : "Subscribers"}
          </p>
        </div>
      </div>
      </Link>

      <button
        onClick={toggleSubscribe}
        disabled={subscribing}
        className={`rounded-full px-5 py-2 font-medium transition ${
          channel.isSubscribed
            ? "bg-zinc-700 text-white hover:bg-zinc-600"
            : "bg-red-600 text-white hover:bg-red-700"
        } ${
          subscribing ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {subscribing
          ? "Please wait..."
          : channel.isSubscribed
          ? "Subscribed"
          : "Subscribe"}
      </button>
    </div>
  );
}