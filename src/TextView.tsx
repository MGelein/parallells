import { useCallback, useEffect, useState, useContext } from 'react';
import { DataContext, FileSummary } from './DataContext';

import './TextView.scss';

function TextView({
    file,
    index,
}: {
    file: FileSummary,
    index: number,
}) {
    const [optionsVisible, setOptionsVisible] = useState(false);
    const { columns, files, setColumns } = useContext(DataContext);
    const [currentFile, setCurrentFile] = useState<FileSummary>(file);
    const [filenames, setFilenames] = useState<string[]>(files.map(({ name }) => name));
    const [passages] = useState(file.passages);
    const isVisibleColumn = index < columns.length;
    const visibleClass = isVisibleColumn ? '' : 'hidden';

    const getBannerDescription = useCallback(() => {
        if (index !== 0) return "Showing difference to main";
        else {
            return columns.length === 2 ? 'Showing difference to other' : "Showing unique occurences in main";
        }
    }, [index, columns.length])

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
        <div className="text-view__contents">
            {passages.map((passage, index) => {
                return <div className="text-view__contents__passage" key={index} dangerouslySetInnerHTML={{ __html: passage }}></div>
            })}
        </div>
    </div>)
}

export default TextView;