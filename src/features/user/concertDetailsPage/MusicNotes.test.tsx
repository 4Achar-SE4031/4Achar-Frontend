import { render, screen } from '@testing-library/react';
import MusicNotes from './MusicNotes';

describe('MusicNotes Component', () => {
  it('renders the correct number of notes', () => {
    render(<MusicNotes count={5} />);

    // Check that there are exactly 5 music notes rendered
    const notes = document.getElementsByClassName('music-note');
    expect(notes.length).toBe(5); // Check the length of the notes
  });

  it('renders music notes with random styles', () => {
    render(<MusicNotes count={3} />);

    // Check that the notes have random styles
    const notes = document.getElementsByClassName('music-note');
    expect(notes.length).toBeGreaterThan(0);

    // Check if each note has random styles (e.g., position, font size)
    const firstNote = notes[0] as HTMLElement;
    const secondNote = notes[1] as HTMLElement;
    expect(firstNote.style.left).not.toEqual(secondNote.style.left);
    expect(firstNote.style.top).not.toEqual(secondNote.style.top);
    expect(firstNote.style.fontSize).not.toEqual(secondNote.style.fontSize);
  });
});
