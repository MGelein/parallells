import { useContext, useCallback } from 'react';
import Button from './Button';
import { DataContext } from './DataContext';
import './KSize.scss';

function KSize() {
    const { K, setK } = useContext(DataContext);

    const increase = useCallback(() => setK((prevK) => prevK + 1), [setK]);
    const decrease = useCallback(() => setK((prevK) => Math.max(3, prevK - 1)), [setK]);

    return (<div className="k-size">
        <label>Minimum Match Size:&nbsp;</label>
        <Button label="-" size="small" type="nav" onClick={decrease} disabled={K <= 3} />
        <span className="column-counter__number">{K}</span>
        <Button label="+" size="small" type="nav" onClick={increase} disabled={K >= 50} />
    </div>)
}

export default KSize;