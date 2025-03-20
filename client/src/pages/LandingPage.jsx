import React from 'react'
import {Link} from "react-router"

const LandingPage = () => {
  return (
    <div className='h-[calc(100vh - 60px)]'>
      This is LANDING PAGE <br/>
      <div className='flex gap-4 text-2xl'>
      <Link to='/login' className='w-fit border-2 border-amber-600'>Login</Link>
      <Link to='/signup' className='w-fit border-2 border-green-600'>signup</Link>
      </div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, voluptas? Voluptatum reiciendis quasi facere ea laborum nisi aliquam possimus dignissimos illo. Nemo vero mollitia eos aperiam, cupiditate asperiores fugit expedita, in sit praesentium sequi maiores voluptates saepe rem, pariatur nisi magni ipsam. Magni molestiae, aut eligendi perferendis asperiores nesciunt culpa laborum aspernatur ipsa quo incidunt ducimus assumenda vitae? Maxime impedit doloremque ad labore iste tempora dolores, harum, necessitatibus et recusandae non omnis minima quos quas amet accusamus a, fuga esse officiis sapiente suscipit inventore ipsa beatae! Quos delectus odio nam molestiae corrupti.
   
    </div>
  )
}

export default LandingPage
