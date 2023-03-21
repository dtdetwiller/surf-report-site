import axios from "axios";
import { env } from "~/env.mjs";

type WaveRes = {
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

const updateReports = async (spotId: string) => {

  const waveApi: string = env.NEXT_PUBLIC_WAVE_API_URI + spotId;

  

  await axios.get(waveApi)
    .then((res: WaveRes) => {

     const waves = res.data.data.wave;

     
      

    })
    .catch((err) => {
      console.error(err);
    });

}

export default updateReports;