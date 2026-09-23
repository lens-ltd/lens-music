import { Heading } from '@/components/text/Headings';
import Button from '@/components/inputs/Button';
import UserLayout from '@/containers/UserLayout';

import { LuPlus } from 'react-icons/lu';

const ListLyrics = () => {
  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <div>
            <Heading>Lyrics</Heading>
            <p className="type-meta mt-1">
              Write and time lyrics for your tracks.
            </p>
          </div>
          <Button primary icon={LuPlus} route='create'>
            Add lyrics
          </Button>
        </nav>
      </main>
    </UserLayout>
  );
};

export default ListLyrics;
