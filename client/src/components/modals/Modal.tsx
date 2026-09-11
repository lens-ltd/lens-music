import { FC } from 'react';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  mainClassName?: string;
  heading?: string;
  headingClassName?: string;
}

const JSX_MODAL: FC<ModalProps> = ({
  isOpen,
  children,
  onClose,
  heading = null,
  headingClassName = null,
  className = null,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`z-10000 min-w-[40vw] max-h-[90vh] overflow-y-auto ${className}`}
      >
        <DialogHeader>
          <DialogTitle
            className={`text-lg font-medium text-(--ink) mt-[-10px] ${headingClassName}`}
          >
            {heading}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <section className="h-fit">{children}</section>
      </DialogContent>
    </Dialog>
  );
};

const Modal: FC<ModalProps> = (props) => {
  const modalContainer = document.querySelector('#modal');
  if (!modalContainer) {
    throw new Error('Modal container not found');
  }

  return ReactDOM.createPortal(<JSX_MODAL {...props} />, modalContainer);
};

export default Modal;
