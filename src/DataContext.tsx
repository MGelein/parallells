import React, { createContext, useState } from "react"

export type FileSummary = { file: string, name: string }

type defaultType = {
    mode: string,
    setMode: React.Dispatch<React.SetStateAction<string>>

    files: FileSummary[],
    setFiles: React.Dispatch<React.SetStateAction<FileSummary[]>>
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { },

    files: [],
    setFiles: () => { },
}

export const DataContext = createContext(defaultSettings)

function AppContext({ children }: {
    children: React.ReactNode
}) {
    const [mode, setMode] = useState('filepicker');
    const [files, setFiles] = useState<FileSummary[]>([]);


    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext