import Picker from "emoji-picker-react";
import React from "react";

interface EmojiModalProps {}
interface EmojiModalState {}

class EmojiModal extends React.Component<EmojiModalProps, EmojiModalState> {
    render() {
        return (
            <div>
                <Picker />
            </div>
        );
    }
}

export default EmojiModal;
