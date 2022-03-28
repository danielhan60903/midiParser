import React, {useState} from "react";
import { LiveInfoBar } from '../LiveInfoBar/LiveInfoBar';
import { ChordDisplay } from '../ChordDisplay/ChordDisplay';
import './LivePerformanceTool.css'

export const LivePerformanceTool =(props)=>{
    const [genre, setGenre] = useState('Placeholder')
    const [keyLetter, setKeyLetter] = useState('A');
    const [keyQuality, setKeyQuality] = useState('Major');

    return <div className="Container">
        <ChordDisplay className ="ChordContainer" chordName={props.chordName} nextChordName={'Emaj'}></ChordDisplay>
        <LiveInfoBar genre={genre} genreChangeClick={setGenre} keyLetter={keyLetter} keyLetterClick={setKeyLetter} keyQuality={keyQuality} keyQualityClick={setKeyQuality} tempo={props.tempo} timeSig={props.timeSig} key={props.key} randomness={props.randomness}></LiveInfoBar>
    </div>;
}