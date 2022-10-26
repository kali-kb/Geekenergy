import SideBar from "../components/SideBar"
import { useState, useEffect } from "react"
import Header from "../components/Header"
import { Link, useLocation } from "react-router-dom";
import { Tabs } from "flowbite-react"
import Cookies from 'js-cookie'
import { current } from "immer"

function NotificationsPage(){
  
  const [currentUser, setCurrentUser] = useState({})
  const [notifications, setNotifications] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function fetchUser(){
      const url = "http://127.0.0.1:8000/api/user"
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
  	async function fetchNotifications(){
  		const url = `http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`
  		const req = await fetch(url, {
  			headers: {
  				"Authorization": "Bearer " + Cookies.get("access_token")
  			}
  		})
  		const response = await req.json()
  		console.log(response)
      setNotifications(response.notifications)
      setLoaded(true)
  	}
  	(currentUser && currentUser.user_id) ? fetchNotifications(): void(0)
  }, [currentUser])


  return (
    <>
      <div class="flex flex-col">
        <SideBar username={(currentUser && currentUser.user_id) && currentUser.name} />
        <Header username={(currentUser) ? currentUser.name : "random"} path={location.pathname} notifications={notifications}/>
        <div class="-mx-3 w-full max-w-3xl child:text-green-500 sm:translate-x-40">
          <Tabs.Group aria-label="Tabs with icons" style="underline">
              <Tabs.Item title="Read">
                {notifications.map(notification => {
                  if(notification.unread){
                    return (
                      <div key={notification.notification_id} class="sm:-mx-3 space-y-4 flex sm:mx-auto my-3 flex-col">
                        <div class="h-auto bg-gray-700 py-2 rounded-md max-w-2xl flex items-center">
                          <div class="px-1 flex py-1 m-4 rounded-full bg-green-500">
                            <box-icon name='check' color='#ffffff' ></box-icon>
                          </div>
                          <div class="flex mx-2 w-full justify-between px-2 items-center">
                            <div>
                              <p class="text-white opacity text-sm font-bold opacity-70">3hr</p>
                              <p class="text-white font-semibold">{notification.notification_message}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  else{
                    return (
                      <span class="text-white">No read notifications yet</span>
                    )
                  }
                })}

              </Tabs.Item>
              <Tabs.Item active={true} title="Unread">
              {(loaded) ? 
                notifications.map(notification => {
                  return (
                    <div key={notification.notification_id} class="sm:-mx-3 space-y-4 flex sm:mx-auto my-3 flex-col">
                      <div class="h-auto bg-gray-700 py-2 rounded-md max-w-2xl flex items-center">
                        <div class="px-1 flex py-1 m-4 rounded-full bg-green-500">
                          <box-icon name='check' color='#ffffff' ></box-icon>
                        </div>
                        <div class="flex mx-2 w-full justify-between px-2 items-center">
                          <div>
                            <p class="text-white opacity text-sm font-bold opacity-70">3hr</p>
                            <p class="text-white font-semibold">{notification.notification_message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }):
                  <div role="status" class="py-3 px-6 space-y-4 max-w-xl bg-gray-600 rounded divide-y divide-gray-200 shadow dark:divide-gray-700">
                      <div class="flex justify-between items-center">
                        <div class="h-10 bg-gray-400 rounded-full animate-pulse dark:bg-gray-600 w-10 mb-2.5"></div>
                          <div class="-translate-x-32 -translate-y-1">
                              <div class="h-2.5 animate-pulse bg-gray-500 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                              <div class="w-32 animate-pulse h-2 bg-gray-400 rounded-full dark:bg-gray-700"></div>
                          </div>
                          <div class="h-2.5 animate-pulse bg-gray-400 rounded-full dark:bg-gray-700 w-12"></div>
                      </div>
                      <span class="sr-only">Loading...</span>
                  </div>
              }
              </Tabs.Item>
          </Tabs.Group>
        </div>
    </div>
  </>
  )
}

//00AB00

export default NotificationsPage