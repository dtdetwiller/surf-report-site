import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { LoadingSpinner } from '~/components/loadingSpinner';
import Toast from '~/components/toast/toast';
import { api } from '~/utils/api';


const HomePage = () => {

  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSpot, setSelectedSpot] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { data: spots } = api.spots.getSpotsForSelect.useQuery();

  console.log(session, status);

  /**
   * Handles the state for the selected spot
   */
  const handleSpotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpot(e.target.value);
  }

  /**
   * Handle scope button click
   */
  const handleScopeClick = (e: React.MouseEvent<HTMLButtonElement>) => {

    if (!selectedSpot) {

      setToastMessage('Please select a spot to scope')
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);

      return;
    }

    void router.push({
      pathname: 'reports',
      query: { spotId: selectedSpot },
    })
  }

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  if (status === 'unauthenticated') {
    void router.push('/');
    return;
  }

  if (!session?.user.roles.includes('member') || !session?.user.roles.includes('admin')) {
    return (
      <div className='h-[calc(100vh-64px)] p-5'>
        <div className='flex flex-col items-center justify-center gap-4 h-full text-white'>
          <div className='text-4xl font-bold'>Access Denied Brah</div>
          <div className=''>If you're friends with Dan, ask him for access.</div>
        </div>
      </div>
    )
  }

  return (
    <div className='h-[calc(100vh-64px)] p-5'>
      <div className='flex flex-col items-center justify-center gap-4 h-full'>
        <select className="bg-gray-50 border max-w-xs border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedSpot} 
          onChange={handleSpotChange}>
            <option value="">Pick a Spot</option>
          {spots?.map((spot) => (
            <option key={spot.spotId} value={spot.spotId}>
              {spot.name}
            </option>
          ))}
        </select>

        <button className='btn' onClick={handleScopeClick}>
          Scope
        </button>

        {session?.user.roles.includes('admin') &&
          <Link href="/admin">
            <button className="btn">
              Admin Page
            </button>
          </Link>
        }
        {showToast &&
          <Toast message={toastMessage}/>
        }
      </div>
    </div>
  )
};

export default HomePage;