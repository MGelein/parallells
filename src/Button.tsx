import './Button.scss'

function Button({
    label,
    size,
    onClick,
    type = 'primary',
    disabled = false,
}: {
    label: string,
    size: 'small' | 'large',
    onClick: () => void,
    type?: 'primary' | 'secondary' | 'nav',
    disabled?: boolean,
}) {
    const disabledClass = disabled ? 'disabled' : '';
    return <button className={`button ${size} ${type} ${disabledClass}`} onClick={() => onClick()}>{label}</button>
}

export default Button;