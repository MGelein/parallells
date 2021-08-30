
import { useEffect } from 'react';
import { useContext, useCallback, useState } from 'react';
import { DataContext } from './DataContext';
import { getDifferences } from './util/compare';
import { breakIntoAlternatingParts, partsToHTML } from './util/markup';

import './TextRow.scss';

function TextRow({
    index
}: {
    index: number,
}) {
    const { columns, K } = useContext(DataContext);
    const passages = useCallback(() => columns.map(column => column.passages[index] ?? ''), [columns, index]);
    const [compared, setCompared] = useState(false);
    const [contents, setContents] = useState<string[] | null>(null);

    useEffect(() => {
        const rowElement = document.querySelector(`#row-${index}`);
        if (!rowElement) return;
        const rowPassages = Array.from(rowElement.querySelectorAll('.text-row__passage'));
        const passageTexts = rowPassages.map(rowPassage => rowPassage.textContent ?? '');

        if (compared) {
            const { unmatchedTexts: unmatches } = getDifferences(passageTexts, K);
            const htmlSections: string[] = [];
            unmatches.forEach((textUnmatches, index) => {
                const parts = breakIntoAlternatingParts(passageTexts[index], textUnmatches);
                htmlSections.push(partsToHTML(parts));
            });
            setContents(htmlSections);
        } else {
            setContents(passageTexts);
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
            const content = contents?.[passageIndex] ?? passage;
            return <div
                key={passageIndex}
                className="text-row__passage"
                dangerouslySetInnerHTML={{ __html: content }}>
            </div>
        })}
    </div>);
}

export default TextRow;