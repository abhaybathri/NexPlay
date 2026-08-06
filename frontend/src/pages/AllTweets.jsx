import { useEffect, useState } from "react"
import { api } from "../api/axios.js"
import { TweetCard } from "../components/index.js";

export default function AllTweets(){
    const [tweet,setTweet] = useState([])
   useEffect(() => {
    async function getTweets() {
        try {
            const response = await api.get("/tweet/get-tweets");
            
            
            setTweet(response.data.data.docs)
            
        } catch (error) {
            console.log(error);
        }
    }

    getTweets();
}, []);


    return(
        <div className="p-5 flex flex-col gap-6">
            {
                tweet.map((tweet)=>(
                    <TweetCard 
                    key={tweet._id}
                    tweetId={tweet._id}
                    content={tweet.content}
                    user={tweet.owner}
                    uploadedAt = {tweet.createdAt}
                    initialLikes={tweet.likesCount}
                    />
                    //todo also add toggle subscribe button to each card 
                ))
            }
        </div>
    )
}