import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '~/components/loadingSpinner';
import { api } from '~/utils/api';

interface WaveReport {
  id: string,
  spotId: string,
  timestamp: Date,
  utcOffset: number,
  waveHeightMin: number,
  waveHeightMax: number,
  humanRelation: string
}

const Reports: NextPage = () => {

  const router = useRouter();
  const [sixteenDayReport, setSixteenDayReport] = useState<WaveReport[]>([]);

  const { spotId } = router.query;
  const { data } = api.reports.get16DayReportBySpotId.useQuery({ spotId  });

  /**
   * Increments the specified date by n
   */
  const incrementDate = (date: Date, n: number) => {
    date.setDate(date.getDate() + 1);
    return date;
  }

  useEffect(() => {
    
    const now = new Date();
    let utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));

    const temp: WaveReport[] = [];
    for (let i = 0; i <= 16; i++) {
      data.find(d => {
        console.log(d, utcNow)
        if (d.timestamp === utcNow) {
          temp.push(d);
          utcNow = incrementDate(utcNow, 1);
          return;
        }
      })
    }

    console.log(temp)

    setSixteenDayReport(temp);
  }, [data]);

  return (
    <div>
      { sixteenDayReport.map(report => (

          <div key={report.id}>
            {report.waveHeightMin}-{report.waveHeightMax}
          </div>
        )
      )}
    </div>
  )
}

export default Reports