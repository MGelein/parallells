import React, { createContext, useState, useEffect } from "react"
import { getDifferences, UnMatch, Match } from "./util/compare";

export type FileSummary = { file: string, name: string }

type Mode = 'filepicker' | 'text';
type Diff = { text: string, unmatches: UnMatch[], matches: Match[] };

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
    setDiffs: React.Dispatch<React.SetStateAction<Diff[]>>,

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
    setColumns: () => { },

    diffs: [],
    setDiffs: () => { },

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
    const [diffs, setDiffs] = useState(defaultSettings.diffs);
    const [K, setK] = useState(defaultSettings.K);

    useEffect(() => {
        setColumns((prevColumns) => {
            if (prevColumns.length === 0) return files.slice(0, 3);
            return prevColumns;
        })
    }, [files])

    useEffect(() => {
        const texts = columns.map(column => column.file);
        const differences = getDifferences(texts, K);
        const { unmatchedTexts, matches } = differences;
        setDiffs(texts.map((text, index) => {
            return { text, unmatches: unmatchedTexts[index], matches }
        }));
    }, [columns, K]);

    return (<DataContext.Provider value={{
        mode, setMode,
        files, setFiles,
        credits, setCredits,
        columns, setColumns,
        diffs, setDiffs,
        K, setK,
    }}>
        {children}
    </DataContext.Provider>)
}

export default AppContext