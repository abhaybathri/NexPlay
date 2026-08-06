import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Channel, Home, HomeTweet, Login, Signup, UploadTweet, UploadVideo, WatchVideo } from './pages/index.js'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App />,
    children:[
      {
        path:"/",
        element:<Home />
      },
      {
        path:"/signin",
        element:<Login />
      },
      {
        path:"/signup",
        element:<Signup />
      }
      ,
      {
        path:"/video/publish",
        element:<UploadVideo />
      }
      ,
      {
        path:"/tweet/publish",
        element:<UploadTweet />
      }
      ,
      {
        path:"/tweets",
        element:<HomeTweet />

      }
      ,
      {
        path:"/watch/:videoId",
        element:<WatchVideo />
      }
      ,
      {
        path:"/channel/:username",
        element:<Channel />
      }
      

    ]

  }
])

createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
    <RouterProvider router={router} />

    </Provider>
  
)
