import React, { createContext, useState } from "react"

export type FileSummary = { file: string, name: string }

type Mode = 'filepicker' | 'text';

type defaultType = {
    mode: Mode,
    setMode: React.Dispatch<React.SetStateAction<Mode>>

    files: FileSummary[],
    setFiles: React.Dispatch<React.SetStateAction<FileSummary[]>>

    credits: boolean,
    setCredits: React.Dispatch<React.SetStateAction<boolean>>

    columns: number,
    setColumns: React.Dispatch<React.SetStateAction<number>>
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { },

    files: [],
    setFiles: () => { },

    credits: false,
    setCredits: () => { },

    columns: 3,
    setColumns: () => { },
}

export const DataContext = createContext(defaultSettings)

function AppContext({ children }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<Mode>(defaultSettings.mode);
    const [files, setFiles] = useState<FileSummary[]>(defaultSettings.files);
    const [credits, setCredits] = useState(defaultSettings.credits);
    const [columns, setColumns] = useState(defaultSettings.columns);


    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles,
        credits, setCredits,
        columns, setColumns,
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext