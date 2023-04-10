import axios from 'axios'
import { type NextPage } from 'next'
import { useSession } from 'next-auth/react'
import React from 'react'
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
  const insertWaveReport = api.reports.insertWaveReport.useMutation();
  // Remove the old reports api
  
  const updateData = () => {
    
    const spotId = '60492e85f79634ecb8e7b0fa'; // Jenness
    const waveApi: string = env.NEXT_PUBLIC_WAVE_API_URI + spotId;

    void (async () => {
      
      await axios.get(waveApi)
        .then(async (res: WaveRes) => {

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
  }

  return (
    <main className="min-h-screen bg-gray-900">

      <button
        className="btn"
        onClick={updateData}
      >
        Fetch Data
      </button>

    </main>
  )
}

export default Admin;