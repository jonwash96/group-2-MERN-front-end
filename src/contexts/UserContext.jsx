import { createContext, useState } from "react";

// creates a global context / state we can use
const UserContext = createContext()

const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const parsed = JSON.parse(atob(token.split(".")[1]));
        // Support both legacy payload-wrapped tokens and plain JWT payloads.
        return parsed?.payload ?? parsed ?? null;
    } catch (error) {
        console.error("@UserContext > getUserFromToken()", error);
        localStorage.removeItem("token");
        return null;
    }
}

// set up a provider component to provide or context to its children
function UserProvider({ children }){
    // and children of this component will have access to the 
    // state we define in here through the useContextHook
    const [user, setUser] = useState(getUserFromToken())
    
    return <UserContext.Provider value={{
        user,
        setUser
    }}>
        {children}
    </UserContext.Provider>
}

export { UserProvider, UserContext }
