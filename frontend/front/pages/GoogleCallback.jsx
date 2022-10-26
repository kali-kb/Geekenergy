import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'

function GoogleAuth(){
  const location = useLocation()
  const navigate = useNavigate()
  console.log(location)


  useEffect(() => {
	  async function getGoogleUser(){
	    let endpoint = `http://127.0.0.1:8000/api/auth/google/callback${location.search}`
	    console.log(endpoint)
	    const req = await fetch(endpoint, {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
	    })
	    const response = await req.json()
	    console.log(response)
	    if(response.message == "success" && response.user){
	    		    	let signUpUrl = `http://127.0.0.1:8000/api/signin`
	    	const req = await fetch(signUpUrl, {
	    		method: "POST",
	    		headers: {
	    			"Content-Type": "application/json"
	    		},
	    		body: JSON.stringify(response.user)
	    	})

	      const res = await req.json()
	    	if (res.errors != 1){
	        Cookies.set("access_token", res.auth.access_token, {expires:7})
	      	window.location.href = window.location.origin
	      }
	      else{
	        void(0)
	      }
	    }
	    else{
	    	navigate(-1)
	    }
	  }
	  getGoogleUser()
	}, [])


	return <div class="text-white">Authenticating please wait...</div>
}


export default GoogleAuth