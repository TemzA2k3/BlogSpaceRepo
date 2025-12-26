export interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    show: boolean;
    onClose: () => void;
  }