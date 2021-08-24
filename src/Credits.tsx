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
                <p>This project was supervised by Dr. Hilde de Weerdt, and coded by Mees Gelein for Leiden University.</p>
                <p>This tool is part of the <a href="https://dh.chinese-empires.eu/markus/beta/">MARKUS</a> suite of tools, which also
                    contains <a href="https://dh.chinese-empires.eu/zgzy">ZGZY</a> and <a href="https://dh.chinese-empires.eu/comparativus/">Comparativus</a></p>
                <p>To cite us, please use the following bibliographic information:</p>
                <code>[ENTER INFORMATION]</code>
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