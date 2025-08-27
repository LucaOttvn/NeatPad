import './searchBar.scss';
import { ReactSVG } from 'react-svg';
import { notesToShow } from '@/utils/signals';
import { db } from '@/utils/db';

export default function SearchBar() {

  // check if the note's text or title contain the search string
  const handleSearch = async (input: string) => {
    const localNotes = await db.notes.toArray()
    notesToShow.value = localNotes.filter(note => {
      // find the searched note
      const noteTitleIncludesSearchParam = note.title.toLowerCase().includes(input.toLowerCase())
      const noteTextIncludesSearchParam = note.text.toLowerCase().includes(input.toLowerCase())
      if (!noteTextIncludesSearchParam && !noteTitleIncludesSearchParam) return false
      return note
    })
  }

  return (
    <div className='searchBarContainer'>
      <ReactSVG src={'/icons/search.svg'} />
      <input type="text" placeholder='Search' onChange={(e) => {
        handleSearch(e.target.value)
      }} />
    </div>
  );
}