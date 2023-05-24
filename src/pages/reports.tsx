import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { api } from '~/utils/api';
import { WaveReports } from '@prisma/client';

// interface WaveReport {
//   id: string,
//   spotId: string,
//   timestamp: Date,
//   utcOffset: number,
//   waveHeightMin: number,
//   waveHeightMax: number,
//   humanRelation: string,
//   swells: object[],
//   windSpeed: number,
//   windDirection: number,
//   directionType: string,
//   windGust: number,
//   airTemperature: number
// }

const Reports: NextPage = () => {

  const router = useRouter();
  const [sixteenDayReport, setSixteenDayReport] = useState<WaveReports[]>([]);

  const { spotId } = router.query as { spotId: string };

  const { data: result } = api.reports.getWaveReportBySpotId.useQuery({ spotId });

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
    const waveReportsArray = Object.values(waveReportsByDay);

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


  return (
    <div className='flex flex-col gap-4 p-5'>
      <Link className='btn w-fit' href='/home'>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Link>

      <div className='h-full flex flex-col gap-2 mb-5'>
      { sixteenDayReport.map((report, idx) => (

          <div className='bg-gray-800 rounded-3xl p-5' key={idx}>

            <div className='text-sky-300'>
              {formatDateString(report.timestamp)}
            </div>

            <div className='flex justify-start items-baseline gap-4'>
              <div className='text-sky-200 text-3xl'>
                {report.waveHeightMin}-{report.waveHeightMax}
              </div>
              <div className='text-sky-200 h-fit'>
                {report.humanRelation}
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