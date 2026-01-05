import type { ReactNode } from "react";

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // Optional className prop
}
