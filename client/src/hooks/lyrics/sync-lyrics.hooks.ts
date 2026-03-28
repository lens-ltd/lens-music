import { useCreateLyricsMutation, useUpdateLyricsMutation } from "@/state/api/apiMutationSlice";
import { setDeleteLyricsModal, setLyricsGuideLinesModal, setSelectedLyrics } from "@/state/features/lyricSlice";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { LANGUAGES_LIST } from "@/constants/languages.constants";
import { useFetchLyrics, useGetLyrics } from "@/hooks/lyrics/lyrics.hooks";
import { useGetTrack } from "@/hooks/tracks/track.hooks";
import type { Lyrics, TimedLyricLine } from "@/types/models/lyrics.types";
import type { AudioFile, Track } from "@/types/models/track.types";
import {
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export type SyncStateLine = {
  index: number;
  text: string;
  time?: number;
};

export const languageOptions = LANGUAGES_LIST.map((language) => ({
  label: language.name,
  value: language.code,
}));

export const formatSyncLabel = (lyrics: Lyrics) => {
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

export const useSyncLyricsPlayback = () => {
  const [plainTextLyrics, setPlainTextLyrics] = useState("");
  const [syncState, setSyncState] = useState<SyncStateLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const audioRef = useCallback((node: HTMLAudioElement | null) => {
    setAudioElement(node);
  }, []);
  const lyricsRef = useRef<HTMLDivElement | null>(null);

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
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  }, [audioElement]);

  useEffect(() => {
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
  }, [audioElement, handleTimeUpdate]);

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

  useEffect(() => {
    const handleWindowKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTextInput =
        target.tagName === "TEXTAREA" || target.tagName === "INPUT";

      if (event.code === "ArrowUp" && !isTextInput) {
        setCurrentLineIndex((previousIndex) => Math.max(previousIndex - 1, 0));
      } else if (event.code === "ArrowDown" && !isTextInput) {
        setCurrentLineIndex((previousIndex) =>
          Math.min(previousIndex + 1, Math.max(lyricLines.length - 1, 0)),
        );
      } else if (event.code === "Space" && isPlaying && !isTextInput) {
        event.preventDefault();
        const now = audioElement?.currentTime ?? 0;
        setSyncState((previousState) =>
          previousState.map((line) =>
            line.index === currentLineIndex
              ? {
                  ...line,
                  text: lyricLines[currentLineIndex] ?? "",
                  time: Number(now.toFixed(2)),
                }
              : line,
          ),
        );
        setCurrentLineIndex((previousIndex) =>
          Math.min(previousIndex + 1, Math.max(lyricLines.length - 1, 0)),
        );
      }
    };

    window.addEventListener("keydown", handleWindowKeyDown);

    return () => window.removeEventListener("keydown", handleWindowKeyDown);
  }, [audioElement, currentLineIndex, isPlaying, lyricLines]);

  const hydrateSyncState = useCallback(
    (content: TimedLyricLine[]) => {
      setPlainTextLyrics(content.map((line) => line.text).join("\n"));
      setSyncState(toSyncLines(content));
      setCurrentLineIndex(0);
      setCurrentTime(0);

      if (audioElement) {
        audioElement.currentTime = 0;
      }
    },
    [audioElement],
  );

  const clearSyncState = useCallback(() => {
    setPlainTextLyrics("");
    setSyncState([]);
    setCurrentLineIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);

    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }, [audioElement]);

  const resetPlayhead = useCallback(() => {
    setCurrentLineIndex(0);
    setCurrentTime(0);

    if (audioElement) {
      audioElement.currentTime = 0;
    }
  }, [audioElement]);

  const handleSync = useCallback(
    (index: number) => {
      const now = audioElement?.currentTime ?? 0;
      setSyncState((previousState) =>
        previousState.map((line) =>
          line.index === index
            ? {
                ...line,
                text: lyricLines[index] ?? "",
                time: Number(now.toFixed(2)),
              }
            : line,
        ),
      );
    },
    [audioElement, lyricLines],
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

  return {
    audioRef,
    lyricsRef,
    plainTextLyrics,
    setPlainTextLyrics,
    syncState,
    currentLineIndex,
    currentTime,
    isPlaying,
    setCurrentLineIndex,
    handleSync,
    handleResetLine,
    handleEditorKeyDown,
    hydrateSyncState,
    clearSyncState,
    resetPlayhead,
  };
};

