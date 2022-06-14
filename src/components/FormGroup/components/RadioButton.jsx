import react from 'react';

export default class RadioButton extends react.Component {
    render() {
        const { name, label, value, checked, description, onChange } = this.props;
        return (
            <div className="form-group">
                <div className="radio-input">
                    <input type="radio" name={name} value={value} id={value} checked={checked} onChange={onChange} />
                    <span className="radio" />
                    <label htmlFor={value}>{label}</label>
                    {description && <span className="description">{description}</span>}
                </div>
            </div>
        )
    }
}