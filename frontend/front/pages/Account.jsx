import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import SideBar from '../components/SideBar';
import Cookies from 'js-cookie'
import produce from "immer"
import Header from '../components/Header';

function AccountPage(){

	const navigate = useNavigate();
	const location = useLocation()
	const [currentUser, setCurrentUser] = useState({})
	const [notifications, setNotifications] = useState([])
	const [newUserData, setNewUserData] = useState({"name":"", "email":"", "password":""})
	const [edit, setEdit] = useState({
		"edit-name" : false,
		"edit-email" : false,
		"edit-password": false,
	})


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


	// const inputChange = (event) => {

	// }

	const listenKeyboardEvent = (event) => {
		// console.log("id " + event.target.id, "value " + event.target.value)
		if(event.target.id == "name"){
			const data = produce(newUserData, draft => {
				draft["name"] = event.target.value
			})
			setNewUserData(data)
			console.log(newUserData)
		}
		else if(event.target.id == "email"){
			const data = produce(newUserData, draft => {
				draft["email"] = event.target.value
			})
			setNewUserData(data)
			console.log(newUserData)
		}
		else{
			const data = produce(newUserData, draft => {
				draft["password"] = event.target.value
			})
			setNewUserData(data)
			console.log(newUserData)
		}
	}


	const toggleEdit = (type) => {
		if(type == "name"){
			if(edit["edit-name"]){
				const currentUserData = produce(currentUser, draft => {
					draft["name"] = newUserData.name
				})
				setCurrentUser(currentUserData)
			}
		    const updated = produce(edit, draft => {
		      draft["edit-name"] = !edit["edit-name"]
		    })
			setEdit(updated)
			console.log(edit)
		}
		else if(type == "email"){
			if(edit["edit-email"]){
				const currentUserData = produce(currentUser, draft => {
					draft["email"] = newUserData.email
				})
				setCurrentUser(currentUserData)
			}
			const updated = produce(edit, draft => {
		      draft["edit-email"] = !edit["edit-email"]
		    })
			setEdit(updated)
			console.log(edit)
		}
		else{
			const updated = produce(edit, draft => {
		      draft["edit-password"] = !edit["edit-password"]
		    })
			setEdit(updated)
			console.log(edit)
		}
	}


	const updateUserRequest = async() => {
		const endpoint = "http://127.0.0.1:8000/api/user/update-user"
		const userdata = {
			id: currentUser.user_id,
			name: (newUserData.name.length > 0) ? newUserData.name : currentUser.name,
			email: (newUserData.email.length > 0) ? newUserData.email : currentUser.email,
			password: {
				newPassword : (newUserData.password.length > 0) ? newUserData.password : currentUser.password,	
				changed: (newUserData.password.length > 0) ? "true" : "false",
			}
		}
		await fetch(endpoint, {
			method: "POST",
			headers:{
				"Content-Type": "application/json"
			},
			body: JSON.stringify(userdata)
		})
	}

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
		<div class="flex">
			<SideBar path={location.pathname} username={currentUser.name} />
			
			<div class="flex flex-col sm:w-auto w-full">
				<div class="">
					<Header username={(currentUser) ? currentUser.name : "random"} notifications={notifications} />
				</div>
				<div class="bg-gray-900 flex sm:items-center -z-99 sm:translate-y-16 translate-y-12 mx-auto h-auto">
				{/*<Header />*/}
					<div class="overflow-x-auto relative shadow-md w-auto">
						<p className="text-2xl text-white font-bold mb-7">Account Settings</p>
					    <table class="mx-auto sm:w-[50rem] mt-2 text-sm text-left text-gray-500 dark:text-gray-400">
					        <tbody>
					            <tr class="bg-gray-700 border-b border-gray-600 dark:bg-gray-900 dark:border-gray-700">
					                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					                    <div class="flex flex-col">
					                      <span class="text-gray-400 text-xs">Name</span>
					                      {(edit["edit-name"]) ? <input onChange={listenKeyboardEvent} defaultValue={currentUser.name} id="name" class="bg-gray-700 mt-3 text-white px-2 max-w-xs border-none"></input>:
						                      <span class="text-base text-white">{currentUser.name}</span>
					                      } 
					                    </div>
					                </th>

					                <td class="py-4 px-6">
					                    <button onClick={() => toggleEdit("name")} class="font-medium text-[#00C900] hover:underline rounded dark:text-blue-50 px-3">{(edit["edit-name"]) ? "Editing" : "Edit"}</button>
					                </td>
					            </tr>
					            <tr class="bg-gray-700 border-b border-gray-600 dark:bg-gray-800 dark:border-gray-700">
					                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					                    <div class="flex flex-col">
					                      <span class="text-gray-400 text-xs">Email</span>
					                      {(edit["edit-email"]) ? <input onChange={listenKeyboardEvent} defaultValue={currentUser.email} type="email" id="email" class="bg-gray-700 mt-3 text-white px-2 max-w-xs border-none"></input> : <span class="text-base text-white">{currentUser.email}</span>}
					                    </div>
					                </th>
					                <td class="py-4 px-6">
					                    <button onClick={() => toggleEdit("email")} href="#" class="font-medium text-[#00C900] dark:text-blue-500 hover:underline px-3">{(edit["edit-email"]) ? "Editing" : "Edit"}</button>
					                </td>
					            </tr>
					            <tr class="bg-gray-700 border-b border-gray-600 dark:bg-gray-900 dark:border-gray-700">
					                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					                    <div class="flex flex-col">
					                      <span class="text-gray-400 text-xs">Password</span>
					                      {(edit["edit-password"]) ? <input onChange={listenKeyboardEvent} class="bg-gray-700 text-white mt-3 px-2 max-w-xs border-none" id="password"></input> : <span class="text-base text-white">*******</span>}
					                    </div>
					                </th>
					                <td class="py-4 px-6">
					                    <button onClick={() => toggleEdit("password")} href="#" class="font-medium text-[#00C900] dark:text-blue-500 hover:underline px-3">{(edit["edit-password"]) ? "Editing" : "Edit"}</button>
					                </td>
					            </tr>
					            <tr class="bg-gray-700  dark:bg-gray-800 dark:border-gray-700">
					                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					                    <div class="flex space-x-2 my-3">
					                      <button onClick={() => navigate(-1)} class="text-black px-2 rounded py-1 hover:bg-white hover:scale-105 duration-75 bg-gray-100">Go back</button>
					                      <button onClick={updateUserRequest} class="px-2 rounded text-white bg-[#00AB00] hover:scale-105 duration-75 hover:bg-[#12DA12]">Save Changes</button>
					                    </div>
					                </th>
					                <td class="py-4 px-6">
					                </td>
					            </tr>

					        </tbody>
					    </table>
					</div>

				</div>
			</div>



		</div>
	)

}

export default AccountPage