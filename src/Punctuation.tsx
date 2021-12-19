import { useContext } from "react";
import Button from "./Button";
import { DataContext } from "./DataContext";

function Punctuation() {
    const { ignorePunctuation, setIgnorePunctuation } = useContext(DataContext);

    return <Button
        label={`Ignore Punctuation: ${ignorePunctuation ? 'on' : 'off'}`}
        type="nav"
        size="small"
        onClick={() => setIgnorePunctuation(prev => !prev)}
    />
}

export default Punctuation;