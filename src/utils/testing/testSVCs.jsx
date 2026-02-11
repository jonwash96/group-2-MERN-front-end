import { useState, useEffect, useContext } from 'react'
import '../../App.css'
import { UserContext } from "../../contexts/UserContext";
import * as expenseService from '../../services/expenseService'
import * as authService from '../../services/authService'
import * as userService from '../../services/userService'
import { ImageIcn, errToast } from '../gizmos'
import '../gizmos/bancroft-proto'


export default function TestSVCs() {
    const { user, setUser } = useContext(UserContext);
    const [expenses, setExpenses] = useState();
    const [receipts, setReceipts] = useState();
    const [notifications, setNotifications] = useState();
    const [activity, setActivity] = useState();
    const [uid, setUid] = useState();

    useEffect(() => {
        const signin = async () => {
            const signedInUser = await authService.signIn({
                username: 'Skywalker',
                password: 'squid'
            });
            console.log("@signin", signedInUser);
            setUser(signedInUser);
            setUid(signedInUser._id);
        }; signin();
    },[])

    // useEffect(() => {
    //     if (!user?.username) return;
    //     try {
    //         const fetchUser = async () => {
    //             const foundUser = await userService.index(uid);
    //             if (foundUser.err) throw new Error(foundUser.err);
    //             console.log("@TestSVCs > fetchUser:", foundUser);
    //             setUser(foundUser);
    //         }; fetchUser();
            
    //     } catch (err) {console.error(err)};
    // }, [user]);

    const fetchUserItem = async (uid, item, limit=null) => {
        try {
            const foundItem = await userService.getUserItem(uid, item, limit);
            if (foundItem.err) throw new Error(foundItem.err);
            console.log(`@App > fetchUserItem(${foundItem}):`, foundItem);
            return foundItem;
        } catch (err) {console.error(err)};
    };
    
    /*
    useEffect(() => {
        if (!user?.username) return;
        const limit = null;
        const fetchAll = async () => {
            const fetchExpenses = await fetchUserItem(uid, 'expenses', limit);
            setExpenses(fetchExpenses);
            const fetchNotifications = await fetchUserItem(uid, 'notifications', limit);
            setNotifications(fetchNotifications);
            const fetchReceipts = await fetchUserItem(uid, 'receipts', limit);
            setReceipts(fetchReceipts);
            const fetchActivity = await fetchUserItem(uid, 'activity', limit);
            setActivity(fetchActivity);
        }; fetchAll();
    }, [uid]);
    */

    return (
        <main>
            <h1>Services Testing</h1>

            <h2>User</h2>
            <ul>
                <li key="123"><strong>Username: </strong>{user?.username}</li>
                <li key="456"><strong>DisplayName: </strong>{user?.displayName}</li>
                <li key="789"><strong>Photo: </strong>
                <ImageIcn role="profile-photo" src={user?.photo?.url} size="20px" />
                {user?.photo?.title}
                </li>
                <li key="createdAt">{Number(1770733801553)._epochTo('recent')}</li>
            </ul>

            <h2>Expenses</h2>
            <ul>
                {user?.expenses.map(expense =>
                    <li key={expense._id}>
                        <ul>{Object.entries(expense).map(([key,value],idx) => 
                            typeof value !== 'object'
                            ? <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>{value}</li>
                            : <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>~Object~</li>
                        )}</ul>
                    </li>
                )}
            </ul>


            <h2>Notifications</h2>
            <ul>
                {user?.notifications.map(notification =>
                    <li key={notification._id}>
                        <ul>{Object.entries(notification).map(([key,value],idx) => 
                            typeof value !== 'object'
                            ? <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>{value}</li>
                            : <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>~Object~</li>
                        )}</ul>
                    </li>
                )}
            </ul>
            
            <h2>Activity</h2>
            <ul>
                {user?.activity.map(datum =>
                    <li key={datum._id}>
                        <ul>{Object.entries(datum).map(([key,value],idx) =>
                            typeof value !== 'object'
                            ? <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>{value}</li>
                            : <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>~Object~</li>
                        )}</ul>
                    </li>
                )}
            </ul>
            
            <h2>Receipts</h2>
            <ul>
                {user?.receipts.map(receipt =>
                    <li key={receipt._id}>
                        <ul>{Object.entries(receipt).map(([key,value],idx) =>
                            typeof value !== 'object'
                            ? <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>{value}</li>
                            : <li key={`notif-map-${idx}`}><strong>{key._camelToTitle()}: </strong>~Object~</li>
                        )}</ul>
                    </li>
                )}
            </ul>
            
        </main>
    )
}

// getUserItems
    // getUserNotifications
    // getuserReceipts
    // getUserActivity
    // getUserBudgets