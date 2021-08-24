import { useContext } from 'react';
import { DataContext } from './DataContext';
import TextView from './TextView';

import './Texts.scss';

function Texts() {
    const { files } = useContext(DataContext);

    return (<div className="texts">
        {files.map((file, index) => {
            return <TextView key={index} file={file} index={index} />
        })}
    </div>);
}

export default Texts;