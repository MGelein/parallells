
import { useContext } from 'react';
import { DataContext } from './DataContext';

import './TextRow.scss';

function TextRow({
    index
}: {
    index: number,
}) {
    const { columns } = useContext(DataContext);
    const passages = columns.map(column => column.passages[index] ?? '');

    return (<div className="text-row">
        {passages.map(passage => {
            return <div className="text-row__passage" dangerouslySetInnerHTML={{ __html: passage }}></div>
        })}
    </div>);
}

export default TextRow;