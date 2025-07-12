import React from 'react'


export default function SignUp() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-3xl text-center font-semibold'>Sign Up</h1>
      <form className='flex flex-col items-center justify-center mt-10'>
        <input type="text" placeholder='Username' className='border-2 border-gray-300 p-2 rounded-md mb-4 w-80' />
        <input type="email" placeholder='Email' className='border-2 border-gray-300 p-2 rounded-md mb-4 w-80' />
        <input type="password" placeholder='Password' className='border-2 border-gray-300 p-2 rounded-md mb-4 w-80' />
        <button className='bg-slate-700 text-white p-2 rounded-md w-80 hover:bg-blue-600 transition duration-200 disabled:opacity-80'>Sign Up</button>
      </form>
      <p className='mt-4'>Already have an account? <a href="/sign-in" className='text-blue-500 hover:underline'>Sign In</a></p>
    </div>
  )
}
