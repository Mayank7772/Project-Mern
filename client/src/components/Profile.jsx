import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='container mx-auto mt-10 max-w-md p-6 bg-white rounded shadow'>
      <h1 className='text-3xl font-bold text-center mb-6'>Profile</h1>
      
      <form className='space-y-4'>
        <div className='flex flex-col items-center mb-6'>
          <img
            src={currentUser.avatar }
            alt='Avatar'
            className='w-24 h-24 rounded-full mb-4'
          />
       </div>
        <div>
          <label className='block text-sm font-medium mb-1' htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring'
            placeholder='Enter your username'
            value={currentUser.username}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1' htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring'
            placeholder='Enter your email'
            value={currentUser.email}
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1' htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            className='w-full border rounded px-3 py-2 focus:outline-none focus:ring'
            placeholder='Enter your password'

          />
        </div>
        <button
          type='submit'
          className='w-full  bg-slate-700 text-white py-2 rounded uppercase hover:bg-blue-700'
        >
          Update Profile
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <div className='flex gap-3'>
          <span className=' bg-red-700  cursor-pointer outline-none rounded p-2' >
            Delete Account
          </span>
          <span className=' bg-yellow-700  cursor-pointer outline-none rounded p-2' >
            Sign Out
          </span>
        </div>
      </div>
    </div>
  )
}