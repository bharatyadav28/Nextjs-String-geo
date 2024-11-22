import React from 'react'

function Title({title,desc}) {
  return (
    <>
    <h2 style={{color:'#CAA257'}} className=' fw-bold'>{title}</h2>
    <p className='text-white'>{desc}</p>
    </>
  )
}

export default Title