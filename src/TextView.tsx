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
    const { columns, files } = useContext(DataContext);
    const [currentFile, setCurrentFile] = useState<FileSummary>(file);
    const [filenames, setFilenames] = useState<string[]>(files.map(({ name }) => name));
    const visibleClass = index < columns ? '' : 'hidden';
    const loadFile = useCallback((name: string) => {
        const file = files.reduce((found, value) => {
            if (value.name === name) return value;
            return found;
        })
        setCurrentFile(file);
        setOptionsVisible(false);
    }, [setCurrentFile, files]);

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
            {currentFile.file}
        </div>
    </div>)
}

export default TextView;