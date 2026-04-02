"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ComponentRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const router = useRouter();

  // create ref element
  const dialogRef = useRef<ComponentRef<"dialog">>(null);

  // open modal for current modal element (ref) if not already open
  useEffect(() => {
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, []);

  // navigate back to close modal
  function onDismiss() {
    router.back();
  }

  // createPortal: render modal content inside #modal-root element
  return createPortal(
    <dialog ref={dialogRef} className="relative z-10" onClose={onDismiss}>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/40 transition-opacity">
        <div className="mb-4 grid w-fit grid-rows-[auto_1fr] place-self-end rounded-xl bg-neutral-100 p-4">
          <button
            type="button"
            onClick={onDismiss}
            aria-label="close modal"
            className="w-fit cursor-pointer place-self-start rounded-md bg-transparent p-2 transition hover:bg-purple-900/85 hover:text-white"
          >
            <X />
          </button>
          {children}
        </div>
      </div>
    </dialog>,
    document.querySelector("#modal-root") as HTMLDivElement,
  );
}
