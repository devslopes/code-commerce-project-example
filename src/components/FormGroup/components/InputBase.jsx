import react from 'react';

const SHOW_ICON = 'fa fa-eye';
const HIDE_ICON = 'fa fa-eye-slash';

export default class InputBase extends react.Component {
    state = { passwordVisible: false };

    getInputType = () => {
        const { type, name } = this.props;
        if (type === 'password') {
            if (name !== 'password') return 'password';
            if (this.state.passwordVisible) return 'text';
        }
        return type;
    }

    togglePasswordVisible = () => this.setState(prevState => ({
        passwordVisible: !prevState.passwordVisible
    }));

    render() {
        const { name, type, required, value, onChange, onBlur, card, error, maxLength } = this.props;
        return (
            <>
            <input
                type={this.getInputType()}
                name={name}
                id={name}
                value={value}
                required={required}
                onChange={onChange}
                onBlur={onBlur}
                className={error && 'error'}
                maxLength={maxLength}
                autoComplete="false"
            />
            {type === 'password' && name === 'password' &&
                <div className="eye-con" onClick={this.togglePasswordVisible}>
                    <i className={this.state.passwordVisible ? HIDE_ICON : SHOW_ICON}
                        title={`${this.state.passwordVisible ? 'Hide' : 'Show'} Password`}
                    />
                </div>
            }
            {name === 'cardNum' && card &&
                <div className="card-img">
                    <img src={card} alt="Card" />
                </div>
            }
            </>
        )
    }
}