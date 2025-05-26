import React from 'react';

interface LoaderProps { }

export default function Loader(props: LoaderProps) {
    return (
        <div className='loader'>
            <img width={100} src="/gifs/spinner.gif" alt="" />
        </div>
    );
}