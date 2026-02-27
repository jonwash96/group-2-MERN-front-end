import { createContext, useState, useEffect } from "react";
import * as userService from '../services/userService';
import { errToast } from '../utils/gizmos/index'

const UserContext = createContext()

const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const parsed = JSON.parse(atob(token.split(".")[1]));
        return parsed?.payload ?? parsed ?? null;
    } catch (error) {
        localStorage.removeItem("token");
        return null;
    }
}

const getUser = () => JSON.parse(sessionStorage.getItem('userData'));

function UserProvider({ children }){
    const [user, setUser] = useState(getUser())
    const [authToken, setAuthToken] = useState(getUserFromToken())
    
    return <UserContext.Provider value={{ user, setUser, authToken, setAuthToken }}>
        {children}
    </UserContext.Provider>
}

const JITAuth = getUserFromToken;
export { UserProvider, UserContext, JITAuth }
