import { useState, useCallback } from 'react';
import { parseHTML } from './util/markup';
import { FileSummary } from './DataContext';

import './FileUpload.scss'


function FileUpload({
    onUpload,
    onRemove,
    file
}: {
    file: FileSummary
    onUpload: (name: string, passages: string[]) => void;
    onRemove: (name: string) => void;
}) {
    const [fileName, setFileName] = useState(file.name);
    const [uploadDone, setUploadDone] = useState(!!file.name);

    const readFile = useCallback((target: HTMLInputElement) => {
        const fileReader = new FileReader();
        const file = target.files?.[0]
        const nameOfFile = file?.name ?? '';
        const extension = nameOfFile.substr(nameOfFile.lastIndexOf('.')).toLowerCase();

        fileReader.onload = (fileEvent) => {
            const fileData = fileEvent.target?.result;

            const passages = extension === '.html' ? parseHTML(fileData as string) : [fileData as string];


            if (fileData) {
                onUpload(nameOfFile, passages);
                setUploadDone(true);
            }
        }
        if (file && ['.txt', '.html'].includes(extension)) {
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
            <code className="file-upload__file-name">{fileName}</code>
        </>)}
        {!uploadDone && (<>
            <span className="file-upload__instruction">Upload file</span>
            <span className='file-upload__extensions'><code>.txt</code> or <code>.html</code></span>
            <span className="file-upload__icon">+</span>
            <input className="file-upload__input" type='file' accept='.txt, .html' onChange={(e) => readFile(e.target)} />
        </>)}
    </label>)
}

export default FileUpload