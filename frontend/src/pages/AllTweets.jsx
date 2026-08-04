import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import { TweetCard } from "../components/index.js";

export default function AllTweets(){
    const [tweets,setTweet] = useState([])
   useEffect(() => {
    async function getTweets() {
        try {
            const response = await api.get("/tweet/get-tweets");
            console.log(response.data.data);
            setTweet(response.data.data)
        } catch (error) {
            console.log(error);
        }
    }

    getTweets();
}, []);
    return(
        <div>
            {
                tweets.map((tweet)=>{
                    <TweetCard 
                    key={tweet.id}
                    tweetId={tweet._id}
                    content={tweet.content}
                    user={tweet.owner}
                    uploadedAt = {tweet.createdAt}
                    />
                })
            }
        </div>
    )
}