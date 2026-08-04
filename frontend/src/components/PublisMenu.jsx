import { useEffect, useRef, useState } from "react"
import {Button} from "./"
import { Video, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PublishMenu(){
    const [open,setOpen] = useState(false)
    const createRef = useRef(null);
    const navigate = useNavigate()
    useEffect(()=>{
        function handleCloseClick(e){
            if(createRef.current && !createRef.current.contains(e.target)){
                setOpen(false)
            }
        }
    
            document.addEventListener("mousedown",handleCloseClick)

        return(()=>{
            document.removeEventListener("mousedown",handleCloseClick)
        })

    },[])


    const options = [
        {
            icon:<Video />,
            label:"Create Video",
            path:"/video/publish"


        },
        {
            icon:<Book />,
            label:"Create Tweet",
            path:"/tweet/publish"

        }
    ]

    return(
        <div ref={createRef} className="relative mr-5">
            <Button onClick={()=>setOpen((prev)=>!prev)}>
                Create
            </Button>
            {
                open&&(
                    <div className="
            absolute
            right-0
            mt-3
            w-60
            z-50
            overflow-hidden
            rounded-xl
            border
            border-zinc-200
            bg-white
            shadow-xl
            dark:border-zinc-700
            dark:bg-zinc-900
          ">
                        {
                            options.map((option)=>(
                               <button
                key={option.label}
                onClick={()=>{
    navigate(option.path)
    setOpen(false)
}}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                "
              >
                {option.icon}
                <p className="text-white">{option.label}</p>
              </button>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
}