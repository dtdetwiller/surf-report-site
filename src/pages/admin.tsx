import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'

const Admin: NextPage = () => {

  const { data: sessionData } = useSession();

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-[calc(100vh-64px)] p-5'>
      Admin Page
    </div>

  )
}

export default Admin;