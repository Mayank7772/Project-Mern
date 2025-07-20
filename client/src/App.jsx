import About from './components/About'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Home from './components/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
   
      
      <BrowserRouter>
        <ToastContainer/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
          <Route element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
   
  )
}

export default App
