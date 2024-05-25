"use client";  

import React, { useState, useEffect } from 'react';
import PageButton from './pageButton';
import NavigationButton from './navigationButton';
// import notesData from './notes.json';

const numOfPages: number = 100;
const notesPerPage: number = 10;

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

// interface NotesData {
//   notes: Note[];
// }

const Myapp: React.FC = () => {
  const initialArray: boolean[] = Array(numOfPages).fill(false).map((value, index) => index < 5);
  const [buttonsArray, setButtonsArray] = useState<boolean[]>(initialArray);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Fetch the initial note when the component mounts
    fetchNotesForPage(1);
  }, []);

  const fetchNotesForPage = async (page: number) => {
    try {
      const start: number = (page - 1) * notesPerPage;
      const end: number = page * notesPerPage;
      const response = await fetch(`http://localhost:3001/notes?_start=${start}&_end=${end}`);
  
      if (!response.ok) {
        // If response status is not in the range 200-299
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const notes: Note[] = await response.json();
      setCurrentNotes(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Optionally, you can set an error state here to display an error message to the user
    }
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
    fetchNotesForPage(index + 1); // Fetch the note for the selected page
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
    fetchNotesForPage(1); // Fetch the first note
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
    fetchNotesForPage(numOfPages); // Fetch the last note
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
        {currentNotes.length > 0 ? (
          currentNotes.map(note => (
            <div key={note.id}>
              <h1>{note.content}</h1>
            </div>
          ))
        ) : (
          <h1>No content</h1>
        )}
      </div>
    </div>
  );
}

export default Myapp;