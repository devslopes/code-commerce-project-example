import react from 'react';
import CheckoutScreen from './components/CheckoutScreen/CheckoutScreen';
import LoginModal from './components/LoginModal/LoginModal';
import DataService from './services/data-service';
import NotificationService, { NOTIFY_LOG_USER_IN_OUT, NOTIFY_USER_MESSAGE } from './services/notification-service';
import './styles/root.scss';

let ds = new DataService();
let ns = new NotificationService();

const INIT_STATE = { showModal: true, showInfoBar: true, currentUser: null }; 

export default class App extends react.Component {
    state = {...INIT_STATE};

    componentDidMount() {
        ns.addObserver(NOTIFY_LOG_USER_IN_OUT, this, this.setCurrentUser);
        ns.addObserver(NOTIFY_USER_MESSAGE, this, this.toggleInfoBar);
    };

    componentWillUnmount() {
        ns.removeObserver(NOTIFY_LOG_USER_IN_OUT, this);
        ns.removeObserver(NOTIFY_USER_MESSAGE, this);
    };

    setCurrentUser = user => {
        this.setState({ currentUser: user });
        this.toggleModal();
    }

    toggleModal = () => this.setState(prevState => ({ showModal: !prevState.showModal }));

    handleClickUserLink = e => {
        e.preventDefault();
        ds.logUserOut();
    }

    toggleInfoBar = value => this.setState({showInfoBar: value});

    render() {
        const { currentUser, showModal, showInfoBar } = this.state;
        return (
            <div className="page-wrapper">
                <div className="content-wrapper">
                    {currentUser && showInfoBar &&
                        <div className="user-info-bar">
                            <p><strong>SAVE 5% NOW!</strong> Use Promo Code '5OFF' to save 5% off your order!</p>
                        </div>
                    }
                    <div className="top-bar">
                        <div className="container">
                            {
                                !currentUser
                                    ? <p>Howdy! Please <a href="/" onClick={this.handleClickUserLink}>Log In or Sign Up</a>!</p>
                                    : <p>Hi, {currentUser.f_name}! <a href="/" onClick={this.handleClickUserLink}>Log Out</a></p>
                            }
                            
                        </div>
                    </div>
                    <header className="page-header">
                        <div className="container">
                            <h1>Code<span>Commerce</span></h1>
                        </div>
                    </header>
                    <main className="container">
                        {
                            !currentUser
                                ? <p>Please <a href="/" onClick={this.handleClickUserLink}>Log In or Sign Up</a> to continue.</p>
                                : <CheckoutScreen currentUser={currentUser} />
                        }
                    </main>
                </div>
                <footer className="page-footer">
                    <p>&copy;{new Date().getFullYear()} CodeCommerce</p>
                </footer>
                {showModal && <LoginModal closeModal={this.toggleModal} />}
            </div>
        )
    }
}
