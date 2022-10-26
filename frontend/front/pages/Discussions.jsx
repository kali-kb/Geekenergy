import SideBar from "../components/SideBar"
import Header from "../components/Header"
import { useState, useCallback, useEffect } from 'react'
import { Link, useLocation } from "react-router-dom";
import Animation from "../public/animation.json"
import Cookies from 'js-cookie'
import Pagination from "react-js-pagination";
import Lottie from 'react-lottie';
import moment from "moment"
//import {  } from "react"

function DiscussionList(){
  let location = useLocation()
  const [discussionList, setDiscussionList] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [notifications, setNotifications] = useState([])
  const [hotDiscussions, setHotDiscussion] = useState([])
  const isEmpty = (obj) => Object.keys(obj).length === 0;


  async function retrieveDiscussionList(pageNumber = 1){
    let endpoint = `http://127.0.0.1:8000/api/discussions?page=${pageNumber}`
    const result = await fetch(endpoint, {
      headers: {
        "Authorization": "Bearer " + Cookies.get("access_token")
      }
    })
    const response = await result.json()
    if (response.authenticated && response.authenticated == "false"){
      window.location.href = window.location.origin + "/signin"      
    }
    else{
      setDiscussionList(response.discussion)
      console.log(discussionList)
      setCurrentUser(response.user)
    }
  }


  useEffect(() => {
    retrieveDiscussionList()
  }, [])



  useEffect(() => {

    async function fetchData(){
      let headers={"Authorization": "Bearer " + Cookies.get("access_token")}
      const request = await fetch(`http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`, {headers:headers})
      const getHotDiscussion = await fetch(`http://127.0.0.1:8000/api/hot-discussion`, {headers:headers})
      const HotDiscussion = await getHotDiscussion.json()
      console.log(HotDiscussion)
      setHotDiscussion(HotDiscussion)
      const response = await request.json()
      console.log(response)
      setNotifications(response.notifications)
    }
    (currentUser.user_id) ? fetchData() : void(0)
  }, [currentUser])




  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <>
      <div className='flex sm:flex-row flex-col space-x-3'>
   
        <SideBar path={location.pathname} username={(currentUser) ? currentUser.name : "random"} />
        <div class="flex flex-col">
        <div class="sm:-tranlsate-x-2 -mx-3">
          <Header username={(currentUser) ? currentUser.name : "random"} path={location.pathname} notifications={(notifications.length > 0) ? notifications : []}/>
        </div>
        <div class="flex sm:flex-row flex-col">
        <div class="bg-gray-900 flex mx-2 items-center sm:translate-x-14 mt-5 flex-col space-y-5 sm:w-1/2">
          <div className='flex h-10 justify-around sm:w-11/12 w-full items-center'>
            <div className='space-x-4 flex items-center'>            
               <button type="button" class="text-white h-7 border-2 border-[#00AB00] hover:bg-[#00AB00] hover:scale-105 duration-75 focus:ring-4 focus:ring-[#24292F]/50 font-medium rounded space-x-1 text-sm px-2 py-1 text-center inline-flex items-center">
                 <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0605 10L24.0239 38" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 24L38 24" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                 <Link to="/discussion/open-discussion"><span>Post a Discussion</span></Link>
               </button>
            </div>

            <h1 className='text-white font-bold'>Discussions {(discussionList.data) ? discussionList.data.length : ""}</h1>
          </div>
          <div className='flex flex-col pb-8 items-center space-y-3'>
          {(discussionList.data) ? discussionList.data.map((discussion) => {
            return (
              <div key={discussion.discussion_id} class="bg-gray-800 translate-x-3 translate-y-3 flex sm:flex-row flex-col items-center w-[200em] max-w-xl h-auto rounded">
                <div class="sm:p-5 p-0 flex">
                  <div class="flex items-center px-5">
                    <img class="w-16 rounded" src={"https://avatars.dicebear.com/api/identicon/" + discussion.user.name + ".svg"} alt=""></img>
                  </div>
                  <div class="space-y-2">
                    <Link to={"/discussion/" + discussion.slug}><p class="text-white hover:underline text-lg">{discussion.title}</p></Link>
                    <div class="space-x-5">
                      <span class="text-[#4285F4] text-sm font-bold">@{discussion.user.name}</span>
                      {/*<span class="text-white font-semibold">{moment(discussion.created_date).fromNow()}</span>*/}
                    </div>
                    <div class="space-x-3 flex">
                      <div class="rounded ring-[#00C900] px-2 text-xs font-bold ring-2 text-white">
                         <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chat-square inline" viewBox="0 0 16 16">
                          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        </svg>
                        <span className='ml-1 -translate-y-3'>{discussion.comments.length}</span>
                      </div>
                      <button class="bg-[#00C900] px-2 rounded py-0.5 text-xs font-bold text-white">
                      <Link to={"/discussion/" + discussion.slug}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-chat-square inline" viewBox="0 0 16 16">
                          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        </svg>
                        <span className='ml-1'>Add Response</span>
                      </Link>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="sm:px-8 px-6 sm:mb-0 mb-2 space-x-1 sm:w-auto w-full">
                {JSON.parse(discussion.tags).map((tag) => {
                  return (
                      <span class=" bg-[#7000FF] text-sm pb-0.5 text-white px-2 rounded-sm">#{tag}</span>
                    )
                })}
                </div>
              </div>
            )
          }): <Lottie options={defaultOptions} height={100} width={100}/>}

          </div>
            <ul class="flex space-x-12">
              <Pagination innerClass='text-white flex space-x-4 child:px-2 child:rounded child:bg-white child:font-bold child:text-black'
                activePage={discussionList.current_page}
                itemsCountPerPage={discussionList.per_page}
                totalItemsCount={discussionList.total}
                pageRangeDisplayed={4}

                onChange={
                  (pageNumber) => retrieveDiscussionList(pageNumber)
                }
              />
            </ul>


        </div>
      {/*similar discussions*/}
        <div className='flex sm:w-1/2 w-auto flex-col my-6 mx-auto space-y-3'>
          <div className='flex items-center justify-center space-x-1'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="text-green-500 inline" viewBox="0 0 16 16">
              <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16Zm0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15Z"/>
            </svg>
            <h1 class="inline text-xl text-white font-bold">Hot Discussions</h1>
          </div>
          {(hotDiscussions.length) ? hotDiscussions.map(discussion => {
            return (
              <div class="bg-gray-800 mx-auto space-y-2 w-96 max-w-xs p-4 rounded">
                <div>
                  <Link to={"/discussion/" + discussion.slug}><span class="text-white">{discussion.title}</span></Link>
                </div>
                <div class="space-x-4">
                  <span class="text-white">{moment(discussion.created_date).fromNow(true)}</span>
                  <span className="text-white">•</span>
                  <span class="text-blue-500 font-semibold">@{discussion.user.name}</span>
                </div>
                <div className='space-x-2'>
                {JSON.parse(discussion.tags).map(tag => {
                  return (
                    <span class="bg-gray-500 px-1 font-bold rounded">#{tag}</span>
                  )
                })}
                </div>
              </div>
            )
          }):
          <div className="flex flex-col space-y-2 sm:translate-x-20 -translate-x-16">
            <div role="status" class="max-w-xs translate-x-16 space-y-4 rounded bg-gray-800 h-36 px-6 shadow md:p-6">
              <div class="flex items-center sm:pt-0 pt-2 justify-around -translate-x-6">
                <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                <div class="-translate-x-8 -translate-y-1">
                  <div class="h-2 w-32 animate-pulse sm:translate-x-0 translate-x-10  rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <span class="sr-only">Loading...</span>
            </div>
            <div role="status" class="max-w-xs space-y-4 translate-x-16 rounded bg-gray-800 h-36 px-6 shadow md:p-6">
              <div class="flex items-center sm:pt-0 pt-2 justify-around -translate-x-6">
                <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                <div class="-translate-x-8 -translate-y-1">
                  <div class="h-2 w-32 animate-pulse sm:translate-x-0 translate-x-10 rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        }

        </div>

        </div>

        </div>
      </div>
    </>
  )


}


export default DiscussionList

