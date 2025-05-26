import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import UserLayout from '../../containers/UserLayout';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DashboardChart from '../../components/graphs/DashboardChart';
import { useState } from 'react';
import { monthsData } from '../../constants/dashboard.constants';
import AddArtist from '../artists/AddArtist';
import DashboardCard from '../../containers/DashboardCard';
import {
  faMusic,
  faDownload,
  faDollarSign,
} from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  // STATE VARIABLES
  const [streamingData, setStreamingData] = useState(monthsData());
  const [selectedButton, setSelectedButton] = useState(0);

  // CHART NAVIGATIONS
  const chartNavigations = [
    {
      label: 'Streams',
    },
    {
      label: 'Downloads',
    },
    {
      label: 'Revenue',
    },
  ];

  // DASHBOARD CARDS
  const dashboardCards = [
    {
      title: 'Total Streams',
      value: '1,234,567',
      icon: faMusic,
      color: '#f1f5f9',
    },
    {
      title: 'Total Downloads',
      value: '89,123',
      icon: faDownload,
      color: '#f8fafc',
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: faDollarSign,
      color: '#f3f4f6',
    },
  ];

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 w-full">
        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-2">
          {dashboardCards.map((card, index) => {
            return (
              <DashboardCard
                key={index}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
              />
            );
          })}
        </section>
        {/* Chart Section */}
        <section className="flex flex-col gap-5 h-[70vh]">
          <menu className="flex w-full items-center gap-3 justify-between">
            <h1 className="font-semibold uppercase text-lg">Streaming data</h1>
            <Button styled={false}>
              <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-200">
                Learn more
                <FontAwesomeIcon icon={faArrowRight} />
              </menu>
            </Button>
          </menu>
          <figure className="w-full h-[80%] p-2 bg-white/70 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-200/40 backdrop-blur-md">
            <DashboardChart
              data={streamingData}
              dataKey="month"
              height="80%"
              width="100%"
              fill="#a8edea"
              strokeWidth={3}
            />
            <menu className="flex items-center gap-6 justify-center w-full">
              {chartNavigations.map((navigation, index: number) => {
                return (
                  <Button
                    primary={selectedButton === index}
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setStreamingData(monthsData());
                      setSelectedButton(index);
                    }}
                  >
                    {' '}
                    {navigation?.label}
                  </Button>
                );
              })}
            </menu>
          </figure>
        </section>
      </main>
      <AddArtist />
    </UserLayout>
  );
};

export default UserDashboard;
