import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../api/axios";
import Button from "../components/ui/Button";
import {
    ChannelVideo,
    ChannelTweet,
    ChannelPlaylist,
} from "../components";

export function Channel() {
    const { username } = useParams();

    const [channel, setChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("videos");

    useEffect(() => {
        async function getChannelInfo() {
            try {
                setLoading(true);

                const response = await api.get(`/users/c/${username}`);

                setChannel(response.data.data);
            } catch (error) {
                console.error("Error fetching channel:", error);
            } finally {
                setLoading(false);
            }
        }

        getChannelInfo();
    }, [username]);

    const toggleSubscribe = async()=>{
        try {
            
        } catch (error) {
            console.log('toggle subscribe error',error);
            
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <p>Loading...</p>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex justify-center items-center h-60">
                <p>Channel not found.</p>
            </div>
        );
    }

    const {
        _id,
        avatar,
        coverImage,
        fullname,
        username: channelUsername,
        isSubscribed,
    } = channel;

    return (
        <div className="w-full flex flex-col">

            {/* Cover Image */}
            <div>
                <img
                    src={coverImage}
                    alt={channelUsername}
                    className="w-full h-52 object-cover"
                />
            </div>

            {/* Channel Info */}
            {/* // todo: display other things like subscriber count, total views, total likes etc */}
            <div className="flex items-center gap-4 p-4">

                <img
                    src={avatar}
                    alt={fullname}
                    className="w-24 h-24 rounded-full object-cover"
                />

                <div className="flex flex-col gap-1">

                    <h2 className="text-2xl font-semibold">
                        {fullname}
                    </h2>

                    <p className="text-gray-500">
                        @{channelUsername}
                    </p>

                    <div>
                        <Button>
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-evenly border-b">

                <button
                    onClick={() => setActiveTab("videos")}
                    className={`py-3 px-4 ${
                        activeTab === "videos"
                            ? "border-b-2 border-red-500 font-semibold"
                            : ""
                    }`}
                >
                    Videos
                </button>

                <button
                    onClick={() => setActiveTab("tweets")}
                    className={`py-3 px-4 ${
                        activeTab === "tweets"
                            ? "border-b-2 border-red-500 font-semibold"
                            : ""
                    }`}
                >
                    Tweets
                </button>

                <button
                    onClick={() => setActiveTab("playlists")}
                    className={`py-3 px-4 ${
                        activeTab === "playlists"
                            ? "border-b-2 border-red-500 font-semibold"
                            : ""
                    }`}
                >
                    Playlists
                </button>

            </div>

            {/* Content */}
            <div className="mt-4">

                {activeTab === "videos" && (
                    <ChannelVideo userId={_id} />
                )}

                {activeTab === "tweets" && (
                    <ChannelTweet userId={_id} />
                )}

                {activeTab === "playlists" && (
                    <ChannelPlaylist userId={_id} />
                )}

            </div>

        </div>
    );
}