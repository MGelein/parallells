import React, { createContext, useState, useEffect } from "react"
import { getDifferences, UnMatch } from "./util/compare";

export type FileSummary = { file: string, name: string }

type Mode = 'filepicker' | 'text';
type Diff = { text: string, unmatches: UnMatch[] };

type defaultType = {
    mode: Mode,
    setMode: React.Dispatch<React.SetStateAction<Mode>>

    files: FileSummary[],
    setFiles: React.Dispatch<React.SetStateAction<FileSummary[]>>

    credits: boolean,
    setCredits: React.Dispatch<React.SetStateAction<boolean>>

    columns: FileSummary[],
    setColumns: React.Dispatch<React.SetStateAction<FileSummary[]>>

    diffs: Diff[],
    setDiffs: React.Dispatch<React.SetStateAction<Diff[]>>
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { },

    files: [],
    setFiles: () => { },

    credits: false,
    setCredits: () => { },

    columns: [],
    setColumns: () => { },

    diffs: [],
    setDiffs: () => { }
}

export const DataContext = createContext(defaultSettings)

function AppContext({ children }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<Mode>(defaultSettings.mode);
    const [files, setFiles] = useState<FileSummary[]>(defaultSettings.files);
    const [credits, setCredits] = useState(defaultSettings.credits);
    const [columns, setColumns] = useState(defaultSettings.columns);
    const [diffs, setDiffs] = useState(defaultSettings.diffs);

    useEffect(() => {
        setColumns((prevColumns) => {
            if (prevColumns.length === 0) return files.slice(0, 3);
            return prevColumns;
        })
    }, [files])

    useEffect(() => {
        const texts = columns.map(column => column.file);
        const differences = getDifferences(texts);
        setDiffs(texts.map((text, index) => {
            return { text, unmatches: differences[index] }
        }));
    }, [columns]);

    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles,
        credits, setCredits,
        columns, setColumns,
        diffs, setDiffs,
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext