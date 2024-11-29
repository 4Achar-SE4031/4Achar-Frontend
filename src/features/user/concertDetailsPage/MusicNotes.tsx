// MusicNotes.tsx
import React from 'react';
import './eventdetails.css'; // Import the CSS for the EventDetails component

interface MusicNotesProps {
  count: number; // Prop to control the number of notes
}

const MusicNotes: React.FC<MusicNotesProps> = ({ count }) => {
  // Array of musical note symbols
  const notes = ['♫', '♪', '♫', '♬', '♪', '♩'];

  // Generate an array of notes based on the count prop
  const notesArray = Array.from({ length: count }, (_, index) => notes[index % notes.length]);

  return (
    <div className="music-notes-container">
      {notesArray.map((note, index) => (
        <div
          className="music-note"
          key={index}
          style={{
            animationDelay: `${Math.random() * 5}s`, // Random delay for each note
            left: `${Math.random() * 100}vw`, // Random horizontal position
            top: `${Math.random() * 100}vh`, // Random vertical position
            fontSize: `${Math.random() * 30 + 20}px`, // Random font size for each note
          }}
        >
          {note}
        </div>
      ))}
    </div>
  );
};

export default MusicNotes;
