import { formatDistanceToNow } from "date-fns"

export default function TweetCard({
    tweetId, 
    content, 
    user, 
    uploadedAt
}

){

    const uploaded = formatDistanceToNow(
        new Date(uploadedAt),
        {
            addSuffix:true
        }
    )
    
    function formatDuration(seconds) {
    seconds = Math.floor(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }
    return(
        <div>
            
        </div>
    )
}