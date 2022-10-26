import { useState, useCallback, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
import Cookies from 'js-cookie'
import 'boxicons'
import axios from "axios"
import { Link, useLocation } from "react-router-dom";
import SideBar from "../components/SideBar"
import Header from "../components/Header"
import Pagination from "react-js-pagination";
import Animation from "../public/animation.json"
import Lottie from 'react-lottie';



function Home() {
  const [challengesList, setChallengesList] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const [pages, setPages] = useState(0)
  const isEmpty = (obj) => (obj) && Object.keys(obj).length === 0;
  const [notifications, setNotifications] = useState([])
  const [guides, setGuides] = useState([])
  const [challenges, setChallenges] = useState([])
  const [current_page, setCurrentPage] = useState(0)
  const colors = ["ring-[#7000FF]", "ring-[#05CFF2]", "ring-[#E6F205]"]
  const difficultyColors = {"Easy": "bg-[#00C900]", "Medium": "bg-[#D19004]", "Hard": "bg-[#F70505]"}
  


  //the pagination formula total/(total/items_per_page)*current-1
  const fetchData = async (pageNumber = 1) => {

    console.log(Cookies.get("access_token"))
    const api = await fetch(`http://127.0.0.1:8000/api/get-challenges?page=${pageNumber}`, {
      headers: {
        "Authorization": "Bearer " + Cookies.get("access_token")
      }
    });
    const response = await api.json()
    if (response.authenticated && response.authenticated == "false"){
      window.location.href = window.location.origin + "/signin"      
    }
    else{
      console.log(response)
      console.log("data", response.data) 
      setChallenges(response.challenges);
      setCurrentUser(response.user)
    }
  };


  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  useEffect(() => {

    fetchData()

  }, [])


  useEffect(() => {

    async function fetchNotifications(){
      const urls = [`http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`, "http://127.0.0.1:8000/api/guides"]
      let headers= { "Authorization": "Bearer " + Cookies.get("access_token")}
      const notification_data = await fetch(urls[0], {headers:headers}) 
      const guides_data = await fetch(urls[1], {headers:headers}) 
      const guides_response = await guides_data.json()
      const notification_response = await notification_data.json()
      setGuides(guides_response.guides)
      setNotifications(notification_response.notifications)
    }
    (currentUser.user_id) ? fetchNotifications() : void(0)
  }, [currentUser])



  const filterQuery = async(event) => {
    const selected = event.target.value
    let endpoint = "http://127.0.0.1:8000/api/get-challenges"
    if(selected.toString() !== "All"){
      let url = endpoint + "?" + new URLSearchParams({"difficulty":selected.toLowerCase()}) 
      console.log(endpoint)
      const response = await fetch(url)
      const challenges = await response.json()
      console.log(challenges)
      setChallenges(challenges.current_page)
    }
    else{
      const response = await fetch(endpoint)
      const challenges = await response.json()
      setChallengesList(challenges)
    }
  } 


  return (
    <>
      <div className="flex sm:flex-row flex-col">
       <SideBar path={location.pathname} username={(currentUser) ? currentUser.name : "random"}/> 
        <div class="flex flex-col">
        <Header username={(currentUser) ? currentUser.name : "random"} notifications={notifications} />
        <div class="flex sm:flex-row flex-col">
        <div className="items-center sm:mx-24 mx-auto sm:w-auto py-5 w-full flex flex-col px-5 space-y-3">
          <div className='w-full justify-around items-center h-10 flex space-x-3'>
              <h1 className='text-white font-bold'>Challenges {(challenges.data) ? challenges.total : ""}</h1>
              <div className='space-x-4 flex items-center'>            
                <button type="button" class="text-white h-7 bg-[#00AB00] hover:scale-105 duration-75 focus:ring-4 focus:ring-[#24292F]/50 font-medium rounded space-x-1 text-sm px-2 py-1 text-center inline-flex items-center">
                  <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0605 10L24.0239 38" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 24L38 24" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <Link to="/challenges/add-challenge"><span>Post a challenge</span></Link>
                </button>
                
                <select onChange={filterQuery} class="bg-black ring-2 ring-green-500 text-sm rounded text-white px-2 m-10 py-0.5" name="" id="">
                  <option value="All">All</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

          </div>
          <div name="cards" className="space-y-3 pb-4">
          
          {

            (challenges.data) ? challenges.data.map((challenge) => {
              return (
                <div key={challenge.challenge_id} className="bg-gray-800 hover:ring-1 hover:ring-green-500 translate-x-3 translate-y-3 flex sm:flex-row flex-col items-center sm:max-w-3xl h-[122px] rounded">
                  <div name={challenge.slug} className="sm:p-5 p-0 flex">
                    <div className="flex items-center px-5">
                      <svg width="60" className="bg-gray-700 px-3 rounded" height="60" viewBox="0 0 48 48" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M19 4H37L26 18H41L17 44L22 25H8L19 4Z" fill="#00C900" stroke="#00C900" stroke-width="4" stroke-linejoin="round"/></svg>
                    </div>
                    <div class="">
                      <Link to={"challenges/" + challenge.slug}><p className="text-white truncate font-semibold text-lg">{challenge.title}</p></Link>
                      {/* although dangerouslySetInnerHTML is dangerous like the name says :) its used intensionaly so to be able to render rich text data  */}
                      <p className="text-white h-10 w-96 truncate block text-sm opacity-50" dangerouslySetInnerHTML={{__html: challenge.description}}></p>
                      <div class="flex">
                        <span className={"px-2 rounded py-0.5 text-xs font-bold text-white " + difficultyColors[challenge.difficulty]}>{challenge.difficulty} {(challenge.difficulty == "Hard")? "+100PX" : (challenge.difficulty == "Medium") ? "+50PX": "+25PX"}</span>
                        {!isEmpty(challenge.solved) && <span class="bg-green-500 px-2 mx-2 text-xs text-white rounded py-1"><span className="text-white px-1">•</span>Completed</span>}
                      </div>
                    </div> 
                  </div>
                  <div className="sm:px-8 px-6 sm:mb-0 mb-2 space-x-2 sm:w-auto w-full"> 
                  {JSON.parse(challenge.tags).tags_list.map((tag) => {
                    return (
                      <span key={tag} className={"ring-2 font-bold truncate text-sm flex-wrap pb-0.5 text-white px-2 rounded-sm " + colors[Math.floor(Math.random() * 3)]}>#{tag}</span>
                    )
                  })}
                  </div>
                </div>
              )
          }): <Lottie options={defaultOptions} height={100} width={100}/>

        }
          </div>
          <div>
            <ul class="flex space-x-12">
              <Pagination innerClass='text-white flex space-x-4 child:px-2 child:rounded child:bg-white child:font-bold child:text-black'
                activePage={challenges.current_page}
                itemsCountPerPage={challenges.per_page}
                totalItemsCount={challenges.total}
                pageRangeDisplayed={4}

                onChange={
                  (pageNumber) => fetchData(pageNumber)
                }
              />
            </ul>
          </div>
        </div>
        <div className='mx-auto space-y-3 sm:-translate-x-9'>
          <h1 className='text-white my-5 text-2xl'>Getting Started with GeekEnergy</h1>
          {(guides.length > 0) ? 
            guides.map(guide => {
              return(
                <div class="items-center rounded-md flex items-center justify-around p-4 bg-gray-800 max-w-xl space-x-2 text-center">
                  <div class="bg-gray-700 px-2 pt-1 rounded-md">
                    <box-icon name='question-mark' color='#09f529' ></box-icon>
                  </div>
                  <div class="py-2">
                    <Link to={"/guides/" + guide.id}><span class="text-white hover:underline text-xl">{guide.title}</span></Link>
                  </div>
                </div>
              )}
            ):
            <div class="flex flex-col space-y-2">
              <div role="status" class="max-w-sm space-y-4 rounded bg-gray-700 py-5 px-6 shadow md:p-6">
                <div class="flex items-center justify-between">
                  <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                  <div class="-translate-x-8 -translate-y-1">
                    <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 w-12 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
                <span class="sr-only">Loading...</span>
              </div>
              <div role="status" class="max-w-sm space-y-4 rounded bg-gray-700 py-5 px-6 shadow md:p-6">
                <div class="flex items-center justify-between">
                  <div class="mb-2.5 h-10 w-10 animate-pulse rounded-md bg-gray-400 dark:bg-gray-600"></div>
                  <div class="-translate-x-8 -translate-y-1">
                    <div class="h-2 w-32 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2.5 w-12 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div>
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

export default Home




