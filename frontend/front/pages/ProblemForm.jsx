import { useState, useCallback, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
import ReactQuill from 'react-quill';
import 'boxicons'
import produce from "immer"
import axios from "axios"
import 'react-quill/dist/quill.snow.css';
import Header from '../components/Header';
import SideBar from "../components/SideBar"
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'


function PostProblemForm(){

  const [tags, setTags] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [sampleData, setSampleData] = useState({input:"", output:""})
  const [currentUser, setCurrentUser] = useState({})
  const [value, setValue] = useState('');
  const [difficulty, setDifficulty] = useState("Hard")
  const [title, setTitle] = useState("")
  const navigate = useNavigate();


  const dropDownSelect = (event) => {
    setDifficulty(event.target.value)
  }

  async function fetchUser(){
    let req = await fetch("http://127.0.0.1:8000/api/user", {
      headers: {
        "Authorization": "Bearer " + Cookies.get("access_token")
      }
    })
    const resp = await req.json()
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


  const sampleFormKeyboardEvent = (event, name) => {
    // console.log(event)
    if(name == "example-input"){
      const data = produce(sampleData, draft => {
        draft["input"] = event.target.value
      })
      setSampleData(data)
    }
    else{
      const data = produce(sampleData, draft => {
        draft["output"] = event.target.value
      })
      setSampleData(data)
    }
    console.log(sampleData)
  }

  const listenKeyBoardEvent = (event) => {
    if (event.code == "Enter"){
      event.preventDefault()
      if(tags.length <= 2){
        setTags([...tags, event.target.value])
      }
      else{
        void(0)
      }
    }
    if (event.target.name == "title"){
      setTitle(event.target.value)
    }
  }

  const addTagOnClick = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    setTags([...tags, event.target.value])
  }


  const newChallengeForm = async(event) => {
    setIsPosting(true)
    event.preventDefault()
    const endpoint = "http://127.0.0.1:8000/api/challenge-form"
    let data = {
      tags: tags,
      description: value,
      title: title,
      example_input: sampleData.input,
      example_output: sampleData.output,
      difficulty : difficulty
    }
    await fetch(endpoint, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + Cookies.get("access_token")
        },
      body: JSON.stringify(data)
    })
    setIsPosting(false)
    navigate(-1)
  }


  const removeTag = (tagName) => {
    const newTagList = tags.filter(tag => tag != tagName)
    setTags(newTagList)
  }

  return (
    <>
      <SideBar username={currentUser.name} />
        <div>
        <Header username={(currentUser) ? currentUser.name : "random"} notifications={notifications}/>
        <div class="bg-gray-900 h-screen text-white sm:translate-x-40 space-y-7 p-2 flex flex-col ">
        <h1 class="text-2xl font-semibold sm:text-start text-center">Post a challenge <span className='text-blue-500 text-xs'><a href="#">Follow a Guide on how to post(Recommended)</a></span></h1>
        <form onSubmit={newChallengeForm} class="space-y-5 my-3">

          <div class="flex sm:flex-row-reverse flex-col-reverse items-start justify-between max-w-4xl h-auto">

            <div class="flex flex-col">
              <div class="flex flex-col max-w-xs p-3">
                <label class="text-white p-1 font-semibold text-lg">Sample Input <span class="text-red-500">*</span><span class="text-xs ml-4">Separate arguments with <span class="bg-blue-500 px-1 mr-1 rounded ">"|"</span>pipe symbol</span></label>
                <textarea onChange={() => sampleFormKeyboardEvent(event ,"example-input")} class="bg-gray-700 text-white rounded p-2" placeholder="// arg1 | arg2" name="" id="" cols="40" rows="5" required></textarea>
              </div>

              <div class="flex flex-col max-w-xs p-3">
                <label class="text-white p-1 font-semibold text-lg">Sample Output <span class="text-red-500">*</span></label>
                <textarea onChange={() => sampleFormKeyboardEvent(event, "example-output")} name="example-input" class="bg-gray-700 text-white rounded p-2" name="" id="" cols="40" rows="5" required></textarea>
              </div>
            </div>

            <div class="space-y-5">
              <div class="flex flex-col sm:w-full">
                <label class="tracking-wide font-semibold mb-2">Challenge title <span class="text-red-500">*</span></label>
                <input onChange={listenKeyBoardEvent} name="title" class="border px-2 bg-gray-700 rounded border-none py-2 max-w-2xl" type="text" id="" required></input>
              </div>

              <div className='max-w-md space-y-3'>
                 <label class="tracking-wide font-semibold">Description</label>
                 <ReactQuill theme="snow" value={value} onChange={setValue} />
              </div>

              <div class="flex flex-col sm:w-1/2 w-full">
                <label class="font-semibold" for="">How difficult is it <span class="text-red-500">*</span></label>
                <select onChange={dropDownSelect} class="sm:w-1/2 bg-gray-700 rounded py-1 px-3" name="" id="" required>
                  <option class="bg-gray-500 border-none" value="Hard">Hard</option>
                  <option value="Medium">Medium</option>
                  <option value="Easy">Easy</option>
                </select>
              </div>
              {/*
              <div class="max-w-md ">
                <label class="font-semibold" for="">Problem categories</label>
                <div class="border-2 flex-col rounded p-3 border-dashed  flex space-x-4 text-black">
                  <div class="flex space-x-3">
                    <button onClick={addTagOnClick} name="Arrays" class="bg-gray-300 px-2 rounded-full text-xs font-bold">Arrays</button>
                    <button onClick={addTagOnClick} class="bg-gray-300 px-2 rounded-full text-xs font-bold">Linked List</button>
                    <button class="bg-gray-300 px-2 rounded-full text-xs font-bold">Searching</button>
                  </div>
                  tags input*/}
                  {/* <div class="-translate-x-4">
                  {tags.map(tag => {
                    <button key={tag} class="bg-gray-300 pb-0.5 px-2 rounded-full text-xs font-bold">
                      {tag}
                      <button onClick={removeTag(tag)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline pb-0.5 w-3 h-3">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button> 
                  })}
                  </div>*/}
                  {/*tags input
                </div>
              </div>
              */}
              <p class="text-md font-bold text-white">Tags  <span class="pl-4">Max allowed</span><span class="px-2">3</span></p> 
              <div className="border-2 border-dashed p-2 sm:max-w-md rounded-md border-gray-500 space-y-3">
                <input onKeyPress={listenKeyBoardEvent} class="border-none w-full bg-gray-600 rounded py-1 px-2" type="text"></input>
                <div class="rounded text-black flex flex-wrap text-xs font-semibold space-x-2">
                  {tags.map(tag => {
                    return (
                      <div key={tag} className='bg-gray-200 my-1 space-x-1 flex items-center px-2 rounded-full py-1'>
                        <span>{tag}</span>
                          <button onClick={() => removeTag(tag)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline w-3 h-3">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                      </div>
                    )
                  })}    
                </div>
              </div>
            </div>

          </div>

          <div class="flex sm:flex-row pb-7 sm:items-center flex-col-reverse space-x-0 sm:space-x-4">
            <Link to="/"><button class="sm:w-auto w-full bg-green-500 my-2 rounded bg-gray-200 py-2"><span class=" text-black font-semibold sm:w-auto sm:px-4 py-2 ">Go Back</span></button></Link>
            {(isPosting) ? <button disabled={true} class="bg-gray-600 py-2 font-semibold sm:px-8 rounded">Posting...</button>:<button class="bg-[#00AB00] py-2 font-semibold sm:px-8 rounded">Post</button>}
          </div>
        </form>
      </div>
      </div>
      </>
  )
}


export default PostProblemForm
