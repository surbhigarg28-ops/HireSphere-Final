import {Notification} from '../models/Notification.js';
export const notifyUser=(user,type,text,link)=>Notification.create({user,type,text,link});