export const useSyncLyricsPage = ({
  syncState,
  hydrateSyncState,
  clearSyncState,
}: {
  syncState: SyncStateLine[];
  hydrateSyncState: (content: TimedLyricLine[]) => void;
  clearSyncState: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { lyricsList, deleteLyricsModal } = useAppSelector(
    (state) => state.lyric,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const trackId = searchParams.get("trackId") ?? "";
  const selectedLyricsId = searchParams.get("lyricsId") ?? "";

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

  const [editorLanguage, setEditorLanguage] = useState("en");

  useEffect(() => {
    if (trackId && !deleteLyricsModal) {
      void getTrack({ id: trackId });
      void fetchLyrics({ trackId, size: 100, page: 0 });
    }
  }, [deleteLyricsModal, fetchLyrics, getTrack, trackId]);

  const track = trackResponse?.data as Track | undefined;
  const lyricsRecords = useMemo<Lyrics[]>(() => {
    const rows = (lyricsList ?? []) as Lyrics[];
    return sortLyricsByNewest(rows);
  }, [lyricsList]);

  useEffect(() => {
    if (
      trackId &&
      !selectedLyricsId &&
      lyricsRecords.length > 0
    ) {
      const nextLyricsId = lyricsRecords[0]?.id ?? "";
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("trackId", trackId);
        next.set("lyricsId", nextLyricsId);
        return next;
      });
    }
  }, [lyricsRecords, selectedLyricsId, setSearchParams, trackId]);

  useEffect(() => {
    if (!selectedLyricsId) {
      setEditorLanguage(track?.primaryLanguage || "en");
      clearSyncState();
      return;
    }

    const matchingRecord = lyricsRecords.find(
      (record) => record.id === selectedLyricsId,
    );
    if (matchingRecord) {
      setEditorLanguage(
        matchingRecord.language || track?.primaryLanguage || "en",
      );
      hydrateSyncState(matchingRecord.content);
      return;
    }

    void (async () => {
      try {
        const response = await getLyrics({ id: selectedLyricsId }).unwrap();
        const fetchedLyrics = response.data as Lyrics;
        setEditorLanguage(
          fetchedLyrics.language || track?.primaryLanguage || "en",
        );
        hydrateSyncState(fetchedLyrics.content);
      } catch (error) {
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Unable to load the selected lyrics record.";
        toast.error(errorMessage);
      }
    })();
  }, [
    clearSyncState,
    getLyrics,
    hydrateSyncState,
    lyricsRecords,
    selectedLyricsId,
    track?.primaryLanguage,
  ]);

  const primaryAudio = useMemo<AudioFile | undefined>(
    () =>
      track?.audioFiles?.find((audioFile) => audioFile.isPrimary) ??
      track?.audioFiles?.[0],
    [track?.audioFiles],
  );

  const handleSelectLyrics = useCallback(
    (value: string) => {
      if (!value) return;

      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set("trackId", trackId);
        next.set("lyricsId", value);
        return next;
      });
    },
    [setSearchParams, trackId],
  );

  const openDeleteModal = useCallback(() => {
    dispatch(
      setSelectedLyrics(
        lyricsRecords.find((lyrics) => lyrics.id === selectedLyricsId),
      ),
    );
    dispatch(setDeleteLyricsModal(true));
  }, [dispatch, lyricsRecords, selectedLyricsId]);

  const openGuidelinesModal = useCallback(() => {
    dispatch(setLyricsGuideLinesModal(true));
  }, [dispatch]);

  const handleSave = useCallback(async () => {
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
        setSearchParams((params) => {
          const next = new URLSearchParams(params);
          next.set("trackId", trackId);
          next.set("lyricsId", createdLyrics?.id ?? "");
          return next;
        });
      }

      await fetchLyrics({ trackId, size: 100, page: 0 });
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to save synced lyrics.";
      toast.error(errorMessage);
    }
  }, [
    createLyrics,
    editorLanguage,
    fetchLyrics,
    selectedLyricsId,
    setSearchParams,
    syncState,
    track?.primaryLanguage,
    trackId,
    updateLyrics,
  ]);

  const isBusy =
    trackIsFetching ||
    lyricsAreFetching ||
    lyricsRecordIsFetching ||
    isCreatingLyrics ||
    isUpdatingLyrics;

  return {
    trackId,
    track,
    primaryAudio,
    lyricsRecords,
    selectedLyricsId,
    editorLanguage,
    setEditorLanguage,
    isBusy,
    handleSelectLyrics,
    openDeleteModal,
    openGuidelinesModal,
    handleSave,
  };
};
