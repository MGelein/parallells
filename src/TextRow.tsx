
import { useEffect } from 'react';
import { useContext, useCallback, useState } from 'react';
import { DataContext } from './DataContext';
import { getDifferences } from './util/compare';
import { breakIntoAlternatingParts } from './util/markup';

import './TextRow.scss';

function TextRow({
    index
}: {
    index: number,
}) {
    const { columns, K } = useContext(DataContext);
    const passages = useCallback(() => columns.map(column => column.passages[index] ?? ''), [columns, index]);
    const [compared, setCompared] = useState(false);

    useEffect(() => {
        if (compared) {
            const { unmatchedTexts: unmatches } = getDifferences(passages(), K);
            unmatches.forEach((textUnmatches, index) => {
                const text = passages()[index];
                const parts = breakIntoAlternatingParts(text, textUnmatches);
                console.log(parts);
            });

        }
    }, [compared, passages, K]);

    return (<div className={`text-row ${compared ? 'compared' : ''}`}>
        <div className="text-row__comparison-button">
            <button onClick={() => setCompared((prevCompared) => !prevCompared)}>
                <span>{compared ? 'Remove' : 'Compare'}</span>
                <span className="icon">{compared ? 'x' : '+'}</span>
            </button>
        </div>
        {passages().map((passage, index) => {
            return <div key={index} className="text-row__passage" dangerouslySetInnerHTML={{ __html: passage }}></div>
        })}
    </div>);
}

export default TextRow;