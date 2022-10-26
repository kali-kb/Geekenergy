import Animation from "../public/notfoundanimation.json"
import Lottie from 'react-lottie';



export default function NotFoundPage(){

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: Animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

   return (
   		<div className="translate-y-24">
	   		<Lottie options={defaultOptions} height={200} width={300}/>
   		</div>
   )
}