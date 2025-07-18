import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux'
import { singInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth =  getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google' , {
                method : 'POST',
                headers : {
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify({name : result.user.displayName , 
                                     email : result.user.email , 
                                     image : result.user.photoURL
                                    }),
                
            }
            )
            const data = await res.json();
            dispatch(singInSuccess(data));
            navigate('/');
        } catch (error) {
            console.log('could not sign in with google ',error);
        }
    }

  return (
   <button type='button' onClick={handleGoogleClick}
        className="bg-slate-700 text-white p-2 rounded-md w-80 hover:bg-blue-600 transition duration-200 disabled:opacity-80 mt-2">
        Continue with Google
   </button>
  )

}

export default OAuth
