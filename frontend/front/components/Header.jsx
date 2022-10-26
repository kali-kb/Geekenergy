import React from 'react';
import { Link } from "react-router-dom";
import "boxicons"
import Cookies from 'js-cookie';
import {Navbar, Dropdown, Avatar} from "flowbite-react"
import logo from '../public/geek-energy.png'


function Header(props){
  const discussionRegex = new RegExp("discussion/*")
  const playgroundRegex = new RegExp("playground")
  const notificationRegex = new RegExp("notifications")
  const challengesRegex = new RegExp("challenges/*")
  const profileRegex = new RegExp("user/u/*")
  const signOutUser = () => {
    Cookies.remove("access_token")
    window.location.href = window.location.origin + "/signin"
  }

  return (
    <>
    <div class="sm:hidden">
      <Navbar
          fluid={true}
          rounded={true}
        >
          <Navbar.Brand href="https://flowbite.com/">
            <img
              src={logo}
              className="mr-3 h-6 my-5 px-2 sm:h-9"
              alt="Flowbite Logo"
            />

          </Navbar.Brand>
          <div className="flex space-x-5 md:order-2">
  
            <Navbar.Toggle />
          </div>
          <Navbar.Collapse>
            <Navbar.Link
              href="/"
              active={true}
            >
              Home
            </Navbar.Link>
            <Navbar.Link href="/discussion/discussions">
              Discussions
            </Navbar.Link>

            <Navbar.Link href={"/users/u/" + props.username}>
              Profile
            </Navbar.Link>
            <Navbar.Link href="/account-settings">
              Account settings
            </Navbar.Link>
          </Navbar.Collapse>
        </Navbar>
    </div>
    <div class="h-16 sm:w-[81em] hidden sm:-translate-x-1 bg-gray-800 sm:mx-[70px] sm:flex items-center sm:justify-between justify-around px-20">
      {discussionRegex.test(props.path) ?
        <h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Discussion</h1>
        : (playgroundRegex.test(props.path)) ? <h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Playground</h1>
        :(notificationRegex.test(props.path)) ? <h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Notification</h1>
        :(challengesRegex.test(props.path)) ? <h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Challenges</h1>
        :(profileRegex.test(props.path)) ? <h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Profile</h1>
        :<h1 class="text-white font-bold text-3xl sm:translate-x-0 translate-x-7">Home</h1>     
      }
      <div class="flex items-center">
        <div class="translate-y-1">
          <button onClick={signOutUser} class="bg-green-500 px-2 bg-opacity-30 text-[#00C900] py-1 hover:bg-red-500 hover:bg-opacity-100 hover:text-white duration-150 font-semibold text-sm rounded-md">Log out</button>
        </div>
        <div class="translate-y-2 hover:scale-105 duration-150 sm:translate-x-0 sm:translate-x-12">
          <Link to="/notifications"><box-icon name='bell' type='solid' color='#f5f4f4'></box-icon></Link>
          {(props.notifications.length > 0) ? <div class="-translate-x-2 rounded-full ring-1 ring-white h-2 w-2 bg-[#00C900] float-right"></div>: void(0)}
        </div>
      </div>
    </div>
    </>
  )
}

export default Header