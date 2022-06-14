import NotificationService, {
    NOTIFY_CAN_SUBMIT,
    NOTIFY_LOG_USER_IN_OUT,
    NOTIFY_PUSH_ALERT,
    NOTIFY_UPDATE_CART
} from "./notification-service";
import AppData from '../data/app-data';

let { Cart, Users } = AppData;

const GEO_API = 'https://zip.getziptastic.com/v2/us/';

let ns = new NotificationService();
let instance = null;

export default class DataService {
    constructor() {
        if (!instance) instance = this;
        return instance;
    }

    logUserIn = credentials => {
        const { email, password } = credentials;
        const foundUser = Users.find(user => user.email === email);
        if (!foundUser || foundUser.password !== password) return {
            success: false, message: 'Invalid E-Mail or Password. Please try again.'
        };
        ns.dispatch(NOTIFY_LOG_USER_IN_OUT, foundUser);
        return { success: true };
    }

    createNewUser = data => {
        const { email, password, f_name, l_name, zip } = data;
        const foundUser = Users.find(user => user.email === email);
        if (foundUser) return {
            success: false, message: 'Email is already registered.'
        };
        const uuid = Math.floor(Math.random() * Date.now() * Math.random());
        const newUser = { id: uuid, email, password, f_name, l_name, zip };
        Users.push(newUser);
        this.logUserIn(data);
        return { success: true };
    }

    logUserOut = () => ns.dispatch(NOTIFY_LOG_USER_IN_OUT, null);


    updateCartitem = (id, qty) => {
        const itemIndex = Cart.findIndex(item => item.id === id);
        Cart[itemIndex].qty = qty;
        Cart[itemIndex].total = Cart[itemIndex].price * qty;
        ns.dispatch(NOTIFY_UPDATE_CART, Cart);
    }

    removeCartItem = id => {
        const itemIndex = Cart.findIndex(item => item.id === id);
        Cart.splice(itemIndex, 1);
        ns.dispatch(NOTIFY_UPDATE_CART, Cart);
        this.sendPushAlert('Item successfully removed from Cart.');
        if (!Cart.length) ns.dispatch(NOTIFY_CAN_SUBMIT, false)
    }

    getZipLocation = async zip => {
        try {
            const res = await fetch(GEO_API + zip);
            if(!res.ok) return { error: 'Invalid Zip' };
            const location = await res.json();
            const data = { city: location.city, state: location.state_short };
            return data;
        } catch (error) {
            console.error(error);
            return { error: error };
        }
    }

    sendPushAlert = alert => ns.dispatch(NOTIFY_PUSH_ALERT, alert);
}