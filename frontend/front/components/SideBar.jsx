import React, {useState, useEffect } from 'react';
import logo from '../public/geek-energy.png'
import { Link } from "react-router-dom";

function SideBar(props){
  const regex = new RegExp("discussion/*")
  const challengesRegex = new RegExp("challenges/*")


  return (
    <>
      <div className='fixed z-99'>      
        <div class="flex left">
          <div class="w-16 h-screen sm:flex hidden flex-col justify-evenly items-center bg-black">
            <a href=""><img className="-translate-y-12 h-6 w-8" src={logo}></img></a>
            <div class="flex flex-col items-center space-y-12">
              <Link to="/">
                <div class={"hover:bg-gray-800 duration-150 py-2 px-2 rounded " + ((props.path == "/") ? "bg-gray-800" : "") }>
                  <svg width="24" class="text-green-500" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 44V20L24 4L4 20L4 44H16V26H32V44H44Z" fill="#00C900" stroke="#00C900" stroke-width="4" stroke-linejoin="round" />
                    <path d="M24 44V34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </Link>
              <Link to="/discussion/discussions">
                <div class={"hover:bg-gray-800 duration-150 py-2 px-2 rounded " + ((regex.test(props.path)) ? "bg-gray-800" : "") }>
                  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44 8H4V38H19L24 43L29 38H44V8Z" fill="#00C900" stroke="#00C900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M21 15L20 32" stroke="#000000" stroke-width="4" stroke-linecap="round" />
                    <path d="M28 15L27 32" stroke="#000000" stroke-width="4" stroke-linecap="round" />
                    <path d="M33 20L16 20" stroke="#000000" stroke-width="4" stroke-linecap="round" />
                    <path d="M32 27L15 27" stroke="#000000" stroke-width="4" stroke-linecap="round" />
                  </svg>
                </div>
              </Link>
              <Link to="/playground">
                <div class="hover:bg-gray-800 duration-150 py-2 px-2 rounded">
                  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 40H7C5.34315 40 4 38.6569 4 37V11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V25.8824" stroke="#00C900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 11C4 9.34315 5.34315 8 7 8H41C42.6569 8 44 9.34315 44 11V20H4V11Z" fill="#00C900" stroke="#00C900" stroke-width="4" />
                    <path d="M34 33L30 37L34 41" stroke="#00C900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M40 33L44 37L40 41" stroke="#00C900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                    <circle r="2" transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 10 14)" fill="#00C900" />
                    <circle r="2" transform="matrix(-1.31134e-07 -1 -1 1.31134e-07 16 14)" fill="#00C900" />
                  </svg>
                </div>
              </Link>
              <Link to="/account-settings">
                <div class={"hover:bg-gray-800 duration-150 py-2 px-2 rounded " + ((props.path == "/account-settings") ? "bg-gray-800" : "")}>
                  <svg width="24" height="24" viewBox="0 0 48 48" fill="#00C900" xmlns="http://www.w3.org/2000/svg">
                    <path d="M34.0003 41L44 24L34.0003 7H14.0002L4 24L14.0002 41H34.0003Z" fill="#00C900" stroke="#00C900" stroke-width="4" stroke-linejoin="round" />
                    <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                  </svg>
                </div>
              </Link>
            </div>
            <div class="rounded-full hover:ring-2 duration-150 hover:ring-green-600">
              {(props.username) && <Link to={"/user/u/" + props.username}><img class="w-6 h-6 rounded-full" src={"https://avatars.dicebear.com/api/identicon/" + props.username + ".svg"} alt=""></img></Link>}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default SideBar