import { useContext } from 'react';
import { DataContext } from './DataContext';
import FilePicker from './FilePicker';
import Texts from './Texts';

import './Content.scss'

function Content() {
    const { mode } = useContext(DataContext);
    console.log(mode);
    return (<div className="content">
        {mode === 'filepicker' && <FilePicker />}
        {mode === 'text' && <Texts />}
    </div>)
}

export default Content;