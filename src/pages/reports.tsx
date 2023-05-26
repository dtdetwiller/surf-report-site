import { type NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import type { WaveReports } from '@prisma/client';
import { faWind, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';

const Reports: NextPage = () => {

  const { data: session } = useSession();
  const router = useRouter();
  
  if (!session?.user.roles.includes('member')) {
    void router.push('/');
  }

  const [sixteenDayReport, setSixteenDayReport] = useState<WaveReports[]>([]);

  const { spotId } = router.query as { spotId: string };
  const { data: result } = api.reports.getWaveReportBySpotId.useQuery({ spotId });
  const { data: spot } = api.spots.spotBySpotId.useQuery({ spotId });

  useEffect(() => {

    if (!result) return;

    const now = new Date();
    const currentHour = now.getHours();
    
    const waveReportsByDay: { [date: string]: WaveReports } = result.reduce((acc, report) => {
      // Get the date without the time
      const date: string = new Date(report.timestamp.getFullYear(), report.timestamp.getMonth(), report.timestamp.getDate()).toString();
    
      // If the date doesn't exist in the accumulator, add it
      if (!acc[date]) {
        acc[date] = { ...report };
      }
    
      // If the report timestamp hour matches the specified hour, update the wave height for the day
      if (report.timestamp.getHours() === currentHour) {
        acc[date] = report;
      }
    
      return acc;
    }, {} as { [date: string]: WaveReports});
    
    // Convert object to array
    let waveReportsArray = Object.values(waveReportsByDay);

    if (waveReportsArray[0]?.timestamp.getDate() !== now.getDate()) {
      waveReportsArray = waveReportsArray.slice(1);
    }

    setSixteenDayReport(waveReportsArray);

  }, [result]);

  const formatDateString = (date: Date) => {

    const weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek: string = weekdays[date.getDay()] ?? '';
    const month: string = months[date.getMonth()] ?? '';
    const dayOfMonth: number = date.getDate();
    let suffix = 'th';

    if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) {
      suffix = 'st';
    } else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) {
      suffix = 'nd';
    } else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) {
      suffix = 'rd';
    }

    return `${dayOfWeek}, ${month} ${dayOfMonth}${suffix}`;
  }

  /**
   * Returns the rating element.
   * 
   * @param key 
   * @returns 
   */
  const getRating = (value: number) => {

    let text = '';
    let colorClass = '';

    switch (value) {
      case 0:
        text = 'very poor';
        colorClass = 'bg-red-400';
        break;
      case 1:
        text = 'poor';
        colorClass = 'bg-orange-400';
        break;
      case 2:
        text = 'poor to fair';
        colorClass = 'bg-yellow-400';
        break;
      case 3:
        text = 'fair';
        colorClass = 'bg-green-400';
        break;
      case 4:
        text = 'fair to good';
        colorClass = 'bg-emerald-600';
        break;
      case 5:
        text = 'good';
        colorClass = 'bg-indigo-400';
        break;
      case 6:
        text = 'epic ones!';
        colorClass = 'bg-purple-400';
        break;
      default:
        text = 'weird ones';
        colorClass = 'bg-white';
        break;
    }

    return (
      <div className={colorClass + ' px-3 py-1 rounded-full text-gray-900 text-xs'}>
        {text}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 p-5'>

      <div className='flex justify-between items-center'>
        <Link className='btn w-fit' href='/home'>
          Back
        </Link>

        <div className='text-xl font-bold text-white'>
          {spot?.name}
        </div>
      </div>

      <div className='h-full flex flex-col gap-2 mb-5'>
      { sixteenDayReport.map((report, idx) => (

          <div className='bg-gray-800 rounded-3xl p-5' key={idx}>

            <div className='flex justify-between items-center'>
              <div className='text-sky-300'>
                {formatDateString(report.timestamp)}
              </div>
              {getRating(Number(report.rating.value))}
            </div>

            <div className='flex justify-between items-baseline gap-4'>
              <div className='text-sky-200 text-3xl'>
                {report.waveHeightMin}-{report.waveHeightMax} ft
              </div>
              <div className='flex gap-2 text-sky-200 h-fit'>
                <FontAwesomeIcon icon={faWind} />
                <FontAwesomeIcon 
                  id={`wind-arrow-${idx}`} 
                  icon={faArrowUp}
                  style={{
                    transform: `rotate(${report.windDirection - 180}deg)`,
                  }}
                />
              </div>
            </div>
          </div>
        )
      )}
      </div>
    </div>
    
  )
}

export default Reports