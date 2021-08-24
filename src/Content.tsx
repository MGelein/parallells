import { useContext } from 'react';
import { DataContext } from './DataContext';
import FilePicker from './FilePicker';
import Texts from './Texts';

import './Content.scss'
import Credits from './Credits';

function Content() {
    const { mode, credits } = useContext(DataContext);
    console.log(mode);
    return (<div className="content">
        {mode === 'filepicker' && <FilePicker />}
        {mode === 'text' && <Texts />}
        {credits && <Credits />}
    </div>)
}

export default Content;