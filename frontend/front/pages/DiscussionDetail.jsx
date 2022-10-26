import { Modal, Label, TextInput, Checkbox, Button } from "flowbite-react"
import { useState, useCallback, useEffect, useReducer , useRef, Fragment} from 'react'
import { useParams, Link, useLocation } from "react-router-dom"
import { Dialog, Transition } from "@headlessui/react";
import { cx, XIcon } from "@vechaiui/react";
import SideBar from '../components/sidebar.jsx';
import Header from "../components/Header"
import Cookies from 'js-cookie'
import ReactQuill from 'react-quill';
import produce from "immer"
import moment from "moment"
import axios from "axios"
import 'boxicons'

function DiscussionThread(){

  const [showDialog, setShowDialog] = useState(false);
  const completeButtonRef = useRef(null);
  const [replyData, setReplyData] = useState({})
  const keyboardEvent = (e) => {
    const data = produce(replyData, draft => {
        draft["reply_text"] = e.target.value
      })
    setReplyData(data)
    console.log("reply data ", replyData)
  }
  const replyForm = (comment) =>{ 
    setShowDialog(true)
    setReplyData({comment_id:comment.comment_id, reply_text:""})
  }

  const handleClose = () => setShowDialog(false);
  const isEmpty = (obj) => Object.keys(obj).length === 0;
  const [discussion, setDiscussion] = useState({})
  const [notifications, setNotifications] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [hotDiscussions, setHotDiscussion] = useState([])
  let [commentAdded, setCommentAdded] = useState(false)
  const [showReplyFor, setShowReplyFor] = useState({reply_for:0, toggled:false})
  const [value, setValue] = useState('');
  const location = useLocation()
  const { slug } = useParams()

  // search for Rosetta code on google you will find everything there
  useEffect(() => {
    async function retrieveChallengesList(){
      let endpoint = "http://127.0.0.1:8000/api/discussion/" + slug
      const result = await fetch(endpoint, {
        headers: {
          "Authorization": "Bearer " + Cookies.get("access_token")
        }
      })
      const response = await result.json()
      console.log(response)
      if(!response.user){
        window.location.href = window.location.origin + "/signin"  
      }
      else{
        setDiscussion(response.discussion)
        console.log(response)
        setCurrentUser(response.user)
      }
    }
    retrieveChallengesList()
    // for(let i=0; i < discussion.comments.length; i++){
    //   set([...replies, discussion.comments[i].push({reply_shown: "false"})])
    // }
    console.log(discussion)
    // showReplies(discussion.comments)

  }, [])

  //post reply

  const postReply = async() => {
    setShowDialog(false)
    const reply_data = {
      reply_text: replyData.reply_text,
      comment_id: replyData.comment_id,
      user_id: currentUser.user_id,
      discussion_id: discussion.discussion_id
    }
    const headers={"Authorization": "Bearer " + Cookies.get("access_token")}
    const req = await fetch("http://127.0.0.1:8000/api/createReply", {method:"POST", headers:headers, body:JSON.stringify(reply_data)})
    const response = await req.json()
    if (req.status == 200){
      setDiscussion(response)
    }
  }

 
  useEffect(() => {
    async function moreDiscussion(){
      let headers={"Authorization": "Bearer " + Cookies.get("access_token")}
      const notification_request = await fetch(`http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`, {headers:headers})
      const notification_response = await notification_request.json()
      setNotifications(notification_response.notifications)
      const getHotDiscussion = await fetch(`http://127.0.0.1:8000/api/hot-discussion`, {headers:headers})
      const HotDiscussion = await getHotDiscussion.json()
      console.log("discussion:", HotDiscussion)
      setHotDiscussion(HotDiscussion)
      console.log("changed:", hotDiscussions)
    }
    (isEmpty(currentUser)) ? void(0) : moreDiscussion()
  }, [discussion])



  const createComment = async() => {
    setCommentAdded(true)
    const comment_data = {
      text: value,
      slug: slug,
      discussion_op: discussion.user_id,
      user_id: currentUser.user_id,
      discussion_id: discussion.discussion_id
    }
    const endpoint = "http://127.0.0.1:8000/api/discussion/add-comment"
    let request = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(comment_data)

    })
    let response = await request.json()
    if (request.status == 200){
      console.log("response:", response)
      setDiscussion(response)
    }
    // const updated = produce(discussion, draft => {
    //   draft.comments.push(comment_data)
    // })
    setCommentAdded(false)
    console.log(discussion)
  }

  const toggleReplies = (id) => {
    console.log(id)
    if(showReplyFor.toggled){
      const newReplyState = produce(showReplyFor, draft => {
        draft["reply_for"] = 0
        draft["toggled"] = false
      })
      setShowReplyFor(newReplyState)
    }
    else{
      const newReplyState = produce(showReplyFor, draft => {
        draft["reply_for"] = id
        draft["toggled"] = true
      })
      setShowReplyFor(newReplyState)
    }

  }

  return (
    <>
      <div class="flex sm:flex-row flex-col">
        {/*sidebar*/}

        <SideBar path={location.pathname} username={(currentUser) && currentUser.name} />
        <div path={location.pathname} class="flex flex-col">
          <Header username={(currentUser) ? currentUser.name : "random"} path={location.pathname} notifications={notifications}/>
          <div class="flex">

          <Transition show={showDialog} as={Fragment}>
            <Dialog
              initialFocus={completeButtonRef}
              as="div"
              className="fixed inset-0 overflow-y-auto z-modal"
              open={showDialog}
              onClose={handleClose}
            >
              <Dialog.Overlay className="fixed bg-opacity-40 bg-black top-0 left-0 w-screen h-screen" />
              <Transition.Child
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="transform scale-95"
                enterTo="transform scale-100"
                leave="transition ease-in duration-100"
                leaveFrom="transform scale-100"
                leaveTo="transform scale-95"
              >
                <div
                  className={cx(
                    "relative flex flex-col w-full mx-auto my-24 rounded shadow-lg",
                    "bg-gray-700 text-white border-gray-200",
                    "dark:bg-neutral-800",
                    "max-w-md"
                  )}
                >
                  <header
                    className="relative px-6 py-5 text-lg font-semibold"
                  >
                    Add your reply
                  </header>
                  <button
                    onClick={handleClose}
                    className={cx(
                      "absolute text-sm cursor-base text-gray-600 dark:text-gray-400 hover:text-primary-500 top-4 right-4"
                    )}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  {/*<span class="mx-6">Replying to <img></img><span class="text-blue-500">@user</span></span>*/}
                  <div className="flex items-center mb-3 flex-row px-6 py-2">
                    <input onChange={keyboardEvent} class="w-3/4 h-7 px-3 rounded bg-gray-500" type="text"></input>
                    <Button class="bg-green-500 font-bold text-sm rounded mx-2 h-7" onClick={() => postReply()} variant="light" color="primary">
                      <span class="-translate-y-1">Complete</span>
                    </Button>
                  </div>

                </div>
              </Transition.Child>
            </Dialog>
          </Transition>

          <div className="flex sm:flex-row sm:mx-0 mx-4 sm:space-x-20 flex-col">
            <div className='flex w-full space-y-6 sm:translate-x-20 flex-col items-start sm:px-32'>       
              <div class="flex flex-col space-y-3 sm:-translate-x-4 text-white">
                <div className='flex space-x-8 p-4 text-white'>
                  {(discussion.user) && <img class="h-16 w-16" src={"https://avatars.dicebear.com/api/identicon/" + discussion.user.name + ".svg"} alt=""></img>}
                  <div class="space-y-3">
                    <p class="text-xl">{discussion.title}</p>
                    <div class="flex space-x-4">
                      <span class="font-semibold text-[#4285F4]">{(discussion.user) ? "@"+discussion.user.name : ""}</span>
                      <span class="">{moment(discussion.created_date).fromNow(true)}</span>
                    </div>
                  </div>
                </div>
                {(discussion.description != "") &&
                  <div class="sm:translate-x-3 text-md max-w-xl" name="discussion-block">
                    <h1 dangerouslySetInnerHTML={{__html: discussion.description}}></h1>
                  </div>
                }
              </div>

              <div className='max-w-md text-white space-y-3'>
                <label class="tracking-wide font-semibold">Leave your Comment</label>
                {(commentAdded) ? <button onClick={createComment} disabled={true} class="px-2 py-1 text-bold block text-sm bg-gray-600 my-2 rounded">Adding Comment...</button>: <button onClick={createComment} class="px-2 py-1 text-bold block text-sm bg-[#00AB00] my-2 rounded">Add Comment</button>}
                <ReactQuill theme="snow" value={value} onChange={setValue} />
              </div>

              <h1 class="text-white font-semibold p-4">{(discussion.comments) ? ((discussion.comments.length < 2) ? "Comment " + discussion.comments.length : "Comments " + discussion.comments.length): void(0)}</h1>
              <div class="flex flex-col items-end justify-end">

                {(discussion.comments) && discussion.comments.map((comment) => {
                  return (
                    <>
                    <div class="bg-gray-700 text-white sm:mx-auto mx-2 my-2 p-6 space-y-3 sm:w-[700px] rounded">
                      <div class="flex space-x-4">
                        <div>
                          <img class="h-12 w-auto rounded" src={"https://avatars.dicebear.com/api/identicon/" + comment.user.name + ".svg"} alt=""></img>
                        </div>
                        <div class="space-y-1">
                          <span class="font-semibold text-[#4285F4]">@{comment.user.name}</span>
                          <div class="flex space-x-10">
                            <span>{moment(comment.created_at).fromNow()}</span>
                            <div class="flex ">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" class="inline" height="24" style={{fill: "#00AB00;"}}><path d="M10 11h6v7h2v-8a1 1 0 0 0-1-1h-7V6l-5 4 5 4v-3z"></path></svg>
                              <span>{comment.reply.length}</span>
                            </div>
                            {(showReplyFor.toggled && (comment.comment_id == showReplyFor.reply_for)) ? <button onClick={() => toggleReplies(comment.comment_id)} id={comment.comment_id} class="font-semibold px-2 rounded-full hover:bg-gray-500 text-sm">Hide Replies</button> : <button onClick={() => toggleReplies(comment.comment_id)} class="font-semibold px-2 rounded-full hover:bg-gray-500 text-sm">Show Replies</button>}
                            <button onClick={() => replyForm(comment)} class="px-2 py-1 rounded-full ring-1 hover:ring-2 duration-150 ring-green-500 text-xs font-bold">Add reply</button>
                          </div>
                        </div>
                      </div>
                      <div dangerouslySetInnerHTML={{__html: comment.comment_text}}></div>
                      <div className='flex flex-col'>
                      </div>
                    </div>
                        {(comment.comment_id == showReplyFor.reply_for) ?
                          comment.reply.map(reply => {
                            return (
                              <div class="bg-gray-700 float-right text-white mx-2 my-5 p-4 space-y-3 w-3/4 max-w-2xl rounded">
                                <div class="flex space-x-4">
                                  <div>
                                    <img class="h-12 w-auto rounded" src="https://avatars.dicebear.com/api/identicon/mark2.svg" alt=""></img>
                                  </div>
                                  <div class="space-y-1">
                                    <span class="font-semibold text-[#4285F4]">@{reply.user.name}</span>
                                    <div class="flex space-x-10">
                                      <span>{reply.created_at}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>{reply.reply_text}</div>
                              </div>
                            )
                          }): void(0)
                        }
                    </>
                  )

                })}

                <div className='flex flex-col'>

                </div>

              </div>
            </div>
   



          <div className="sm:m-5 w-1/2 sm:-translate-x-20 m-2">
            {/*other discussion*/}
            <h1 class="text-xl font-semibold text-white py-4">Similar discussion</h1>
            {(hotDiscussions.length > 0) ? hotDiscussions.map(discussion => {
              return (
                <div class="bg-gray-800 mb-2 space-y-2 sm:max-w-lg max-w-xs p-4 rounded">
                  <div>
                    <Link to={ "/discussion/" + discussion.slug }><span class="text-white">{discussion.title}</span></Link>
                  </div>
                  <div class="space-x-4">
                    <span class="text-white text-sm">{moment(discussion.created_date).fromNow(true).slice(0,3)}</span>
                    <span class="text-white">•</span>
                    <span class="text-blue-500 font-semibold">@{discussion.user.name}</span>
                  </div>
                  <div className="space-x-2">
                  {JSON.parse(discussion.tags).map(tag => {
                    return (
                      <span class="bg-gray-500 px-1 font-bold rounded">#{tag}</span>
                    )
                  })}
                  </div>
                </div>
                )
            }):<div className="flex flex-col space-y-2">
            <div role="status" class="max-w-xs space-y-4 sm:pt-0 pt-2 rounded bg-gray-800 h-36 shadow md:p-6">
              <div class="flex items-center justify-around ">
                <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                <div class="-translate-y-1">
                  <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="h-2 w-32 sm:translate-x-0 translate-x-5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <div class="h-2 w-48 sm:translate-x-0 translate-x-5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <span class="sr-only">Loading...</span>
            </div>
            <div role="status" class="max-w-xs space-y-4 sm:pt-0 pt-2 rounded bg-gray-800 h-36  shadow md:p-6">
              <div class="flex items-center justify-around ">
                <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                <div class=" -translate-y-1">
                  <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
              </div>
              <div class="h-2 w-32 sm:translate-x-0 translate-x-5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <div class="h-2 w-48 sm:translate-x-0 translate-x-5 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          }
          </div>
         </div>
        </div>
      </div>
      </div>
    </>
  )
}


export default DiscussionThread
