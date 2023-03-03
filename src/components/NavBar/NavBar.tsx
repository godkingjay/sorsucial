import React from 'react'

type NavBarProps = {}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className='sticky top-0 w-full h-14 bg-white shadow-lg'>
      <div className='h-14 w-full grid place-items-center'>
        <div className='h-full w-full'>
          Hello
        </div>
      </div>
    </div>
  )
}

export default NavBar