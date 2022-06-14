import react from 'react';

export default class SelectInput extends react.Component {
    render() {
        const { name, options, required, value, onChange, onBlur, error } = this.props;
        return (
            <select name={name} id={name} value={value} className={error && 'error'} required={required} onChange={onChange} onBlur={onBlur} >
                {options && options.map(option => {
                    return <option key={option} value={option}>{option}</option>
                })}
            </select>
        )
    }
}