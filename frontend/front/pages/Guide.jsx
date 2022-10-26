import { useLocation, useParams } from "react-router-dom"
import { useState, useCallback, useEffect } from 'react'
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Cookies from 'js-cookie'


export default function GuidePage(){
	const [currentUser, setCurrentUser] = useState({})
	const [notifications, setNotifications] = useState([])
	const [loaded, setLoaded] = useState(false)
	const [guide, setGuide] = useState({})
	const { id } = useParams()
	const isEmpty = (obj) => Object.keys(obj).length === 0;



	useEffect(() => {
	    async function fetchUser(){
	      const url = "http://127.0.0.1:3232/api/user"
	      const req = await fetch(url, {
	        headers: {
	          "Authorization": "Bearer " + Cookies.get("access_token")
	        }
	      })
	      const response = await req.json()
	      console.log(response)
	      if (response.authenticated && response.authenticated == "false"){
	        window.location.href = window.location.origin + "/signin"
	      }
	      else{
	        setCurrentUser(response)
	      }
	    }
	    fetchUser()
    }, [])

	  useEffect(() => {
	  	const getData = async() => {
		  	const notification_response = await fetch(`http://127.0.0.1:3232/api/notifications?user=${currentUser.user_id}`,  {
		        headers: {
		          "Authorization": "Bearer " + Cookies.get("access_token")
		        }
		      })
	  		const guide_data = await fetch(`http://127.0.0.1:3232/api/guide/${id}`, {
				headers: {
		          "Authorization": "Bearer " + Cookies.get("access_token")
		        }
	  		})
	  		const notification_data = await notification_response.json()
	  		setNotifications( notification_data )
	  		setGuide( await guide_data.json() )
	  	}
	  	(currentUser.user_id) ? getData(): void(0)

	  }, [currentUser])



	return (
		<>
	        <SideBar username={(currentUser && currentUser.user_id) && currentUser.name} />
	        <Header notifications={notifications || []}/>
			<div class="bg-gray-900 sm:translate-x-28 pt-5 flex-col h-screen w-full px-2">
			{!isEmpty(guide) && <><h1 class="text-white sm:text-4xl px-3 text-2xl font-bold mb-7"><span class="font-bold px-3 text-green-500">#</span>{guide.title}</h1><p class="text-white px-7 text-lg leading-relaxed max-w-2xl">{guide.content}</p></>}
			</div>
		</>
	)
}
