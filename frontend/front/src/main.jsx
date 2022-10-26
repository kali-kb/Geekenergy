import React from 'react'
// import ReactDOM from 'react-dom/client'
import * as ReactDOM from 'react-dom'
import Home from '../pages/Home'
import SignUp from '../pages/SignUp'
import SignIn from '../pages/SignIn'
import DiscussionForm from '../pages/DiscussionForm'
import ProblemForm from '../pages/ProblemForm'
import Playground from '../pages/Playground'
import ChallengePage from '../pages/ChallengePage'
import Discussion from '../pages/Discussions'
import DiscussionThread from '../pages/DiscussionDetail'
import GoogleCallback from '../pages/GoogleCallback'
import GithubCallback from '../pages/GithubCallback'
import Notifications from '../pages/Notifications'
import AccountPage from "../pages/Account"
import NotFound from "../pages/NotFound"
import Guide from "../pages/Guide"
import Profile from "../pages/Profile"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css'



ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path="/discussion">
        <Route path="discussions" element={<Discussion />} />
        <Route path='open-discussion' element={<DiscussionForm />}  />
        <Route path=':slug' element={<DiscussionThread />}  />
      </Route>
      <Route path='/challenges'>
        <Route path='add-challenge' element={<ProblemForm />}  />
        <Route path=':slug' element={<ChallengePage />}  />
      </Route>
      <Route path='/playground' element={<Playground />} />
      <Route path="account-settings" element={<AccountPage />} />
      <Route path="/auth/google" element={<GoogleCallback />}></Route>
      <Route path="/auth/github" element={<GithubCallback />}></Route>
      <Route path="/notifications" element={<Notifications />}></Route>
      <Route path="/guides/:id" element={<Guide />}></Route>
      <Route path="/user/u/:name" element={<Profile />}></Route>
      <Route path="*" element={<NotFound/>} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);


// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )


