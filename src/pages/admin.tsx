import axios from 'axios'
import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Toast from '~/components/toast/toast'
import { env } from '~/env.mjs'
import { api } from '~/utils/api'

/**
 * Wave response structure
 */
declare type WaveRes = {
  data: { 
    data: {
      wave: [
        {
          probability: number,
          surf: {
              humanRelation: string,
              max: number,
              min: number,
              optimalScore: number,
              plus: boolean,
              raw: {
                max: number,
                min: number
              }
          },
          swells: [
            {
              direction: number,
              directionMin: number,
              height: number,
              impact: number,
              optimalScore: number,
              period: 4
            }
          ],
          timestamp: number,
          utcOffset: number
        }
      ]
    }
  }
}

const Admin: NextPage = () => {

  const { data: sessionData } = useSession();

  const [selectedSpot, setSelectedSpot] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: spots } = api.spots.getSpotsForSelect.useQuery();
  const insertWaveReport = api.reports.insertWaveReport.useMutation();
  const removePastReportsBySpotId = api.reports.removePastReportsBySpotId.useMutation();

  /**
   * Handles the state for the selected spot
   */
  const handleSpotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpot(e.target.value);
  }
  
  /**
   * Updates the data
   */
  const updateData = () => {

    setIsLoading(true);

    if (!selectedSpot) {
      setToastMessage('Please select a spot to fetch data for.')
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 5000);

      return;
    }
    
    const spotId = selectedSpot;
    const waveApi: string = env.NEXT_PUBLIC_WAVE_API_URI + spotId;
    const windApi: string = env.NEXT_PUBLIC_WAVE_API_URI + spotId;

    void (async () => {
      
      await axios.get(waveApi)
        .then(async (res: WaveRes) => {

          const date = new Date();
          date.setHours(0, 0, 0, 0);

          // Remove past data
          await removePastReportsBySpotId.mutateAsync({
            spotId: spotId
          });

          // Grab the waves array from the response
          const waves = res.data.data.wave;
          
          // Iterate through each report
          for (const wave of waves) {

            // Create the wave report object
            const waveReport = {
              spotId: spotId,
              timestamp: new Date(wave.timestamp * 1000), // Convert Unix to datetime
              utcOffset: wave.utcOffset,
              waveHeightMin: wave.surf.min,
              waveHeightMax: wave.surf.max,
              humanRelation: wave.surf.humanRelation
            }

            // Insert the wave report
            await insertWaveReport.mutateAsync({
              ...waveReport
            });

          }
        })
        .catch((err) => {
          console.error(err);
        });

    })();

    setIsLoading(false);
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 h-[calc(100vh-64px)] p-5'>
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

      <button
        className="btn"
        onClick={updateData}
      >
        Fetch Data
      </button>

      {showToast &&
        <Toast message={toastMessage}/>
      }
    </div>

  )
}

export default Admin;