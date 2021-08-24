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
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { },

    files: [],
    setFiles: () => { },

    credits: false,
    setCredits: () => { },
}

export const DataContext = createContext(defaultSettings)

function AppContext({ children }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState<Mode>('filepicker');
    const [files, setFiles] = useState<FileSummary[]>([]);
    const [credits, setCredits] = useState(false);


    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles,
        credits, setCredits
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext