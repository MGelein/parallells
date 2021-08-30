
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
            const rowElement = document.querySelector(`#row-${index}`);
            if (!rowElement) return;
            const rowPassages = Array.from(rowElement.querySelectorAll('.text-row__passage'));
            const passageTexts = rowPassages.map(rowPassage => rowPassage.textContent ?? '');
            const { unmatchedTexts: unmatches } = getDifferences(passageTexts, K);
            unmatches.forEach((textUnmatches, index) => {
                const parts = breakIntoAlternatingParts(passageTexts[index], textUnmatches);
                console.log(parts);
            });

        }
    }, [compared, passages, K, index]);

    return (<div id={`row-${index}`} className={`text-row ${compared ? 'compared' : ''}`}>
        <div className="text-row__comparison-button">
            <button onClick={() => setCompared((prevCompared) => !prevCompared)}>
                <span>{compared ? 'Remove' : 'Compare'}</span>
                <span className="icon">{compared ? 'x' : '+'}</span>
            </button>
        </div>
        {passages().map((passage, passageIndex) => {
            return <div
                key={passageIndex}
                className="text-row__passage"
                dangerouslySetInnerHTML={{ __html: passage }}>
            </div>
        })}
    </div>);
}

export default TextRow;