import { type NextPage } from 'next'
import Link from 'next/link';
import React, { useState } from 'react'
import { api } from '~/utils/api'

const Admin: NextPage = () => {

  const [name, setName] = useState('');
  const [spotId, setSpotId] = useState('');
  const mutation = api.spots.insertNewSpot.useMutation();

  const insertSpot = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { 
    e.preventDefault()

    if (!name || !spotId) {
      return;
    }

    mutation.mutate({ name, spotId });
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSpotIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpotId(e.target.value);
  }

  return (

    <div className='flex flex-col h-[calc(100vh-64px)] p-5'>
      
      <div className='w-4/5'>
        <Link className='btn w-fit' href='/home'>
          Back
        </Link>
      </div>

      <div className='flex flex-col items-center justify-center gap-4 grow'>

        <div className='text-3xl font-bold text-white'>
          Add A Spot
        </div>
        
        <form action="" className='w-full flex flex-col gap-3 justify-center items-center'>

          <div className='w-4/5'>
            <label htmlFor="spot-name" className='text-white text-lg'>Spot Name</label>
            <input onChange={(e) => handleNameChange(e)} type="text" id='spot-name' className='m-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
          </div>

          <div className='w-4/5'>
            <label htmlFor="spot-id" className='text-white text-lg'>Spot ID</label>
            <input onChange={(e) => handleSpotIdChange(e)} type="text" id='spot-name' className='m-0 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
          </div>

          <button className='btn w-4/5' onClick={(e) => insertSpot(e)}>
            Insert
          </button>

        </form>

      </div>
    </div>
  )
}

export default Admin;