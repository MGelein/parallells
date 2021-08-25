import { useCallback, useEffect, useState, useContext } from 'react';
import { DataContext, FileSummary } from './DataContext';
import { breakIntoAlternatingParts } from './util/markup';

import './TextView.scss';

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
    const isVisibleColumn = index < columns.length;
    const visibleClass = isVisibleColumn ? '' : 'hidden';

    const getBannerDescription = useCallback(() => {
        if (index !== 0) return "Showing difference to main";
        else {
            return columns.length === 2 ? 'Showing difference to other' : "Showing unique occurences in main";
        }
    }, [index, columns.length])

    useEffect(() => {
        if (!isVisibleColumn || diffs.length <= index) return;
        const myDiff = diffs[index];
        const parts = breakIntoAlternatingParts(myDiff.text, myDiff.unmatches, myDiff.matches);
        const newMarkupParts = parts.map((part, index) => {
            return index % 2 === 0 ?
                <span key={index} className="text normal">{part}</span> :
                <span key={index} className="text diff">{part}</span>
        });
        setMarkupParts(newMarkupParts);
    }, [diffs, index, isVisibleColumn])

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

    return (<div className={`text-view ${visibleClass} ${index === 0 ? 'main' : ''}`}>
        <div className="text-view__banner">{getBannerDescription()}</div>
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
        {currentFile.extension === '.html' && <div className="text-view__contents" dangerouslySetInnerHTML={{ __html: currentFile.file }}></div>}
        {currentFile.extension === '.txt' && <div className="text-view__contents">{markupParts ?? currentFile.file}</div>}
    </div>)
}

export default TextView;