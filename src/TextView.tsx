import { useCallback, useEffect, useState, useContext } from 'react';
import { DataContext, FileSummary } from './DataContext';

import './TextView.scss';
import { breakIntoAlternatingParts } from './util/markup';

function TextView({
    file,
    index,
}: {
    file: FileSummary,
    index: number,
}) {
    const [markupParts, setMarkupParts] = useState<JSX.Element[] | null>(null);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const { columns, files, setColumns, diffs } = useContext(DataContext);
    const [currentFile, setCurrentFile] = useState<FileSummary>(file);
    const [filenames, setFilenames] = useState<string[]>(files.map(({ name }) => name));
    const visibleClass = index < columns.length ? '' : 'hidden';

    useEffect(() => {
        const myDiff = diffs[index];
        const parts = breakIntoAlternatingParts(myDiff.text, myDiff.unmatches);
        const newMarkupParts = parts.map((part, index) => {
            return index % 2 === 0 ?
                <span key={index} className="text normal">{part}</span> :
                <span key={index} className="text diff">{part}</span>
        });
        setMarkupParts(newMarkupParts);
    }, [diffs, index])

    const loadFile = useCallback((name: string) => {
        const file = files.reduce((found, value) => value.name === name ? value : found);
        setCurrentFile(file);
        setOptionsVisible(false);
        setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            newColumns[index] = file;
            return newColumns;
        });
    }, [setCurrentFile, files, setColumns, index]);

    useEffect(() => setFilenames(files.map(({ name }) => name)), [files, setFilenames]);

    return (<div className={`text-view ${visibleClass}`}>
        <div className="text-view__header-wrap">
            <div className="text-view__header" onClick={() => setOptionsVisible((prev) => !prev)}>
                <h4 className="text-view__header-title">{currentFile.name}</h4>
                <span className="text-view__header-label">Change</span>
            </div>
            <div className={`text-view__header__names ${optionsVisible ? 'visible' : 'hidden'}`}>
                {filenames.filter(name => name !== currentFile.name).map((name, index) => {
                    return <div key={index} className="text-view__header__names__name" onClick={() => loadFile(name)}>{name}</div>
                })}
            </div>
        </div>
        <div className="text-view__contents">
            {markupParts ?? currentFile.file}
        </div>
    </div>)
}

export default TextView;