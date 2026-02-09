import { useState, useEffect } from 'react'
import '../../App.css'
import * as expenseService from '../../services/expenseService'
import * as authService from '../../services/authService'
import * as userService from '../../services/userService'

export default function testSVCs() {
    const [user, setUser] = useState();
    const [expenses, setExpenses] = useState();
    const [receipts, setReceipts] = useState();
    const [notifications, setNotifications] = useState();
    const [activity, setActivity] = useState();
    const [uid, setUid] = useState();

    useEffect(() => {
        try {
            const fetchUser = async (uid) => {
                const user = await userService.index(uid);
                if (user.err) throw new Error(user.err);
                console.log("@App > fetchUser:", user);
                setUser(user);
            }; fetchUser();
            
        } catch (err) {console.error(err)};
    }, []);

    const fetchUserItem = async (uid, item, limit=null) => {
        try {
            const item = await userService.getUserItem(uid, item, limit);
            if (item.err) throw new Error(item.err);
            console.log(`@App > fetchUserItem(${item}):`, item);
            return item;
        } catch (err) {console.error(err)};
    };
    
    useEffect(() => {
        const limit = null;
        const fetchAll = async () =>{
            const fetchExpenses = await fetchUserItem(uid, 'expenses', limit);
            setExpenses(fetchExpenses);
            const fetchNotifications = await fetchUserItem(uid, 'notifications', limit);
            setNotifications(fetchNotifications);
            const fetchReceipts = await fetchUserItem(uid, 'receipts', limit);
            setReceipts(fetchReceipts);
            const fetchActivity = await fetchUserItem(uid, 'activity', limit);
            setActivity(fetchActivity);
        }; fetchAll();
    }, [user]);

    return (
        <main>
            <h1>Services Testing</h1>

            <h2>User</h2>
            <ul>
            {Object.entries(user).map(([key,value],idx) =>
                <li key={`user-map-${idx}`}><strong>{key}: </strong>{value}</li>
            )}
            </ul>

            <h2>Expenses</h2>
            <ul>
                {expenses.map(expense => 
                    <li key="expense._id">
                        <h3>{expense.name}</h3>
                        <span><strong>Category: </strong>{expense.category}</span>
                        <span><strong>description: </strong>{expense.description}</span>
                        <span><strong>amount: </strong>{expense.amount}</span>
                        <span><strong>payment Method: </strong>{expense.paymentMethod}</span>
                        <span><strong>receipt: </strong><WebLink data={expense.receipt} /></span>
                        <span><strong>merchant: </strong><Merchant data={expense.merchant} /></span>
                        <span><strong>credits: </strong>{expense.credits}</span>
                        <span><strong>notes: </strong><ul>{expense.notes.map(note => <li>{note}</li>)}</ul></span>
                        <span><strong>webLinks: </strong><WebLink data={expense.webLinks} /></span>
                        <span><strong>status: </strong>{expense.status}</span>
                        <span><strong>owener: </strong>{expense.owner}</span>
                        <span><strong>created At: </strong>{expense.created_At}</span>
                        <span><strong>updated At: </strong>{expense.updated_At}</span>
                    </li>
                )}
            </ul>


            <h2>Notifications</h2>
            <ul>
                {notifications.map(notification =>
                    <li>
                        <ul>{Object.entries(notification).map(([key,value],idx) =>
                            <li key={`notif-map-${idx}`}><strong>{key}</strong>{value}</li>
                        )}</ul>
                    </li>
                )}
            </ul>
            
            <h2>Activity</h2>
            <ul>
                {activity.map(datum =>
                    <li>
                        <ul>{Object.entries(datum).map(([key,value],idx) =>
                            <li key={`notif-map-${idx}`}><strong>{key}</strong>{value}</li>
                        )}</ul>
                    </li>
                )}
            </ul>
            
            <h2>Receipts</h2>
            <ul>
                {receipts.map(receipt =>
                    <li>
                        <ul>{Object.entries(receipt).map(([key,value],idx) =>
                            <li key={`notif-map-${idx}`}><strong>{key}</strong>{value}</li>
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