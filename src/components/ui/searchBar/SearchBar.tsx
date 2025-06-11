import { Dispatch, SetStateAction } from 'react';
import './searchBar.scss';
import { ReactSVG } from 'react-svg';

interface SearchBarProps {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <div className='searchBarContainer'>
      <ReactSVG src={'/icons/search.svg'} />
      <input type="text" placeholder='Search note' onChange={(e)=>{
        props.setSearch(e.target.value)
      }}/>
    </div>
  );
}