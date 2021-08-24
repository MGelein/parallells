import { useState, useCallback } from 'react';
import './FileUpload.scss'


function FileUpload({
    onUpload,
    onRemove
}: {
    onUpload: (name: string, file: string) => void;
    onRemove: (name: string) => void;
}) {
    const [fileName, setFileName] = useState('');
    const [uploadDone, setUploadDone] = useState(false);

    const readFile = useCallback((target: HTMLInputElement) => {
        const fileReader = new FileReader();
        const file = target.files?.[0]
        const nameOfFile = file?.name ?? '';

        fileReader.onload = (fileEvent) => {
            const fileData = fileEvent.target?.result;
            if (fileData) {
                onUpload(nameOfFile, fileData as string);
                setUploadDone(true);
            }
        }
        if (file) {
            fileReader.readAsText(file);
            setFileName(nameOfFile);
        }
    }, [onUpload]);

    return (<label className={`file-upload ${uploadDone ? 'file-upload--done' : ''}`}>
        {uploadDone && (<>
            <span className="file-upload__file-remove" onClick={(e) => {
                e.preventDefault();
                onRemove(fileName);
                setUploadDone(false);
                setFileName('');
            }}>X</span>
            <span className="file-upload__file-name">{fileName}</span>
        </>)}
        {!uploadDone && (<>
            <span className="file-upload__instruction">Upload file</span>
            <span className="file-upload__icon">+</span>
            <input className="file-upload__input" type='file' onChange={(e) => readFile(e.target)} />
        </>)}
    </label>)
}

export default FileUpload