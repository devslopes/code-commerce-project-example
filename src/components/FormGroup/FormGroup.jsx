import react from 'react';
import InputBase from './components/InputBase';
import RadioButton from './components/RadioButton';
import SelectInput from './components/SelectInput';
import './FormGroup.scss';

export default class FormGroup extends react.Component {
    render() {
        const { name, type, label, error } = this.props;
        if (type === 'radio') return <RadioButton {...this.props} />;
        return (
            <div className="form-group">
                {label && <label htmlFor={name}>{label}</label>}
                <div className="form-control">
                    {error && <span className="error-message">{error}</span>}
                    {
                        type === 'select'
                            ? <SelectInput {...this.props} />
                            : <InputBase {...this.props} />
                    }
                </div>
            </div>
        )
    }
}