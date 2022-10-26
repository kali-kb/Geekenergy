import SideBar from '../components/sidebar.jsx';
import Header from "../components/Header"
import { useState, useCallback, useEffect } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'boxicons'
import axios from "axios"
import { javascript } from '@codemirror/lang-javascript';
import Cookies from 'js-cookie'
import { python } from '@codemirror/lang-python';
// import { Sidebar, Tabs } from "flowbite-react"
import { cpp, cppLanguage } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { java } from '@codemirror/lang-java';
import Lottie from 'react-lottie';
import Animation from "../public/buttonAnimation.json"
import { Link, useLocation } from "react-router-dom";


function Playground() {
  const [language, setLang] = useState("python3")
  const [currentUser, setCurrentUser] = useState({})
  const [notifications, setNotifications] = useState([])
  const [output, setOutput] = useState("")
  const [code, setCode] = useState("")
  const [isSent, setSent] = useState(false)
  const onChange = useCallback((value, viewUpdate) => {
    setCode(value)
    console.log(code)
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  const onSelect = (event) => {
    setLang(event.target.value)
  }

  useEffect(() => {
    setCode("print('hello world')")
    async function getUser(){
      const user_request = await fetch("http://127.0.0.1:8000/api/user", {
        headers: {
          "Authorization": "Bearer " + Cookies.get("access_token")
        }
      })
      const user_response = await user_request.json()
      if (user_response.authenticated && user_response.authenticated == "false"){
        window.location.href = window.location.origin + "/signin"
      }
      else{
        setCurrentUser(user_response)
      }

      console.log(user_response)
      setCurrentUser(user_response)
    }
    getUser()
  }, [])


  useEffect(() => {
    async function getNotification(){
      const url = `http://127.0.0.1:8000/api/notifications?user=${currentUser.user_id}`
      const req = await fetch(url, {
        headers: {
          "Authorization": "Bearer " + Cookies.get("access_token")
        }
      })
      const response = await req.json()
      console.log(response)
      setNotifications(response.notifications)

    }
    (currentUser.user_id) ? getNotification() : void(0)
  }, [currentUser])

  // useEffect(() => {
  //   const notification_request = await fetch(`http://127.0.0.1:3232/api/notifications?user=${currentUser.user_id}`, {headers:headers})
  //   const notification_response = await request.json()
  //   setNotifications(notification_response.notifications)
  // }, [currentUser])





  useEffect(() => {
    setSent(!isSent)
    console.log("output changed")
  }, [output])

  async function fetchResults(){
    event.preventDefault()
    setSent(!isSent)
    console.log(code)
    const endpoint = "http://127.0.0.1:8000/api/execute"

    let data = {
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      script: code,
      language: language,
      versionIndex: "0"
    }
    console.log(endpoint)
    console.log(data)
    let req = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type" : "application/json"
      }
    })
    console.log(req.status)
    if(req.status == 200){
      let response = await req.json()
      console.log(response)
      setOutput(response.output)

    }
    else{
      setOutput("Something went wrong, Try Again")
    }


  }

  return (
    <>
      <div class="sm:hidden flex h-screen -translate-y-10 items-center justify-center">
        <h1 class="text-white text-2xl">Lets hop on a desktop for this..</h1>
      </div>
      <div className='sm:flex hidden sm:flex-col'>
        <div class="sm:child:w-full child:md:-translate-x-[70px] child:shadow-b child:shadow-md child:md:sticky child:-mx-6 bg-green-500">
          <Header username={(currentUser) ? currentUser.name : "random"} path={location.pathname} notifications={notifications}/>
        </div>
        <div className="flex -z-99 h-auto overflow-y-hidden w-full">
          <div className='border-r overflow-y-scroll border-green-500 w-1/2'>  
            {(language == "python3") ? 
              <CodeMirror
                value="print('Hello World')"
                extensions={[python()]}
                height="800px"
                onChange={onChange}
                theme="dark"
              />: (language == "nodejs") ?
              <CodeMirror
                value="console.log('hello world!');"
                extensions={[javascript({ jsx: true }), ]}
                height="800px"
                onChange={onChange}
                theme="dark"
              />:(language == "cpp") ?
              <CodeMirror
                value="//your c++ code"
                extensions={[cpp()]}
                height="800px"
                onChange={onChange}
                theme="dark"
              />:(language == "java") ?
              <CodeMirror
                value="//your java code"
                extensions={[java()]}
                height="800px"
                onChange={onChange}
                theme="dark"
              />: (language == "php") ?
              <CodeMirror
                value="//your php code"
                extensions={[java()]}
                height="800px"
                onChange={onChange}
                theme="dark"
              />:
              <CodeMirror
                value="print('Hello World')"
                // extensions={[javascript({ jsx: true })]}
                extensions={[python()]}

                height="800px"
                onChange={onChange}
                theme="dark"
              />
            }
          </div>
          <div className='w-2/4 h-auto overflow-hidden bg-gray-800'>
            <div className='flex space-x-2 border-b border-green-500 pb-2 px-3 pt-2'>            
              <select onChange={onSelect} class="py-1 rounded font-semibold text-sm bg-gray-900 px-0.5 text-white border-2 border-[#00AB00]">
                <option>python3</option>
                <option>java</option>
                <option>php</option>
                <option>cpp</option>
                <option>nodejs</option>
              </select>
              {(!isSent) ? 
                <button onClick={fetchResults} className='bg-gray-600 duration-150 space-x-1 flex py-1 px-2 rounded'>
                  <span class="text-white text-sm pt-[2px] font-semibold">
                    <Lottie options={defaultOptions} height={20} width={50}/>
                  </span>
                </button>:
                <button onClick={fetchResults} className='bg-[#00AB00] hover:bg-[#03C803] duration-150 space-x-1 flex py-1 px-2 rounded'>
                  <span class="text-white text-sm pt-[2px] font-semibold">Run Code</span>
                  <box-icon name='play' color='#ffffff' ></box-icon>
                </button>
              }
              
            </div>
            <p className="font-semibold text-white font-mono py-2 px-4">Output:</p>
            <span className="font-mono px-4 text-white">{output}</span>
            {/*output shown here*/}
          </div>
        </div>
        {/*<h1 className='text-white'>Hello</h1>*/}
      </div>
    </>
  );
}

export default Playground


