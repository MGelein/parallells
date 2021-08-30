import { useContext, useCallback } from 'react';
import { DataContext } from './DataContext';
import TextControls from './TextControls';
import TextRow from './TextRow';

import './Texts.scss';

function Texts() {
    const { files } = useContext(DataContext);
    const getMostPassages = useCallback(() => {
        return (files.reduce((longestSoFar, current) => {
            if (current.passages.length > longestSoFar.passages.length) return current;
            else return longestSoFar;
        }).passages);
    }, [files]);

    return (<div className="texts">
        <div className="texts__controls">
            {files.map((file, index) => {
                return <TextControls key={index} file={file} index={index} />
            })}
        </div>
        {getMostPassages().map((_, index) => {
            return <TextRow index={index} />
        })};
    </div>);
}

export default Texts;