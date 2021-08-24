import { createContext } from "react"

type defaultType = {
    mode: string,
    setMode: React.Dispatch<React.SetStateAction<string>>
}

const defaultSettings: defaultType = {
    mode: 'filepicker',
    setMode: () => { }
}

const DataContext = createContext(defaultSettings)

export default DataContext