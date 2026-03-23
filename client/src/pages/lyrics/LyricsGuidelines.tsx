import Modal from '@/components/modals/Modal';
import { setLyricsGuideLinesModal } from '@/state/features/lyricSlice';
import { AppDispatch, RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { lyricsGuidelines } from '@/constants/lyrics.constants';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const LyricsGuidelines = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { lyricsGuideLinesModal } = useSelector(
    (state: RootState) => state.lyric
  );

  return (
    <Modal
      isOpen={lyricsGuideLinesModal}
      onClose={() => dispatch(setLyricsGuideLinesModal(false))}
      heading="Lyrics guidelines"
      className="min-w-[60vw]"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ children }) => (
            <h2 className="mb-2 mt-5 border-b border-[color:var(--lens-sand)]/70 pb-1 text-sm font-semibold text-[color:var(--lens-ink)] first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 mt-4 text-[12px] font-semibold text-[color:var(--lens-ink)]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 text-[12px] leading-relaxed text-[color:var(--lens-ink)]/75">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-3 mt-1 list-disc space-y-1 pl-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-[12px] leading-relaxed text-[color:var(--lens-ink)]/75">
              {children}
            </li>
          ),
        }}
      >
        {lyricsGuidelines}
      </ReactMarkdown>
    </Modal>
  );
};

export default LyricsGuidelines;
