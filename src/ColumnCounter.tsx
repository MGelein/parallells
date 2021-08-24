

import { useContext, useCallback } from 'react';
import Button from './Button';
import { DataContext } from './DataContext';

import './ColumnCounter.scss';

function ColumnCounter() {
    const { columns, setColumns, files } = useContext(DataContext);

    const decrease = useCallback(() => { setColumns((prevColumns) => Math.max(2, prevColumns - 1)) }, [setColumns]);
    const increase = useCallback(() => { setColumns((prevColumns) => Math.min(files.length, prevColumns + 1)) }, [setColumns, files.length]);

    return (<div className="column-counter">
        <label>Columns:&nbsp;</label>
        <Button label="-" size="small" type="nav" onClick={decrease} disabled={columns <= 2} />
        <span className="column-counter__number">{columns}</span>
        <Button label="+" size="small" type="nav" onClick={increase} disabled={columns >= files.length} />
    </div>)
}

export default ColumnCounter;