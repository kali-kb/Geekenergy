import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SideBar from '../components/SideBar';
import Cookies from 'js-cookie'
import produce from "immer"
import Header from '../components/Header';



export default function ProfilePage(){
	const [currentUser, setCurrentUser] = useState({})
	const [notifications, setNotifications] = useState([])
	const isEmpty = (obj) => (obj) && Object.keys(obj).length === 0;
	let location = useLocation()


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


	return (

		<div>
			<SideBar username={!isEmpty(currentUser) && currentUser.name}/>
			<div>
				<Header path={location.pathname} notifications={notifications} />
				<div class="mt-5">
				  <div class="flex flex-col items-center space-y-6">
				    <div class="flex flex-col items-center text-5xl space-y-3">
				      <div class="h-48 w-48 overflow-hidden rounded-full ring ring-green-500 bg-black">
				      	{!isEmpty(currentUser) && <img src={"https://avatars.dicebear.com/api/identicon/" + currentUser.name + ".svg"}></img>}
				      </div>
				      <span class="text-white">{!isEmpty(currentUser) && "@" + currentUser.name }</span>
				    </div>
				    <div class="flex justify-between sm:divide-x-2 sm:divide-gray-700 space-x-8">
				      <div class="text-white flex flex-col items-center">
				        <span class="text-lg font-semibold">{currentUser.problems_solved}</span>
				        <span class="text-2xl font-bold">Solved</span>
				      </div>
				      <div class="text-white flex flex-col sm:pl-5 items-center">
				        <span class="text-lg flex font-semibold">
					       <div class="h-3 translate-y-1">
							   <box-icon class="" name='bolt' type='solid' color='#03ea00' ></box-icon>
				           </div>
				           <span>{currentUser.points} XP</span>
				        </span>
				        <span class="text-2xl font-bold">Points</span>
				      </div>
				      <div class="text-white flex flex-col sm:pl-4 items-center">
				        <span class="text-lg font-semibold">Not Calculated</span>
				        <span class="text-2xl font-bold">Ranked</span>
				      </div>
				    </div>
				  </div>
				</div>	
			</div>
		</div>
	)
}