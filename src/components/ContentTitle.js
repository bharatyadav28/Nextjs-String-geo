import React from 'react'
import ScrollToTop from './ScrollToTop'

function ContentTitle({title,desc}) {
  return (
    <div className='px-3 mb-5'>
      <ScrollToTop/>
       {/* <Link to={-1} className='text-white'> <FaArrowLeftLong/> Go back </Link> */}
       <h2 className='text-white text-center fw-bold'>{title}</h2>
       <p className='text-center text-white'>{desc}</p>

       </div>
  )
}

export default ContentTitle