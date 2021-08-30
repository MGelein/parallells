
import { useContext, useCallback, useState } from 'react';
import { DataContext } from './DataContext';

import './TextRow.scss';

function TextRow({
    index
}: {
    index: number,
}) {
    const { columns } = useContext(DataContext);
    const passages = useCallback(() => columns.map(column => column.passages[index] ?? ''), [columns, index]);

    return (<div className="text-row">
        <div className="text-row__comparison-button"><button>Compare</button></div>
        {passages().map(passage => {
            return <div className="text-row__passage" dangerouslySetInnerHTML={{ __html: passage }}></div>
        })}
    </div>);
}

export default TextRow;