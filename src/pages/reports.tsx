import { type NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
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
  const now = new Date();
  const hour = now.getUTCHours();
  
  const { data: result } = api.reports.get16DayReportBySpotId.useQuery({ spotId, hour });

  useEffect(() => {
    if (result) {
      const reports = Object.entries(result)
        .map(([_, reportData]) => {
  
          if (typeof reportData === 'object' && reportData?.hasOwnProperty('report')) {
            return reportData.report;
          }
        })
  
        setSixteenDayReport(reports);
    }
  }, [result]);

  console.log("REPORTS", sixteenDayReport)

  return (
    <div>
      { sixteenDayReport.map(report => (

          <div key={report.}>
            {report.waveHeightMin}-{report.waveHeightMax}
          </div>
        )
      )}
    </div>
  )
}

export default Reports