"use client";  

import React, { useState, useEffect } from 'react';
import PageButton from './pageButton';
import NavigationButton from './navigationButton';
import notesData from './notes.json';

const numOfPages: number = 11;

interface Author {
  name: string;
  email: string;
}

interface Note {
  id: number;
  title: string;
  author: Author;
  content: string;
}

interface NotesData {
  notes: Note[];
}

const Myapp: React.FC = () => {
  const initialArray: boolean[] = Array(numOfPages).fill(false).map((value, index) => index < 5);
  const [buttonsArray, setButtonsArray] = useState<boolean[]>(initialArray);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);

  useEffect(() => {
    // Fetch the initial note when the component mounts
    fetchNoteForPage(1);
  }, []);

  const fetchNoteForPage = (page: number) => {
    const note = notesData.notes[page - 1];
    setCurrentNote(note);
  };

  const handleButtonClick = (index: number) => {
    if (numOfPages > 5) {
      const tempArray = new Array<boolean>(numOfPages).fill(false);
      if (index < 2) {
        for (let i = 0; i < 5; i++) {
          tempArray[i] = true;
        }
      } else if (index > numOfPages - 3) {
        for (let i = numOfPages - 5; i < numOfPages; i++) {
          tempArray[i] = true;
        }
      } else {
        for (let i = 0; i < tempArray.length; i++) {
          if (i >= index - 2 && i <= index + 2) {
            tempArray[i] = true;
          }
        }
      }
      setButtonsArray(tempArray);
    }
    setCurrentPage(index + 1);
    fetchNoteForPage(index + 1); // Fetch the note for the selected page
  };

  const handleFirstClick = () => {
    if (numOfPages > 5) {
      const tempArray = new Array<boolean>(numOfPages).fill(false);
      for (let i = 0; i < 5; i++) {
        tempArray[i] = true;
      }
      setButtonsArray(tempArray);
    }
    setCurrentPage(1);
    fetchNoteForPage(1); // Fetch the first note
  };

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      handleButtonClick(currentPage - 2);
    }
  };

  const handleNextClick = () => {
    if (currentPage < numOfPages) {
      handleButtonClick(currentPage);
    }
  };

  const handleLastClick = () => {
    if (numOfPages > 5) {
      let tempArray = new Array<boolean>(numOfPages).fill(false);
      for (let i = numOfPages - 5; i < numOfPages; i++) {
        tempArray[i] = true;
      }
      setButtonsArray(tempArray);
    }
    setCurrentPage(numOfPages);
    fetchNoteForPage(numOfPages); // Fetch the last note
  };

  return (
    <div>
      <div className="pagination">
        <NavigationButton value='first' disable={currentPage === 1} onNavigationClick={handleFirstClick} />
        <NavigationButton value='previous' disable={currentPage === 1} onNavigationClick={handlePreviousClick} />

        {buttonsArray.map((showButton, index) => {
          const isActive = currentPage === index + 1;
          const className = isActive ? 'active' : '';

          return (
            <PageButton
              key={index}
              value={index + 1}
              showButton={showButton}
              onButtonClick={() => handleButtonClick(index)}
              className={className}
            />
          );
        })}

        <NavigationButton value='next' disable={currentPage === numOfPages} onNavigationClick={handleNextClick} />
        <NavigationButton value='last' disable={currentPage === numOfPages} onNavigationClick={handleLastClick} />
      </div>

      <div className='text'>
      {currentNote ? (
          <div>
            <h1>{currentNote.title}</h1>
            <p>{currentNote.content}</p>
            <p>{currentNote.author.name}</p>
            <p>{currentNote.author.email}</p>
          </div>
        ) : (
          <h1>no content</h1>
        )}
      </div>
    </div>
  );
}

export default Myapp;