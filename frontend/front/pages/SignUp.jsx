import graphics from "../public/ds-graphics.png"
import { Link } from "react-router-dom";
import { useState, useEffect } from "react"
import Lottie from 'react-lottie';
import Animation from "../public/buttonAnimation.json"
import Cookies from 'js-cookie'
import produce from "immer"
import axios from "axios"

function SignUp(){
  
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [password, setPassword] = useState("")
  const [callbackUrl, setCallbackUrl] = useState({
    "google_url" : "",
    "github_url": ""
  })

  const OauthRedirect = (id) => {
    if(id == "google"){
      window.location.href = callbackUrl.google_url
    }
    else if(id == "github"){
      window.location.href = callbackUrl.github_url      
    }
  }


  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };


  useEffect(() => {
    const getCallbackUrl = async() => {
      const endpoint = "http://127.0.0.1:8000/api/auth/"
      const req = await fetch(endpoint)
      const response = await req.json()
      console.log(response)
      let newCallbackURL = produce(callbackUrl, draft => {
        draft["google_url"] = response.google_auth_url
        draft["github_url"] = response.github_auth_url
      })
      setCallbackUrl(newCallbackURL)
      console.log(callbackUrl)
    }
    getCallbackUrl()
  })

  const InputEvent = (event) => {
  	if(event.target.type == "email"){
	  	setEmail(event.target.value)
  	}
  	else{
	  	setPassword(event.target.value)
  	}
  }


  const FormSubmission = async (event) => {
    setSubmitted(!submitted)
    event.preventDefault()
  	const data = {
  		email: email,
  		password: password
  	}
  	console.log(data)
  	const endpoint = "http://127.0.0.1:8000/api/signup"
    try{
    	let response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      let result = await response.json();
      if(result.status == "success"){
        Cookies.set("access_token", result.access_token.access_token, {expires:7})
        window.location.href = window.location.origin
      }
      else{
        void(0)
      }
      console.log("result" ,result);
    }
    catch(e){
      console.log(e)
      console.log("data didnt come: ", e.message)
    }
  }


  return (
    <>

      <section class="relative flex flex-wrap lg:h-screen lg:items-center bg-gray-900 overflow-hidden">
          {/*<img className="h-10 w-10" src={logo}></img>*/}
        <div class="w-full px-4 py-12 lg:w-1/2 sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div class="max-w-lg mx-auto text-center mb-3 sm:-translate-y-">
            <div class="text-2xl text-white font-bold sm:text-3xl">Sign up now to strengthen your coding skills</div>

          </div>

          <form onSubmit={FormSubmission} class="max-w-md mx-auto mt-8 mb-0 space-y-4">
            <div>
              <label class="text-white text-lg font-semibold mb-3" for="email">Email</label>

              <div class="relative">
                <input
		          onChange={InputEvent}
                  type="email"
                  class="w-full p-4 pr-12 text-sm bg-gray-500 text-white border-gray-200 rounded-lg shadow-sm"
                />

                <span class="absolute inset-y-0 inline-flex items-center right-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label class="text-white text-lg font-semibold mb-3" for="password">Password</label>
              <div class="relative">
                <input
	              onChange={InputEvent}
                  type="password"
                  class="w-full p-4 text-white pr-12 text-sm bg-gray-500 border-gray-200 rounded-lg shadow-sm"
                />

                <span class="absolute inset-y-0 inline-flex items-center right-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div class="flex flex-col items-center justify-between space-y-3">

              {(submitted) ? 
                <button disabled={true} class="block mt-3 duration-150 w-full px-5 py-3 text-sm font-medium text-white bg-gray-600 rounded-md">
                  <Lottie options={defaultOptions} height={20} width={50}/>
                </button>:
                <button type="submit" class="block mt-3 duration-150 w-full px-5 py-3 text-sm font-medium text-white bg-[#00AB00] hover:bg-[#00CC00] rounded-md">
                  Sign up
                </button>
              }
              <div class="flex sm:flex-row flex-col sm:w-auto w-full sm:space-y-0 space-y-2 sm:space-x-2">
                <button onClick={() => OauthRedirect("google")} class="bg-black hover:bg-gray-800 duration-150 text-white px-8 rounded-md py-2">
                  <svg width="24px" height="18px" class="inline mb-1 mx-1" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                  <span className='text-sm font-semibold'>Sign in with Google</span>
                </button>
                
                <button onClick={() => OauthRedirect("github")} class="bg-black hover:bg-gray-800 duration-150 text-white px-8 rounded-md py-2">                        
                  <svg class="mr-2 -ml-1 w-4 h-4 inline" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
                  <span className='text-sm font-semibold'>Sign in with Github</span>
                </button>
              </div>
              
            </div>
              <p class="text-sm translate-x-3 text-[#00AB00] font-semibold">
                Already have an account?
                <Link to="/signin" class="underline px-2" href="">Sign in</Link>
              </p>

          </form>
        </div>

        <div class="relative w-full h-64 sm:h-96 lg:w-1/2 lg:h-full">
          <img
            class="absolute inset-0 object-cover w-full h-full"
            src={graphics}
            alt=""
          />
        </div>
      </section>

    </>
  )
}



export default SignUp