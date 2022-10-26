import SideBar from '../components/sidebar.jsx';
import { useState, useCallback, useRef, useEffect ,Fragment} from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { Dialog, Transition } from "@headlessui/react";
import { cx, XIcon } from "@vechaiui/react";
import Cookies from 'js-cookie'
import { javascript } from '@codemirror/lang-javascript';
import Lottie from 'react-lottie';
import Header from "../components/Header"
import { python } from '@codemirror/lang-python';
import {useLocation, Routes, Route, useParams } from 'react-router-dom';
import { cpp, cppLanguage } from '@codemirror/lang-cpp';
import Animation from "../public/buttonAnimation.json"
import { php } from '@codemirror/lang-php';
import { java } from '@codemirror/lang-java';
import axios from "axios"
import produce from "immer"
import 'boxicons'


function SolveProblem(){
  const [language, setLang] = useState("python3")
  const [output, setOutPut] = useState("")
  const [result, setResult] = useState({
    "won_point": 0,
    "pass":false,
    "output": ""
  })
  
  const [functionArgs, setFunctionArgs] = useState("")

  const [code, setCode] = useState("")
  const [isSent, setIsSent] = useState(false)
  const completeButtonRef = useRef(null);
  const [notifications, setNotifications] = useState([])
  const [currentUser, setCurrentUser] = useState({})
  const handleClose = () => setShowDialog(false);
  const [challenge, setChallenge] = useState({})
  const isEmpty = (obj) => (obj) && Object.keys(obj).length === 0;
  const location = useLocation()
  const onChange = useCallback((value, viewUpdate) => {
    setCode(value)
  }, []);



  const [showDialog, setShowDialog] = useState(false);

  let { slug } = useParams();

  const onSelect = (event) => {
    setLang(event.target.value)
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
    async function retrieveChallenge(){
      let endpoint = "http://127.0.0.1:8000/api/challenge/" + slug
      const result = await fetch(endpoint, {
        headers: {
          "Authorization": "Bearer " + Cookies.get("access_token")
        }
      })
      const response = await result.json()
      if(!response.user){
        window.location.href = window.location.origin + "/signin"  
      }
      else{
        setChallenge(response.challenge)
        setCurrentUser(response.user)
        let argumentCount = response.challenge.example_input.split("|").length
        let alphabet = "abcdefghijklmnopqrstuvwxyz"
        setFunctionArgs(`${alphabet.slice(0, argumentCount).split("")}`)
      }
    }
    retrieveChallenge()
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

  async function fetchResults(event){
    event.preventDefault()
    let codeString = null
    if(language == "python3"){
      codeString = `${code}` + `\n\nprint(${challenge.title.split(" ").join("_").toLowerCase()}(${challenge.example_input.split("|").join(",")}))` 
    }
    else{
      codeString = `${code}` + `\n\nconsole.log(${challenge.title.split(" ").join("_").toLowerCase()}(${challenge.example_input.split("|").join(",")}))` 
    }
    // setCode(`\n\n ${challenge.title.split(" ").join("_").toLowerCase()}(${challenge.example_input})`)
    
    setIsSent(true)
    const endpoint = "http://127.0.0.1:8000/api/testcase/"
    console.log(codeString)
    let data = {
      user: currentUser.user_id,
      challenge: challenge.challenge_id,
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      script: codeString,
      language: language,
      versionIndex: "0"
    }
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
      // setOutPut(response.output)
      console.log(response)

      const data = produce(result, draft => {
        draft["output"] = response.code_output
        draft["won_point"] = response.points_added
        draft["pass"] = (response.result == "pass") ? true : false 
      })
      setResult(data)
      console.log("new data:", result)

    }
    else{
      alert("Something went wrong try again")
      // setOutPut("Something went wrong, Try Again")
    }
    setShowDialog(true)
    setIsSent(false)


  }

  return (
    <>
      <div class="sm:hidden flex h-screen -translate-y-10 items-center justify-center">
        <h1 class="text-white text-2xl">Lets hop on a desktop for this..</h1>
      </div>
      <div className='sm:flex hidden overflow-hidden'>      
        <SideBar username={currentUser.name} />
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
                  <div class="p-3 space-y-3">
                    <h1 class="font-bold">Test Result</h1>
                    {(result.pass)?
                      <div class="flex space-x-2">
                        <box-icon name='check-circle' type='solid' color='#07c11a' ></box-icon>
                        <span class="font-semibold">Passed</span>
                      </div>:
                      <div class="flex space-x-2">
                        <box-icon name='x-circle' type='solid' color='#ff1414' ></box-icon>
                        <span class="font-semibold">Failed</span>
                      </div>
                    }
                  </div>
                  <button
                    onClick={handleClose}
                    className={cx(
                      "absolute text-sm cursor-base text-gray-600 dark:text-gray-400 hover:text-primary-500 top-4 right-4"
                    )}
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  {(result.pass) ?
                    <div className="flex items-center mb-3 flex-row px-6 py-2">
                      <span>You have earned <span class="text-green-500 font-semibold">+{result.won_point}XP</span> points</span>
                    </div>:
                    <div className="flex items-center mb-3 flex justify-start flex-col px-6 py-2">
                      <span class="font-semibold sm:-translate-x-[170px]">Output:</span><span class="bg-red-500 px-2 rounded-sm mx-3 text-white">{result.output}</span>
                    </div>
                  }
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        <div class="flex-col">
          <Header username={(currentUser) ? currentUser.name : "random"} path={location.pathname} notifications={notifications}/>
          <div class="flex">
            <div className="text-white sm:sm:translate-x-8 flex basis-auto flex-col items-center h-screen px-7 w-[600px] space-y-5 mx-auto py-6">
              
              <h1 className="text-3xl sm:self-start px-2 sm:translate-x-20 font-semibold">{!isEmpty(challenge) ? challenge.title : ""}</h1>
              {/* although dangerouslySetInnerHTML is dangerous like the name says :) its used intensionaly so to be able to render rich text data  */}
              {!isEmpty(challenge) ? 
              <div class="space-y-5">
                <span className="leading-loose" dangerouslySetInnerHTML={!isEmpty(challenge) ? {__html: challenge.description} : ""}></span>
              
                <div class="space-y-7">
                  <div>
                    <h1 class="mb-3">Example Input</h1>
                    <code class="bg-gray-600 text-white pl-2 pr-52 py-1 rounded-sm">{challenge.example_input.split("|").join(",")}</code>
                  </div>
                  <div>
                    <h1 class="mb-2">Example Output</h1>
                    <code class="bg-gray-600 text-white pl-2 pr-52 py-1 rounded-sm">{challenge.example_output}</code>
                  </div>
                </div>
              </div>:
                <div class="flex -translate-x-12 flex-col space-y-6">
                  <div class="flex space-x-2">
                    <div class="h-2 w-10 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                    <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                    <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  </div>
                  <div class="flex space-x-2">
                    <div class="h-2 w-52 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                    <div class="h-2 w-52 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  </div>
                  <div class="h-2 w-72 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  <div class="h-2 w-10 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                  <div class="h-2 w-48 animate-pulse rounded-full bg-gray-400 dark:bg-gray-700"></div>
                </div> 
              }

            </div>
            <div className='border-l border-green-500 overflow-y-scroll border-green-500 w-1/2'>
              <div className="flex space-x-3 my-2 py-2">
                <select onChange={onSelect} class="py-1 mx-3 rounded font-semibold text-sm bg-gray-900 px-3 text-white border-2 border-[#00AB00]">
                  <option>python3</option>
                  <option>javascript</option>
                </select>
                {(isSent) ? 
                  <button className='bg-gray-600 duration-150 space-x-1 flex py-1 px-2 rounded'>
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
                <div class="text-[15px]">
                {(language == "python3" && !isEmpty(challenge)) ?
                  <CodeMirror
                    value={`def ${!isEmpty(challenge) && challenge.title.split(" ").join("_").toLowerCase()}(${functionArgs}):\n\t#your code`}
                    extensions={[python()]}
                    height="800px"
                    onChange={onChange}
                    theme="dark"
                  />: (language == "javascript" && !isEmpty(challenge)) ?
                  <CodeMirror
                    value={`function ${!isEmpty(challenge) && challenge.title.split(" ").join("_").toLowerCase()}(${functionArgs}){\n\t//your code\n};`}
                    extensions={[javascript({ jsx: true }), ]}
                    height="800px"
                    onChange={onChange}
                    theme="dark"
                  />:
                  <CodeMirror
                    value="#loading..."
                    // extensions={[javascript({ jsx: true })]}
                    extensions={[python()]}

                    height="800px"
                    onChange={onChange}
                    theme="dark"
                  />
                }
                </div>
              </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default SolveProblem;