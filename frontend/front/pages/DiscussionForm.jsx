import { useState, useCallback, useEffect } from 'react'
import ReactQuill from 'react-quill';
import Cookies from 'js-cookie'
import 'boxicons'
import 'react-quill/dist/quill.snow.css';
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import { Link, useNavigate } from "react-router-dom";



function DiscussionThreadForm(){

  const [tags, setTags] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState("")
  const [keyStrokes, setKeyStrokes] = useState("")
  const [value, setValue] = useState('');
  const navigate = useNavigate();


  async function fetchUser(){
    let req = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        "Authorization": "Bearer " + Cookies.get("access_token")
      }
    })
    const resp = await req.json()
    console.log(resp)
    if (resp.authenticated && resp.authenticated == "false"){
      window.location.href = window.location.origin + "/signin"      
    }
    else{
      setCurrentUser(resp)
    }
  }


  useEffect(() => {
    fetchUser()
  }, [])




  useEffect(() => {
    async function fetchNotification(){
    const headers =  {"Authorization": "Bearer " + Cookies.get("access_token")}
    const notification_response = await fetch(`http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`, {headers:headers})
    const notification_data = await notification_response.json()
    // console.log(notification_data)
    setNotifications( notification_data.notifications )
    }
    (currentUser.user_id) ? fetchNotification() : void(0)
  }, [currentUser])

  const listenKeyBoardEvent = (event) => {
    if ((event.code == "Enter") && (event.target.name == "tagInput")){
      event.preventDefault()
      setTags([...tags, event.target.value])
    }
    // else{
    //   setTitle(event.target.value)
    // }
  }

  //write a separate handler for the text input

  const TypeEvent = (event) => {
    setTitle(event.target.value)
  }

  const PostDiscussion = async(event) => {
    event.preventDefault()
    setSubmitted(!submitted)
    console.log("title:", title)
    const data = {
      user_id: currentUser.user_id,
      title: title,
      tags: tags,
      description: value,
    }
    console.log(data)
    const endpoint = "http://127.0.0.1:8000/api/open-discussion"
    await fetch(endpoint, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify(data)
    })
    navigate("/discussion/discussions")
  }

  return (
    <>
      <SideBar username={currentUser.name} />
        <Header username={(currentUser) ? currentUser.name : "random"} notifications={notifications}/>
        <div class="bg-gray-900 h-screen text-white mx-auto sm:translate-x-36 space-y-7 p-2 flex flex-col ">
        <h1 class="text-2xl font-semibold sm:text-start text-center my-3">Open a Discussion</h1>
        <form onSubmit={PostDiscussion} class="space-y-5">
          <div class="flex flex-col sm:w-1/2">
            <label class="tracking-wide font-semibold mb-2">Discussion title <span class="text-red-500">*</span></label>
            <input onChange={TypeEvent} class="border px-2 bg-gray-700 rounded border-none py-2 max-w-md" type="text" name="title" required></input>
          </div>
          <div className='max-w-md space-y-3'>
            <label class="tracking-wide font-semibold">Description</label>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
          </div>
          <div class="flex flex-col sm:w-1/2 space-y-2">
            <span className='font-semibold'>Add Custom Category 
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </span>
              <span name="tooltip" class="absolute hidden">In case you want custom tag</span>
            </span>
            <div className="border-2 border-dashed p-2 sm:max-w-md rounded-md border-gray-500 space-y-3">
              <input onKeyPress={listenKeyBoardEvent} name="tagInput" class="border-none w-full bg-gray-600 rounded py-1 px-2" type="text"></input>
              <div class="rounded text-black flex flex-wrap text-xs font-semibold space-x-2">
                {tags.map(tag => {
                  return (
                    <button key={tag} className='bg-gray-200 my-1 space-x-1 flex items-center px-2 rounded-full py-1'>
                      <span>{tag}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                  )
                })}    
              </div>
            </div>
          </div>
          <div class="flex sm:flex-row sm:items-center flex-col-reverse space-x-0 sm:space-x-4">
            <button onClick={() => navigate(-1)} class="bg-gray-200 text-black font-semibold px-4 py-2 my-3 rounded">Go Back</button>
            {(submitted) ? <button name="post" disabled={true} class="bg-gray-600 py-2 font-semibold sm:px-8 rounded">Posting...</button> : <button name="post" type="submit" class="bg-[#00AB00] py-2 font-semibold sm:px-8 rounded">Post</button>}
          </div>
        </form>
      </div>
      </>
  )
}


export default DiscussionThreadForm
