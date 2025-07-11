import React from 'react'
import { toast } from 'react-toastify';
import {motion} from 'framer-motion';
const Contact = () => {

 const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "18cb81ad-1a70-4409-ab48-e7cc5a4287df");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("");
      toast.success("Message Submitted successfully!");
      event.target.reset();
    } else {
        console.log("Error", data);
        toast.error("Error: " + data.message);
        setResult("");
    }
  };



  return (
    <motion.div 
    initial={{ opacity: 0, x:-200 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    className='text-center p-6 py-20 lg:px-32 w-full overflow-hidden' id='Contact'>
        <h1 className='text-2xl sm:text-4xl font-bold mb-2'> Contact <span className='underline underline-offset-4 decoration-1 under font-light'>With US</span> </h1>
        <p className='text-center text-gray-500 mb-12 max-w-80 mx-auto'>Ready to Make a move ? Let's Build Your Future Together</p>

        <form onSubmit={onSubmit} className='max-w-2xl mx-auto text-gray-600 pt-8' >
           <div className='flex felx-wrap gap-4'>
            <div className='w-full md:w-1/2 text-left'>
                Your Name
                <input className='w-full border border-gray-300 rounded py-3 px-4 mt-2' type="text" name="Name" placeholder='Your Name' required/>
            </div>
            <div className='w-full md:w-1/2 text-left'>
                Your Email
                <input className='w-full border border-gray-300 rounded py-3 px-4 mt-2' type="email" name="Email" placeholder='Your Email' required/>
            </div>
           </div> 
           <div className='my-6 text-left'>
            Message
            <textarea className='w-full border border-gray-300 rounded py-3 px-4 mt-2' name="Message" placeholder='Your Message' rows="5" required> </textarea>
           </div>
          
           <button className='bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors duration-300' type='submit'>
           {result ? result : "Send Message"}
           </button>
      </form>
    </motion.div>
  )
}

export default Contact
