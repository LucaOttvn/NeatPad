import './searchBar.scss';
import { ReactSVG } from 'react-svg';

interface SearchBarProps { }

export default function SearchBar(props: SearchBarProps) {
  return (
    <div className='searchBarContainer'>
      <ReactSVG src={'/icons/search.svg'} />
      <input type="text" placeholder='Search note' />
    </div>
  );
}