import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface Pengaduan {
  id_pengaduan: number;
  createdAt: string;
}

const CharTwo: React.FC = () => {
  const [pengaduanData, setPengaduanData] = useState<Pengaduan[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/pengaduan');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Pengaduan[] = await response.json();
      setPengaduanData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getVisitorCountByDay = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts = new Array(daysInMonth).fill(0);

    pengaduanData.forEach((item) => {
      const date = new Date(item.createdAt);
      if (date.getFullYear() === year && date.getMonth() === month) {
        counts[date.getDate() - 1]++;
      }
    });

    return counts;
  };

  const visitorCounts = getVisitorCountByDay(selectedYear, selectedMonth);
  const totalVisitors = visitorCounts.reduce((a, b) => a + b, 0);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: Array.from({ length: visitorCounts.length }, (_, i) => (i + 1).toString()),
      title: {
        text: 'Day of Month',
      },
    },
    yaxis: {
      title: {
        text: 'Number of Visitors',
      },
      min: 0,
      forceNiceScale: true,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => val + " visitors",
      },
    },
    colors: ['#3C50E0'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  const series = [
    {
      name: 'Visitors',
      data: visitorCounts,
    },
  ];

  const years = Array.from(new Set(pengaduanData.map(item => new Date(item.createdAt).getFullYear())));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center mb-2 sm:mb-0">
          <h4 className="text-2xl font-bold text-black dark:text-white">
            Total Visitors: {totalVisitors}
          </h4>
        </div>
        <div className="flex gap-3 font-bold text-black">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-lg border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200 px-2 py-1"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="visitorChart" className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};

export default CharTwo;