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
      >
        {lyricsGuidelines}
      </ReactMarkdown>
    </Modal>
  );
};

export default LyricsGuidelines;
