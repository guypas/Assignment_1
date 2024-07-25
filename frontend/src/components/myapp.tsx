"use client";  

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageButton from './pageButton';
import NavigationButton from './navigationButton';
import '../app/globals.css';


let numOfPages: number = 1; 
const POSTS_PER_PAGE: number = 10;
const NOTES_URL = 'http://localhost:3001/notes';
const USERS_URL = 'http://localhost:3001/users';
const LOGIN_URL = 'http://localhost:3001/login';

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

interface MyProps {
  firstPage: Note[];
  totalNotesCount: number;
}

const Myapp: React.FC<MyProps> = ({ firstPage, totalNotesCount }) => {
  
  const [buttonsArray, setButtonsArray] = useState<boolean[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentNotes, setCurrentNotes] = useState<Note[]>(firstPage || []);
  const [totalNotes, setTotalNotes] = useState<number>(3);

  const [darkMode, setDarkMode] = useState<boolean>(false);

  const [editNoteIndex, setEditNoteIndex] = useState<number>(-1);
  const [editedContent, setEditedContent] = useState<string>('');

  const [addContent, setAddContent] = useState<string>('');
  const [addpress, setAddPress] = useState<boolean>(false);

  const [name, setName ] = useState<string>('');
  const [email, setEmail ] = useState<string>('');
  const [username, setUsername ] = useState<string>('');
  const [password, setPassword ] = useState<string>('');

  const [loginUsername, setLoginUsername ] = useState<string>('');
  const [loginPassword, setLoginPassword ] = useState<string>('');

  const [token, setToken] = useState<string>('');
  const [loggedInUserName, setLoggedInUserName] = useState<string>('');

  const [cache, setCache] = useState<{ [Key: number] : Note[] }>({ 1:firstPage });

  console.log("render");

  useEffect(() => {
    if(cache[currentPage])
    {
      setCurrentNotes(cache[currentPage]);
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
    }
    else{
      fetchNotesForPage(currentPage);
    }
    updateCache(currentPage);
  }, [currentPage]);

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
      const { notes, totalNotesCount } = response.data;

      setCurrentNotes(notes);
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

    setCache((prevCache) => ({ ...prevCache, [page]: notes}));

    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const updateCache = async (currentPage: number) => {
    const cacheArray: { [Key: number] : Note[] } = {};
    let startPage;
    let endPage;
    if(currentPage === 1 || currentPage === 2){
      startPage = 1;
      endPage = Math.min(5, numOfPages);
    }
    else if(currentPage === numOfPages){
      startPage = Math.max(1, currentPage-4);
      endPage = numOfPages;
    }
    else if(currentPage === numOfPages-1){
      startPage = Math.max(1, currentPage-3);
      endPage = numOfPages;
    }
    else{
      startPage = (currentPage - 2 > 0) ? (currentPage - 2) : 1;
      endPage = (currentPage + 2 < numOfPages) ? (currentPage + 2) : numOfPages;
    }
    for(let i = startPage; i <= endPage; i++){
      if(cache[i])
        cacheArray[i] = cache[i];
      else{
        try{
          const res = await axios.get(NOTES_URL, {
            params: {
              _page: [i],
              _limit: POSTS_PER_PAGE
            }
          });

          cacheArray[i] = res.data.notes;

        } catch (error) {
          console.error('Error updating cache:', error);
        }
      }
    }
    setCache(cacheArray);
  }

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleEditClick = (index: number, initialContent: string) => {
    setEditNoteIndex(index);
    setEditedContent(initialContent);
  };

  const handleCancelEdit = () => {
    setEditNoteIndex(-1);
    setEditedContent('');
  };

  const handleEditContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(event.target.value);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedNote = {
        content: editedContent
      };

      const indexTotal = (currentPage - 1) * 10 + editNoteIndex
      const response = await axios.put(`${NOTES_URL}/${indexTotal}`, updatedNote, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        const updatedNotes = currentNotes.map((note,index) => {
          if (index === editNoteIndex) {
            return {
              ...note,
              content: response.data.content
            };
          }
          return note;
        });
        setCurrentNotes(updatedNotes);
        setEditNoteIndex(-1);
        setEditedContent('');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteClick = async (index: number) => {
    try {
      const indexTotal = (currentPage - 1) * 10 + index;
      await axios.delete(`${NOTES_URL}/${indexTotal}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotesForPage(currentPage);  
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleAddNote = () => {
    setAddPress(true);
  };

  const handleAddContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddContent(event.target.value);
  };

  const handleCancelAdd = () => {
    setAddPress(false);
    setAddContent('');
  };

  const handleAdd = async () => {
    try {
      const newNote = {
        "number": totalNotes,
        "title": "Note " + totalNotes,
        "author": {
          "name": "",
          "email": ""
        },
        "content": addContent
      };

      const response = await axios.post(`${NOTES_URL}/`, newNote, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAddContent('');
      setAddPress(false);
      fetchNotesForPage(currentPage);

    } catch (error) {
        console.error('Error add note:', error);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const newUser = {
        "name": name,
        "email": email,
        "username": username,
        "password": password,
      };

      const response = await axios.post(`${USERS_URL}`, newUser);

      setName('');
      setEmail('');
      setUsername('');
      setPassword('');

    } catch (error) {
        console.error('Error adding new user:', error);
    }
  };

  const handleUsernameLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginUsername(event.target.value)
  };

  const handlePasswordLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(event.target.value)
  };

  const handleUserLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const loginUser = {
        "username": loginUsername,
        "password": loginPassword,
      };

      const response = await axios.post(`${LOGIN_URL}`, loginUser);
      const token1 = response.data.token;
      const loggedInName = response.data.name;

      setToken(token1);
      setLoggedInUserName(loggedInName);
      setLoginUsername('');
      setLoginPassword('');

    } catch (error) {
        console.error('Error logging in', error);
    }
  };

  const handleLogOut =  () => {
    setToken('');
    setLoggedInUserName('');
  };


  return (
    <div className={darkMode ? "dark" : "light"}>
      <button name='change_theme' onClick={toggleDarkMode}>toggle to {darkMode ? "light" : "dark"}</button>
      {loggedInUserName !== '' ? (
        <button name='add_new_note' onClick={handleAddNote}>Add note</button>
      ) : null}

      {loggedInUserName !== '' ? (
        <button name="logout" onClick={handleLogOut}> Logout </button>
      ) : null}
      <br/>
      <br/>
      
      <div>
        <form className="create_user_form" onSubmit={handleCreateUser}>
        <h3> Create New User </h3>
        <br/>
          <label>
            Name:
            <br/>
            <input type="text" value={name} name="create_user_form_name" onChange={handleNameChange}/>
            <br/>
          </label>
          <br/>
          <label>
            Email:
            <br/>
            <input type="email" value={email} name="create_user_form_email" onChange={handleEmailChange}/>
            <br/>
          </label>
          <br/>
          <label>
            Username:
            <br/>
            <input type="text" value={username} name="create_user_form_username" onChange={handleUsernameChange}/>
            <br/>
          </label>
          <br/>
          <label>
            Password:
            <br/> 
            <input type="text" value={password} name="create_user_form_password" onChange={handlePasswordChange}/>
            <br/>
          </label>
          <br/>
          <button name="create_user_form_create_user"> Create User </button>
        </form>
      </div>

      {loggedInUserName === '' ? (
        <div>
          <form className="login_form" onSubmit={handleUserLogin}>
          <h3> Login </h3>
          <br/>
            <label>
              Username:
              <br/>
              <input type="text" value={loginUsername} name="login_form_username" onChange={handleUsernameLoginChange}/>
              <br/>
            </label>
            <br/>
            <label>
              Password:
              <br/> 
              <input type="text" value={loginPassword} name="login_form_password" onChange={handlePasswordLoginChange}/>
              <br/>
            </label>
            <br/>
            <button name="login_form_login"> Login </button>
          </form>
        </div>
      ) : null}
        
      {addpress ? (
                <div className="add-form">
                  <h3> Add new note </h3>
                  <br/>
                  <label>
                    <textarea name='text_input_new_note' value={addContent} onChange={handleAddContentChange} />
                    <div>
                      <button name='text_input_save_new_note' onClick={handleAdd}>Save</button>
                      <button name='text_input_cancel_new_note' onClick={handleCancelAdd}>Cancel</button>
                    </div>
                  </label>
                </div>) : 
                (
                <>  
                  {null}
                </>
              )}

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
          currentNotes.map((note , index) => (
            <div className='note' key={index} id={`${note.id}`}>
              <h1>{note.title}</h1>
              <p><strong>Author:</strong> {note.author.name} ({note.author.email})</p>
              {editNoteIndex === index ? (
                <div className="edit-form">
                  <textarea name={'text_input-' + note.id} value={editedContent} onChange={handleEditContentChange} />
                  <div>
                    <button name={'text_input_save-' + note.id} onClick={handleSaveEdit}>Save</button>
                    <button name={'text_input_cancel-' + note.id} onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>) : 
                (
                <>
                  <p>{note.content}</p>
                  {note.author.name === loggedInUserName ? (
                    <>
                  <button name={'edit-' + note.id} onClick={() => handleEditClick(index, note.content)}>Edit</button>
                  <button name={'delete-' + note.id} onClick={() => handleDeleteClick(index)}>Delete</button>
                  </>
                  ) : null}
                </>
              )}
            </div>
          ))) : 
          (
          <h1>{null}</h1>
        )}
      </div>
    </div>
  );
}

export default Myapp;