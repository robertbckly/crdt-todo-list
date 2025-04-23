import { useEffect, useRef, type PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  open: boolean;
  onClose: () => void;
}>;

export const ModalDialog = ({ open, children, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.addEventListener('close', onClose);
    return () => dialog?.removeEventListener('close', onClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="mx-auto mt-[20vh] w-full max-w-md rounded bg-transparent"
    >
      <div className="mx-4 bg-white shadow-lg">{children}</div>
    </dialog>
  );
};
