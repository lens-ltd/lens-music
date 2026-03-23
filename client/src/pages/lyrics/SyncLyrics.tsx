import Button from "@/components/inputs/Button";
import Combobox from "@/components/inputs/Combobox";
import { Heading, RelaxedHeading } from "@/components/text/Headings";
import UserLayout from "@/containers/UserLayout";
import { useGetTrack } from "@/hooks/tracks/track.hooks";
import {
  useCreateLyricsMutation,
  useUpdateLyricsMutation,
} from "@/state/api/apiMutationSlice";
import type { AudioFile, Track } from "@/types/models/track.types";
import { LANGUAGES_LIST } from "@/constants/languages.constants";
import {
  faArrowRotateLeft,
  faBook,
  faClosedCaptioning,
  faPlus,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import LyricsGuidelines from "./LyricsGuidelines";
import { useFetchLyrics, useGetLyrics } from "@/hooks/lyrics/lyrics.hooks";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { Lyrics, TimedLyricLine } from "@/types/models/lyrics.types";
import {
  setDeleteLyricsModal,
  setLyricsGuideLinesModal,
  setSelectedLyrics,
} from "@/state/features/lyricSlice";
import DeleteLyrics from "./DeleteLyrics";

type SyncStateLine = {
  index: number;
  text: string;
  time?: number;
};

const formatSyncLabel = (lyrics: Lyrics) => {
  const createdAt = lyrics.createdAt
    ? new Date(lyrics.createdAt).toLocaleDateString()
    : "Draft";
  return `${lyrics.language.toUpperCase()} · ${createdAt}`;
};

const sortLyricsByNewest = (lyrics: Lyrics[]) =>
  [...lyrics].sort(
    (first, second) =>
      new Date(second.createdAt).getTime() -
      new Date(first.createdAt).getTime(),
  );

const toSyncLines = (content: TimedLyricLine[]): SyncStateLine[] =>
  content.map((line, index) => ({
    index,
    text: line.text,
    time: typeof line.time === "number" ? line.time : undefined,
  }));

const languageOptions = LANGUAGES_LIST.map((lang) => ({
  label: lang.name,
  value: lang.code,
}));

const SyncLyrics = () => {
  // STATE VARIABLES
  const dispatch = useAppDispatch();
  const { lyricsList, deleteLyricsModal } = useAppSelector(
    (state) => state.lyric,
  );

  // NAVIGATION
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const trackId = searchParams.get("trackId") ?? "";
  const lyricsId = searchParams.get("lyricsId") ?? "";

  const {
    getTrack,
    data: trackResponse,
    isFetching: trackIsFetching,
  } = useGetTrack();
  const { fetchLyrics, isFetching: lyricsAreFetching } = useFetchLyrics();
  const { getLyrics, isFetching: lyricsRecordIsFetching } = useGetLyrics();
  const [createLyrics, { isLoading: isCreatingLyrics }] =
    useCreateLyricsMutation();
  const [updateLyrics, { isLoading: isUpdatingLyrics }] =
    useUpdateLyricsMutation();

  const [selectedLyricsId, setSelectedLyricsId] = useState(lyricsId);
  const [editorLanguage, setEditorLanguage] = useState("en");
  const [plainTextLyrics, setPlainTextLyrics] = useState("");
  const [syncState, setSyncState] = useState<SyncStateLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSelectedLyricsId(lyricsId);
  }, [lyricsId]);

  useEffect(() => {
    if (trackId && !deleteLyricsModal) {
      void getTrack({ id: trackId });
      void fetchLyrics({ trackId, size: 100, page: 0 });
    }
  }, [fetchLyrics, getTrack, trackId, deleteLyricsModal]);

  const track = trackResponse?.data as Track | undefined;
  const lyricsRecords = useMemo<Lyrics[]>(() => {
    const rows = (lyricsList ?? []) as Lyrics[];
    return sortLyricsByNewest(rows);
  }, [lyricsList]);

  useEffect(() => {
    if (!lyricsId && !selectedLyricsId && lyricsRecords.length > 0) {
      const nextLyricsId = lyricsRecords[0]?.id ?? "";
      setSelectedLyricsId(nextLyricsId ?? "");
      setSearchParams((params) => {
        params.set("trackId", trackId);
        params.set("lyricsId", nextLyricsId ?? "");
        return params;
      });
    }
  }, [lyricsId, lyricsRecords, selectedLyricsId, setSearchParams, trackId]);

  useEffect(() => {
    if (!selectedLyricsId) {
      setEditorLanguage(track?.primaryLanguage || "en");
      setPlainTextLyrics("");
      setSyncState([]);
      return;
    }

    const matchingRecord = lyricsRecords.find(
      (record) => record.id === selectedLyricsId,
    );
    if (matchingRecord) {
      setEditorLanguage(
        matchingRecord.language || track?.primaryLanguage || "en",
      );
      setPlainTextLyrics(
        matchingRecord.content.map((line) => line.text).join("\n"),
      );
      setSyncState(toSyncLines(matchingRecord.content));
      setCurrentLineIndex(0);
      return;
    }

    void (async () => {
      try {
        const response = await getLyrics({ id: selectedLyricsId }).unwrap();
        const fetchedLyrics = response.data as Lyrics;
        setEditorLanguage(
          fetchedLyrics.language || track?.primaryLanguage || "en",
        );
        setPlainTextLyrics(
          fetchedLyrics.content.map((line) => line.text).join("\n"),
        );
        setSyncState(toSyncLines(fetchedLyrics.content));
        setCurrentLineIndex(0);
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to load the selected lyrics record.";
        toast.error(errorMessage);
      }
    })();
  }, [getLyrics, lyricsRecords, selectedLyricsId, track?.primaryLanguage]);

  const primaryAudio = useMemo<AudioFile | undefined>(
    () =>
      track?.audioFiles?.find((audioFile) => audioFile.isPrimary) ??
      track?.audioFiles?.[0],
    [track?.audioFiles],
  );

  const lyricLines = useMemo(
    () => plainTextLyrics.split("\n").map((line) => line.trimEnd()),
    [plainTextLyrics],
  );

  useEffect(() => {
    setSyncState((previousState) =>
      lyricLines.map((line, index) => {
        const existingLine = previousState.find((item) => item.index === index);
        return {
          index,
          text: line,
          time: existingLine?.time,
        };
      }),
    );

    setCurrentLineIndex((previousIndex) => {
      if (lyricLines.length === 0) {
        return 0;
      }
      return Math.min(previousIndex, lyricLines.length - 1);
    });
  }, [lyricLines]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) {
      return undefined;
    }

    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("play", handlePlay);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("pause", handlePause);
      audioElement.removeEventListener("play", handlePlay);
    };
  }, [handleTimeUpdate]);

  useEffect(() => {
    if (!lyricsRef.current) {
      return;
    }
    const lineElements = lyricsRef.current.children;
    if (lineElements[currentLineIndex] instanceof HTMLElement) {
      lineElements[currentLineIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLineIndex]);

  const handleSync = useCallback(
    (index: number) => {
      const nextLine = lyricLines[index] ?? "";
      setSyncState((previousState) =>
        previousState.map((line) =>
          line.index === index
            ? {
                ...line,
                text: nextLine,
                time: Number(currentTime.toFixed(2)),
              }
            : line,
        ),
      );
    },
    [currentTime, lyricLines],
  );

  const handleResetLine = useCallback((index: number) => {
    setSyncState((previousState) =>
      previousState.map((line) =>
        line.index === index
          ? {
              ...line,
              time: undefined,
            }
          : line,
      ),
    );
  }, []);

  const handleEditorKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "ArrowUp") {
        setCurrentLineIndex((previousIndex) => Math.max(previousIndex - 1, 0));
      }

      if (event.key === "ArrowDown") {
        setCurrentLineIndex((previousIndex) =>
          Math.min(previousIndex + 1, Math.max(lyricLines.length - 1, 0)),
        );
      }
    },
    [lyricLines.length],
  );

  useEffect(() => {
    const handleWindowKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowUp") {
        setCurrentLineIndex((previousIndex) => Math.max(previousIndex - 1, 0));
      } else if (event.code === "ArrowDown") {
        setCurrentLineIndex((previousIndex) =>
          Math.min(previousIndex + 1, Math.max(lyricLines.length - 1, 0)),
        );
      } else if (event.code === "Space" && isPlaying) {
        event.preventDefault();
        handleSync(currentLineIndex);
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);
    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [currentLineIndex, handleSync, isPlaying, lyricLines.length]);

  const handlePlayToggle = async () => {
    if (!audioRef.current) {
      return;
    }

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } catch {
      toast.error("Unable to start audio playback.");
    }
  };

  const handleSave = async () => {
    if (!trackId) {
      toast.error("Track ID is required to save synced lyrics.");
      return;
    }

    const payload = {
      trackId,
      language: editorLanguage.trim() || track?.primaryLanguage || "en",
      content: syncState.map((line) => ({
        text: line.text,
        ...(typeof line.time === "number" ? { time: line.time } : {}),
      })),
    };

    try {
      if (selectedLyricsId) {
        await updateLyrics({ id: selectedLyricsId, body: payload }).unwrap();
        toast.success("Lyrics sync updated successfully.");
      } else {
        const response = await createLyrics(payload).unwrap();
        const createdLyrics = response.data as Lyrics;
        toast.success("Lyrics sync created successfully.");
        setSelectedLyricsId(createdLyrics?.id ?? "");
        setSearchParams((params) => {
          params.set("trackId", trackId);
          params.set("lyricsId", createdLyrics?.id ?? "");
          return params;
        });
      }
      await fetchLyrics({ trackId, size: 100, page: 0 });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to save synced lyrics.";
      toast.error(errorMessage);
    }
  };

  const isBusy =
    trackIsFetching ||
    lyricsAreFetching ||
    lyricsRecordIsFetching ||
    isCreatingLyrics ||
    isUpdatingLyrics;

  if (!trackId) {
    return (
      <UserLayout>
        <main className="flex w-full flex-col gap-4">
          <section className="rounded-md border border-dashed border-[color:var(--lens-sand)]/70 bg-white p-8 text-center">
            <Heading className="!text-[color:var(--lens-ink)]">
              Track required
            </Heading>
            <p className="mt-3 text-[12px] text-[color:var(--lens-ink)]/55">
              Open lyrics sync from a track page so the editor can load the
              uploaded primary audio.
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
              >
                Go back
              </Button>
            </div>
          </section>
        </main>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <main className="flex w-full flex-col gap-4">
        <header className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
          <nav className="flex flex-wrap items-start justify-between gap-4">
            <menu className="space-y-1">
              <RelaxedHeading>Lyrics sync</RelaxedHeading>
              <Heading className="!text-[color:var(--lens-ink)]">
                {track?.title || "Track lyrics sync"}
              </Heading>
              <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                Sync lyrics against the uploaded primary audio and overwrite the
                selected lyrics record when you save.
              </p>
            </menu>
            <menu className="flex flex-wrap items-center gap-2">
              <Button icon={faPlus} route={`/lyrics/create?trackId=${trackId}`}>
                New lyrics record
              </Button>
            </menu>
          </nav>
        </header>

        {!primaryAudio ? (
          <section className="rounded-md border border-dashed border-[color:var(--lens-sand)]/70 bg-white p-8 text-center">
            <Heading className="!text-[color:var(--lens-ink)]">
              Primary audio required
            </Heading>
            <p className="mt-3 text-[12px] text-[color:var(--lens-ink)]/55">
              Upload track audio before syncing lyrics. The sync timeline uses
              the track&apos;s uploaded primary audio source.
            </p>
            <div className="mt-4 flex justify-center">
              <Button
                route={`/releases/${track?.releaseId}/manage-tracks/${trackId}`}
              >
                Back to track editor
              </Button>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.75fr)_360px]">
            <article className="flex flex-col gap-4">
              <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
                      Audio reference
                    </h2>
                    <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                      Primary uploaded audio · {primaryAudio.fileType}
                    </p>
                  </div>
                  <Button
                    icon={faClosedCaptioning}
                    onClick={(event) => {
                      event.preventDefault();
                      void handlePlayToggle();
                    }}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </header>

                <audio
                  ref={audioRef}
                  src={primaryAudio.storagePath}
                  preload="metadata"
                  className="mt-4 w-full"
                  controls
                />

                <dl className="mt-4 grid gap-3 rounded-md bg-[color:var(--lens-sand)]/10 p-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
                      Current time
                    </dt>
                    <dd className="text-sm text-[color:var(--lens-ink)]">
                      {currentTime.toFixed(2)}s
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
                      Active line
                    </dt>
                    <dd className="text-sm text-[color:var(--lens-ink)]">
                      {currentLineIndex + 1}
                    </dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
                      Synced lines
                    </dt>
                    <dd className="text-sm text-[color:var(--lens-ink)]">
                      {
                        syncState.filter(
                          (line) => typeof line.time === "number",
                        ).length
                      }{" "}
                      / {syncState.length}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
                      Lyrics lines
                    </h2>
                    <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                      Use ↑ and ↓ to move between lines, then press Space while
                      the audio is playing to capture a timestamp.
                    </p>
                  </div>
                  <Button
                    icon={faArrowRotateLeft}
                    onClick={(event) => {
                      event.preventDefault();
                      setCurrentLineIndex(0);
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        setCurrentTime(0);
                      }
                    }}
                  >
                    Reset playhead
                  </Button>
                </header>

                <div
                  ref={lyricsRef}
                  className="mt-4 flex max-h-[65vh] flex-col gap-3 overflow-y-auto"
                >
                  {syncState.map((line) => {
                    const isActive = line.index === currentLineIndex;
                    const isSynced = typeof line.time === "number";

                    return (
                      <section
                        key={`${line.index}-${line.text}`}
                        className={`rounded-md border p-3 transition-colors ${
                          isActive
                            ? "border-[color:var(--lens-blue)] bg-[color:var(--lens-blue)]/5"
                            : "border-[color:var(--lens-sand)]/40 bg-[color:var(--lens-sand)]/10"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="space-y-1">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--lens-ink)]/50">
                              Line {line.index + 1}
                            </p>
                            <p
                              className={`text-sm ${isSynced ? "font-normal text-[color:var(--lens-ink)]" : "text-[color:var(--lens-ink)]/70"}`}
                            >
                              {line.text || (
                                <span className="italic text-[color:var(--lens-ink)]/40">
                                  Blank line
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="min-w-16 text-right text-[11px] text-[color:var(--lens-blue)]">
                              {typeof line.time === "number"
                                ? `${line.time.toFixed(2)}s`
                                : "Not synced"}
                            </span>
                            <Button
                              onClick={(event) => {
                                event.preventDefault();
                                setCurrentLineIndex(line.index);
                                handleSync(line.index);
                              }}
                              className="!text-[11px]"
                              disabled={!isPlaying}
                            >
                              Sync now
                            </Button>
                            <Button
                              onClick={(event) => {
                                event.preventDefault();
                                handleResetLine(line.index);
                              }}
                              className="!text-[11px]"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            </article>

            <aside className="flex flex-col gap-4">
              <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
                <header className="space-y-1">
                  <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
                    Record selection
                  </h2>
                  <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                    Multiple lyrics records can exist per track. Saving
                    overwrites the currently selected record.
                  </p>
                </header>

                <label className="mt-4 flex flex-col gap-2">
                  <Combobox
                    label="Lyrics record"
                    options={lyricsRecords.map((lyrics) => ({
                      label: formatSyncLabel(lyrics),
                      value: lyrics.id,
                    }))}
                    value={selectedLyricsId}
                    onChange={(value) => {
                      if (!value) return;
                      setSelectedLyricsId(value);
                      setSearchParams((params) => {
                        params.set("trackId", trackId);
                        params.set("lyricsId", value as string);
                        return params;
                      });
                    }}
                    readOnly={lyricsRecords.length === 0}
                  />
                </label>

                {lyricsRecords.length > 0 && selectedLyricsId ? (
                  <div className="mt-3">
                    <Button
                      danger
                      icon={faTrash}
                      onClick={(event) => {
                        event.preventDefault();
                        dispatch(
                          setSelectedLyrics(
                            lyricsRecords.find(
                              (lyrics) => lyrics.id === selectedLyricsId,
                            ),
                          ),
                        );
                        dispatch(setDeleteLyricsModal(true));
                      }}
                    >
                      Delete lyrics record
                    </Button>
                  </div>
                ) : null}

                <div className="mt-4">
                  <Combobox
                    label="Language"
                    options={languageOptions}
                    value={editorLanguage}
                    onChange={(value) => setEditorLanguage(value)}
                    placeholder="Select language..."
                  />
                </div>
              </section>

              <section className="rounded-md border border-[color:var(--lens-sand)]/70 bg-white p-4">
                <header className="space-y-1">
                  <h2 className="text-sm font-normal text-[color:var(--lens-ink)]">
                    Lyrics editor
                  </h2>
                  <p className="text-[12px] text-[color:var(--lens-ink)]/55">
                    Update the plain lyric lines here before syncing timestamps.
                  </p>
                </header>

                <textarea
                  value={plainTextLyrics}
                  onChange={(event) => setPlainTextLyrics(event.target.value)}
                  onKeyDown={handleEditorKeyDown}
                  rows={18}
                  className="mt-4 w-full rounded-md border border-[color:var(--lens-sand)]/70 bg-[color:var(--lens-sand)]/10 p-3 text-[13px] text-[color:var(--lens-ink)] outline-hidden transition-colors focus:border-[color:var(--lens-blue)]"
                  placeholder="Enter one lyric line per row"
                />
              </section>

              <Link
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  dispatch(setLyricsGuideLinesModal(true));
                }}
                className="self-start text-[12px] text-[color:var(--lens-blue)] hover:underline underline-offset-2"
              >
                <FontAwesomeIcon icon={faBook} className="mr-1.5" />
                View lyrics guidelines
              </Link>
            </aside>
          </section>
        )}

        <footer className="flex w-full items-center justify-between gap-3">
          <Button
            onClick={(event) => {
              event.preventDefault();
              navigate(-1);
            }}
          >
            Back
          </Button>
          <Button
            primary
            icon={faSave}
            onClick={(event) => {
              event.preventDefault();
              void handleSave();
            }}
            isLoading={isBusy}
          >
            Save sync
          </Button>
        </footer>
      </main>

      <LyricsGuidelines />
      <DeleteLyrics />
    </UserLayout>
  );
};

export default SyncLyrics;
