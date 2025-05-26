import { Heading } from '@/components/text/Headings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@/components/inputs/Button';
import UserLayout from '@/containers/UserLayout';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ListLyrics = () => {
  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex items-center gap-3 justify-between">
          <Heading>Lyrics</Heading>
          <Button primary route='create'>
            <menu className="w-full flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              <p>Add new lyrics</p>
            </menu>
          </Button>
        </nav>
      </main>
    </UserLayout>
  );
};

export default ListLyrics;
