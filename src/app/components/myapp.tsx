"use client";  

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageButton from './pageButton';
import NavigationButton from './navigationButton';

let numOfPages: number = 0;
const POSTS_PER_PAGE: number = 10;
const NOTES_URL = 'http://localhost:3001/notes';

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

const Myapp: React.FC = () => {
  
  const [buttonsArray, setButtonsArray] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentNotes, setCurrentNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState<number>(3);

  useEffect(() => {
    const fetchNotesForPage = async (page: number) => {
      try {
        const response = await axios.get(NOTES_URL, {
          params: {
            _page: page,
            _limit: POSTS_PER_PAGE
          }
        });
        
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        setCurrentNotes(response.data);
        const totalNotesCount = parseInt(response.headers['x-total-count'], 10);
        if(totalNotesCount != totalNotes){
          numOfPages = Math.ceil(totalNotesCount / POSTS_PER_PAGE);
          if(numOfPages < currentPage){
            handleButtonClick(numOfPages - 1);
           }
          else{
           handleButtonClick(currentPage - 1);
          }
          setTotalNotes(totalNotesCount);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotesForPage(currentPage);
  }, [currentPage]);

  
  // hanle click on page button and update the relevant states
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
    else{
      const tempArray = new Array<boolean>(numOfPages).fill(true);
      setButtonsArray(tempArray);
    }
    setCurrentPage(index + 1);
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
  };

  return (
    <div className='app'>
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
            <div className='post' key={note.id} id ={`${note.id}`}>
              <h1>{note.title}</h1>
              <p><strong>Author:</strong> {note.author.name} ({note.author.email})</p>
              <p>{note.content}</p>
            </div>
          ))
        ) : (
          <h1>{null}</h1>
        )}
      </div>
    </div>
  );
}

export default Myapp;