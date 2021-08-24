import { useContext } from 'react'
import Button from './Button'
import { DataContext } from './DataContext'

import './Nav.scss'

function Nav() {
    const { setCredits } = useContext(DataContext)
    return (<nav className="nav">
        <h1 className="logo">Para<em>ll</em>e<em>ll</em>s</h1>
        <div className="nav__controls">
            <Button label="How To Cite Us" size="small" type="nav" onClick={() => { setCredits(true) }} />
        </div>
    </nav>)
}

export default Nav