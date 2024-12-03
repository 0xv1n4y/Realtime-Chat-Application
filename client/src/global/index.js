import axios from "axios";
import { urls } from "./utils";

axios.defaults.withCredentials = true;

export const GLOBALS = {
    api_login : urls.apiHost + '/api/v1/login', // POST (for logging in)
    api_newuser : urls.apiHost + '/api/v1/newuser/add',  // POST (for creating a new user)
    api_fetchtoken: urls.apiHost + '/api/v1/details',
    api_logout: urls.apiHost + '/api/v1/logout',
    api_usersemedia : urls.apiHost + '/media/users/',
    api_getusers : urls.apiHost + '/api/v1/users',
    api_createchat : urls.apiHost + '/api/v1/chat',
    api_fecthchats : urls.apiHost + '/api/v1/chats',
    api_fetchmessages : urls.apiHost + '/api/v1/messages',
    api_sendnewmessage : urls.apiHost + '/api/v1/messages/new',
    api_creategroup : urls.apiHost + '/api/v1/group/new',
    api_leavegroup : urls.apiHost + '/api/v1/group',
    api_updategroupname: urls.apiHost + '/api/v1/groups/',   // PUT (for updating group name)
    api_addmembers: urls.apiHost + '/api/v1/groups/', // POST (for adding members to a group)
    api_removemembers: urls.apiHost + '/api/v1/groups/',  // POST or PUT (for leaving a group)
}


