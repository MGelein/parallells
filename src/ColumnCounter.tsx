

import { useContext, useCallback } from 'react';
import Button from './Button';
import { DataContext } from './DataContext';

import './ColumnCounter.scss';

function ColumnCounter() {
    const { columns, setColumns, files } = useContext(DataContext);

    const decrease = useCallback(() => {
        setColumns((prevColumns) => {
            if (prevColumns.length <= 2) return prevColumns;
            return prevColumns.slice(0, prevColumns.length - 1);
        });
    }, [setColumns]);

    const increase = useCallback(() => {
        setColumns((prevColumns) => {
            if (prevColumns.length >= files.length) return prevColumns;
            return [...prevColumns, files[prevColumns.length]];
        });
    }, [setColumns, files]);

    return (<div className="column-counter">
        <label>Columns:&nbsp;</label>
        <Button label="-" size="small" type="nav" onClick={decrease} disabled={columns.length <= 2} />
        <span className="column-counter__number">{columns.length}</span>
        <Button label="+" size="small" type="nav" onClick={increase} disabled={columns.length >= files.length} />
    </div>)
}

export default ColumnCounter;