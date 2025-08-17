import { useEffect, useState } from 'react';
import './searchBar.scss';
import { ReactSVG } from 'react-svg';
import { Note } from '@/utils/interfaces';
import { notesToShow, notes } from '@/utils/signals';

export default function SearchBar() {
  const [search, setSearch] = useState('')

  useEffect(() => {
    notesToShow.value = notes.value.filter(note => findSearchedNote(note))
  }, [search]);

  // check if the note's text and title contain the search string
  function findSearchedNote(noteToCompare: Note) {
    const noteTitleIncludesSearchParam = noteToCompare.title.toLowerCase().includes(search.toLowerCase())
    const noteTextIncludesSearchParam = noteToCompare.text.toLowerCase().includes(search.toLowerCase())
    if (!noteTextIncludesSearchParam && !noteTitleIncludesSearchParam) return false
    return noteToCompare
  }

  return (
    <div className='searchBarContainer'>
      <ReactSVG src={'/icons/search.svg'} />
      <input type="text" placeholder='Search' onChange={(e) => {
        setSearch(e.target.value)
      }} />
    </div>
  );
}