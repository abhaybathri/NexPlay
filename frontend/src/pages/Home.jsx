import { CategoryTabs } from "../components";
import { AllVideos } from "./AllVideos.jsx";

export function Home(){
    return(
        <div>
            <CategoryTabs />
            <AllVideos   />
        </div>
    )
}