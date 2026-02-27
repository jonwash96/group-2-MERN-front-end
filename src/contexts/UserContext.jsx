import { createContext, useState, useEffect } from "react";

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

function UserProvider({ children }){
    const [user, setUser] = useState(getUserFromToken())
    
    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}

export { UserProvider, UserContext }
