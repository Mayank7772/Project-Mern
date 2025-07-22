import About from './components/About'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';

const App = () => {
  return (
   
      
      <BrowserRouter>
        <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route path='/listing/:id' element={<Listing />} />
          <Route element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/create-listing' element={<CreateListing/>} />
            <Route path='/update-listing/:id' element={<UpdateListing/>} />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App
