import { useState, useCallback, useEffect, useContext } from 'react'
import FileUpload from './FileUpload'
import Button from './Button';
import { DataContext, FileSummary } from './DataContext';

import './FilePicker.scss'

function FilePicker() {
    const { setMode, setFiles: setContextFiles } = useContext(DataContext);
    const getEmptyFile = useCallback(() => { return { file: '', name: '', extension: '' }; }, []);
    const [files, setFiles] = useState<FileSummary[]>([getEmptyFile(), getEmptyFile()]);
    const [exiting, setExiting] = useState(false);
    const [loadedCount, setLoadedCount] = useState(0);
    const getInstruction = useCallback(() => {
        if (loadedCount === 0) return "Upload at least 2 files to get started";
        else if (loadedCount === 1) return "Upload one more file to get started";
        else return "Everything looks great, let's get started!";
    }, [loadedCount]);

    useEffect(() => {
        setLoadedCount(files.reduce((count, value) => {
            return count + ((value.file !== '' || value.name !== '') ? 1 : 0);
        }, 0));
    }, [files]);

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles[index] = getEmptyFile();
        setFiles(newFiles);
    }

    const addFile = (index: number, name: string, extension: string, file: string) => {
        const newFiles = [...files];
        newFiles[index] = { name, file, extension };
        const emptyAvailable = newFiles.some(({ file, name }) => file === '' && name === '');
        setFiles(emptyAvailable ? newFiles : [...newFiles, getEmptyFile()]);
    }

    return (<div className={`file-picker ${exiting ? 'exit' : ''}`}>
        <h1 className="file-picker__header">File picker</h1>
        <span className="file-picker__instruction">{getInstruction()}</span>
        <div className="file-picker__content">
            {files.map((_, index) => {
                return <FileUpload key={index} onUpload={(name, extension, file) => addFile(index, name, extension, file)} onRemove={() => removeFile(index)} />
            })}
        </div>
        <Button label={loadedCount < 2 ? 'Waiting...' : 'Ready!'} size="large" disabled={loadedCount < 2} onClick={() => {
            setExiting(true);
            const loadedFiles = files.filter(({ name, file }) => (name !== '' && file !== ''))
            setContextFiles(loadedFiles);
            setTimeout(() => {
                setMode('text');
            }, 500);
        }} />
    </div>)
}

export default FilePicker