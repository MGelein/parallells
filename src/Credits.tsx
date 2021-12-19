import { useEffect, useContext, useState } from 'react';
import { DataContext } from './DataContext';

import './Credits.scss';
import Button from './Button';

type AnimState = 'opening' | 'open' | 'closing';

function Credits() {
    const { setCredits } = useContext(DataContext);
    const [state, setState] = useState<AnimState>('opening');

    useEffect(() => {
        if (state === 'opening') setTimeout(() => setState('open'), 500);
        if (state === 'closing') setTimeout(() => {
            setCredits(false);
        }, 500);
    }, [state, setCredits]);

    return (<div className={`credits ${state}`}>
        <div className="credits__popover">
            <div className="credits__popover__text">
                <h1>How to cite us</h1>
                <p>Parallels grew out of the <a href="https://dh.chinese-empires.eu/zgzy">"Reading The Essentials of Governance Digitally"</a>
                    &nbsp;project, both projects were designed and supervised by Professor Hilde De Weerdt, and coded by Mees Gelein.
                </p>
                <p>To cite the software when you use it in your research or teaching, please use the following bibliographic information: </p>
                <code>Hilde De Weerdt and Mees Gelein. Parallels. 2021, <a href="https://dh.chinese-empires.eu/parallels">https://dh.chinese-empires.eu/parallels</a></code>
                <p>To cite the code:</p>
                <code>Mees Gelein. Parallels. 2021, <a href="https://github.com/MGelein/parallells">https://github.com/MGelein/parallells</a></code>
            </div>
            <div className="credits__popover__button">
                <Button label="Close" size="large" onClick={() => {
                    setState('closing');
                }} />
            </div>
        </div>
    </div>);
}

export default Credits;