import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/inputs/Button';
import UserLayout from '../../containers/UserLayout';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import DashboardChart from '../../components/graphs/DashboardChart';
import { useState } from 'react';
import { monthsData } from '../../constants/dashboard.constants';
import AddArtist from '../artists/AddArtist';

const UserDashboard = () => {
  // STATE VARIABLES
  const [streamingData, setStreamingData] = useState(monthsData());
  const [selectedButton, setSelectedButton] = useState(0);

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

  return (
    <UserLayout>
      <main className="flex flex-col gap-6 w-full p-4 px-6">
        <section className="flex flex-col gap-5 h-[80vh]">
          <menu className="flex w-full items-center gap-3 justify-between">
            <h1 className="font-semibold uppercase text-lg">Streaming data</h1>
            <Button styled={false}>
              <menu className="flex items-center gap-2 hover:gap-3 transition-all duration-200">
                Learn more
                <FontAwesomeIcon icon={faArrowRight} />
              </menu>
            </Button>
          </menu>
          <figure className="w-full h-[90%] p-2 shadow-md flex flex-col gap-6">
            <DashboardChart data={streamingData} dataKey="month" />
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
