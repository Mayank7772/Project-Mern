import React from 'react'
import { testimonialsData } from '../assets/assets'
import { motion } from 'framer-motion'

const Testimonials = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} 
      className='text-center p-6 py-20 lg:px-32 w-full overflow-hidden' id='Testimonials'>
        <h1 className='text-2xl sm:text-4xl font-bold mb-2'> Customer <span className='underline underline-offset-4 decoration-1 under font-light'>Testimonials</span> </h1>
        <p className='text-center text-gray-500 mb-12 max-w-80 mx-auto'>Ready to Make a move ? Let's Build Your Future Together</p>
    
       <div  className=' grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4'>
            {testimonialsData.map((testimonial , index)=>(
                <div key={index} className='bg-white p-4 rounded-lg shadow-lg flex flex-col items-center gap-2'>
                    <h2 >{testimonial.name}</h2>
                    <p className='font-light'>{testimonial.text}</p>
                    <img src={testimonial.image} alt={testimonial.name} />
                </div>
            ))}
        </div>
    </motion.div>
  )
}

export default Testimonials
