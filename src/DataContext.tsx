import React, { createContext, useState, useEffect } from "react"

export type FileSummary = { passages: string[], name: string }

type Mode = 'filepicker' | 'text';

type defaultType = {
    mode: Mode,
    setMode: React.Dispatch<React.SetStateAction<Mode>>

    files: FileSummary[],
    setFiles: React.Dispatch<React.SetStateAction<FileSummary[]>>

    credits: boolean,
    setCredits: React.Dispatch<React.SetStateAction<boolean>>

    columns: FileSummary[],
    setColumns: React.Dispatch<React.SetStateAction<FileSummary[]>>

    ignorePunctuation: boolean,
    setIgnorePunctuation: React.Dispatch<React.SetStateAction<boolean>>,

    K: number,
    setK: React.Dispatch<React.SetStateAction<number>>,
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { },

    files: [],
    setFiles: () => { },

    credits: false,
    setCredits: () => { },

    columns: [],

    ignorePunctuation: true,
    setIgnorePunctuation: () => { },

    setColumns: () => { },

    K: 10,
    setK: () => { },
}

export const DataContext = createContext(defaultSettings)

function AppContext({ children }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<Mode>(defaultSettings.mode);
    const [files, setFiles] = useState<FileSummary[]>(defaultSettings.files);
    const [credits, setCredits] = useState(defaultSettings.credits);
    const [columns, setColumns] = useState(defaultSettings.columns);
    const [K, setK] = useState(defaultSettings.K);
    const [ignorePunctuation, setIgnorePunctuation] = useState(true);

    useEffect(() => {
        setColumns((prevColumns) => {
            if (prevColumns.length === 0) return files.slice(0, 3);
            return prevColumns;
        })
    }, [files])

    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles,
        credits, setCredits,
        columns, setColumns,
        ignorePunctuation, setIgnorePunctuation,
        K, setK,
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext