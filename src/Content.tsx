import { useContext } from 'react';
import DataContext from './DataContext';
import FilePicker from './FilePicker';

import './Content.scss'

function Content() {
    const { mode } = useContext(DataContext);
    return (<div className="content">
        {mode === 'filepicker' && <FilePicker />}
    </div>)
}

export default Content;