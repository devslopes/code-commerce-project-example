export const NOTIFY_LOG_USER_IN_OUT = 'notify_log_user_in_out';
export const NOTIFY_UPDATE_CART = 'notify_update_cart';
export const NOTIFY_PUSH_ALERT = 'notify_push_alert';
export const NOTIFY_CAN_SUBMIT = 'notify_can_submit';
export const NOTIFY_CHANGE_SCREEN = 'notify_change_screen';
export const NOTIFY_SET_PROMO_CODE = 'notify_set_promo_code';
export const NOTIFY_USER_MESSAGE = 'notify_user_message';

let instance = null;
let observers = {};

export default class NotificationService {
    constructor() {
        if (!instance) instance = this;
        return instance;
    }

    addObserver = (notifyName, observer, callBack) =>{
        const obs = observers[notifyName];
        if (!obs) observers[notifyName] = [];
        const obj = { observer: observer, callBack: callBack };
        observers[notifyName].push(obj);
    }

    removeObserver = (notifyName, observer) => {
        let obs = observers[notifyName];
        if (!obs) return;
        for (let i = 0; i < obs.length; i++) {
            if (obs[i].observer === observer) {
                obs.splice(i, 1);
                observers[notifyName] = obs;
            };
        };
    }

    dispatch = (notifyName, payload) => {
        const obs = observers[notifyName];
        if (!obs) return;
        for (let i = 0; i < obs.length; i++) {
            obs[i].callBack(payload);
        };
    }
}