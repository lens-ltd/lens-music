import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import store from 'store';
import UserLayout from '@/containers/UserLayout';
import { Heading } from '@/components/text/Headings';
import { Button as UIButton } from '@/components/ui/button';
import Input from '@/components/inputs/Input';
import { Link } from 'react-router-dom';
import Button from '@/components/inputs/Button';

const SyncLyrics = () => {
  // STATE VARIABLES
  const [lyricsData] = useState(
    store.get('lyrics')
      ? JSON.parse(store.get('lyrics'))
      : { title: '', content: '' }
  );
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [syncedLyrics, setSyncedLyrics] = useState<
    {
      time: number;
      line: string;
      index: number;
    }[]
  >([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleSync = useCallback(
    (line: string, index: number) => {
      setSyncedLyrics((prev) => {
        const newSyncedLyrics = prev.filter((item) => item.index !== index);
        return [...newSyncedLyrics, { time: currentTime, line, index }].sort(
          (a, b) => a.index - b.index
        );
      });
    },
    [currentTime]
  );

  const audioRef = useRef(null);
  const lyricsRef = useRef(null);

  const splitLyrics = useMemo(
    () => lyricsData.content.split('\n'),
    [lyricsData.content]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.code === 'ArrowUp' && currentLineIndex > 0) {
        setCurrentLineIndex((prev) => prev - 1);
      } else if (
        event.code === 'ArrowDown' &&
        currentLineIndex < splitLyrics.length - 1
      ) {
        setCurrentLineIndex((prev) => prev + 1);
      } else if (event.code === 'Space' && isPlaying) {
        event.preventDefault();
        const currentLine = splitLyrics[currentLineIndex];
        handleSync(currentLine, currentLineIndex);
      }
    },
    [currentLineIndex, splitLyrics, isPlaying, handleSync]
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentLineIndex, isPlaying, handleTimeUpdate, handleKeyDown]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setAudio(url);
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (lyricsRef.current) {
      const lineElements = lyricsRef.current.children;
      if (lineElements[currentLineIndex]) {
        lineElements[currentLineIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentLineIndex]);

  return (
    <UserLayout>
      <main className="w-full flex flex-col gap-4">
        <nav className="w-full flex flex-col items-center gap-3 justify-center">
          <ul className="flex items-center gap-3">
            <Heading>Lyrics</Heading>
            <li>
              <Input type="file" accept="audio/*" onChange={handleFileUpload} />
            </li>
            <li>
              <UIButton
                variant={`outline`}
                className="text-[13px] p-1 px-4"
                onClick={handlePlay}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </UIButton>
            </li>
          </ul>
        </nav>
        <section className="flex items-center justify-center w-[80%] mx-auto flex-col gap-4">
          <h1 className="text-2xl font-bold">{lyricsData.title}</h1>
          <article
            ref={lyricsRef}
            className="text-md flex flex-col gap-1 text-gray-500 text-left w-full max-h-[70vh] overflow-y-auto p-4"
          >
            {splitLyrics.map((line: string, index: number) => {
              const lyricLine = syncedLyrics.find(
                (item) => item.index === index
              );
              return (
                <section
                  key={index}
                  className={`flex justify-between items-center mb-2 w-full ${
                    index === currentLineIndex ? 'bg-gray-100' : ''
                  }`}
                >
                  <Link
                    to={`#`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentLineIndex(index);
                    }}
                    className="flex items-center gap-2 hover:bg-background p-1 px-2 rounded-md w-full cursor-pointer"
                  >
                    {lyricLine && (
                      <span className="text-sm text-primary font-medium">
                        {lyricLine.time.toFixed(2)}s
                      </span>
                    )}
                    <p
                      className={`${
                        syncedLyrics.some((item) => item.index === index)
                          ? 'text-black font-medium'
                          : 'text-gray-500'
                      } hover:text-black`}
                    >
                      {line}
                    </p>
                  </Link>
                  <UIButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(line, index)}
                    disabled={!audio || !isPlaying}
                  >
                    Sync
                  </UIButton>
                </section>
              );
            })}
            <menu
              className="w-full flex items-center justify-end mt-5"
              onClick={(e) => {
                e.preventDefault();
                console.log(
                  syncedLyrics?.map((item) => {
                    return {
                      time: item?.time,
                      text: item?.line,
                    };
                  })
                );
              }}
            >
              <Button primary className="self-end">
                Save
              </Button>
            </menu>
          </article>
        </section>
        {audio && <audio ref={audioRef} src={audio} />}
      </main>
    </UserLayout>
  );
};

export default SyncLyrics;
