import { useEffect, useState } from "react"
import { api } from "../api/axios";
import TweetCard from "./Card/TweetCard";

export function ChannelTweet({userId}){
    const [tweets, setTweets] = useState([])
    useEffect(()=>{
        async function getVideos(){
            try {
                const response = await api.get(`/tweet/get-channel-tweet/${userId}`)
                console.log('tweet response',response.data.data);
                setTweets(response.data.data)
                
            } catch (error) {
                console.log('error during fetching channel tweets',error);
                console.log("Error:", error);
    console.log("Response:", error.response);
    console.log("Data:", error.response?.data);
    console.log("Status:", error.response?.status);
                
            }
        }
        getVideos()
    },[])
    return(
        <div className="flex flex-col  gap-6 items-center ">
            {
                tweets.map((tweet)=>(
                    <TweetCard
                        tweetId={tweet._id}
                        content={tweet.content}
                        user={tweet.owner}
                        uploadedAt={tweet.createdAt}
                        initialLikes={tweet.likesCount}
                    />
                ))
            }
        </div>
    )
}