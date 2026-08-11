import { CategoryTabs } from "../components"
import { AllVideos } from "./AllVideos.jsx"

export function Home() {
    return (
        <div>
            <CategoryTabs />
            <div className="mx-auto max-w-7xl px-4 py-6">
                <AllVideos />
            </div>
        </div>
    )
}
