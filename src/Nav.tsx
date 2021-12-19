import { useContext } from 'react'
import Button from './Button'
import ColumnCounter from './ColumnCounter'
import KSize from './KSize'
import { DataContext } from './DataContext'

import './Nav.scss'

function Nav() {
    const { setCredits, mode, setMode } = useContext(DataContext)
    return (<nav className="nav">
        <h1 className="logo">Para<em>ll</em>e<em>ll</em>s</h1>
        <div className="nav__controls">

            {mode === 'text' && <><KSize /><ColumnCounter /></>}
            {mode === 'text' && <Button label="Files" size="small" type="nav" onClick={() => setMode('filepicker')} />}
            <Button label="How To Cite Us" size="small" type="nav" onClick={() => { setCredits(true) }} />
        </div>
    </nav>)
}

export default Nav