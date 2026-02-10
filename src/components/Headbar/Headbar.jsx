import { useState, useEffect } from 'reaact'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
import '/gizmos/bancroft-proto'
import { ImageIcn, errToast } from '/gizmos'
import { toast } from 'react-toastify'
import * as activityService from '../../services/activityService'

export async function Headbar(params) {
    const navigate = useNavigate();
    const [input, setInput] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [selectedNotif, setSelectedNotif] = useState(null);

    const handleChange = (e) => {setInput({ ...input, [e.target.name]:e.target.value })};
    const handleSearch = () => {console.log("@Headbar > handleSearch", input.search)};

    const markAsRead = (notifId) => {
        setNotifications(notifications.map(notif => 
            notif._id===notifId ? notif.status = 'read' : notif));
    };

    return(
        <section id="headbar">
            <div class="left">
                <a href="/">Respie</a>
            </div>

            <div class="center">
                <form action={handleSearch} class="searchbar">
                    <div>🔍</div>
                    <input onChange={handleChange} value={input.search} name="search" type="search" placeholder="Search" />
                </form>
            </div>

            <div class="right">
                {user ? <>
                    <Link to="/dashboard">Dashboard</Link>
                    <div id="create-menu" class="flyout-menu">
                        <button class="type3">➕</button>
                        <ul>
                            <h6>Create</h6>
                            <Link to="/expenses/new"><li>Expense</li></Link>
                        </ul>
                    </div>
            
                    <div id="profile-menu" class="flyout-menu">
                        <span>{user.username}</span>
                        <ImageIcn role="profile-photo" size="small" />
                        <span> ▾</span>
                        <ul>
                            <Link to="/profile"><li>Profile</li></Link>
                            <Link to="/auth/sign-out"><li>Sign Out</li></Link>
                        </ul>
                    </div>

                    <div id="notification-menu" class="flyout-menu">
                        <ImageIcn role="notifications" data={user.notifications.length} />
                        <ul>
                            <NotificationsList 
                                class={notifSelected ? "show-notif" : "show-notif-list"} 
                                props={{user, notifications, setSelectedNotif, markAsRead}} />
                            <ShowNotification 
                                class={notifSelected ? "show-notif" : "show-notif-list"} 
                                props={{selectedNotif, setSelectedNotif}} />
                        </ul>
                    </div>
                </> : <>
                    <div id="nouser-auth">
                        <Link to="/auth/sign-up">Sign Up</Link>
                        <Link to="/auth/sing-in">Sign In</Link>
                    </div>
                </>}
            </div>
        </section>
    )
}

function NotificationsList({user, notifications, setSelectedNotif, markAsRead}) {
    const handleSelect = (notif) => {
        setSelectedNotif(notif._id);
        if (notif.status==='unread') {
            new Promise((resolve,reject) => {
                resolve = () => markAsRead(notif._id);
                reject = (err) =>  errToast(err);
                activityService.update(user._id, notif._id, resolve, reject)
            })
        }
    };
    return(
        <ul>
            <h6>Notifications</h6>
            {notifications.map(notif => 
                <li key={notif._id} onClick={()=>handleSelect(notif._id)}>
                    <header>
                        <h5>{notif.title}</h5>
                        <span>{created_at._epochTo('recent')}</span>
                    </header>
                    <span title={notif.description}>{notif.description._ellipes(120)}</span>
                </li>
            )}
        </ul>
    )
}

function ShowNotification({selectedNotif, setSelectedNotif}) {
    const handleBack = () => setSelectedNotif(null);

    return(
        <section>
            <button onClick={handleBack}>🔙 Back</button>
            <header>
                <h4>{selectedNotif.title}</h4>
                <span>{selectedNotif.created_at}</span>
            </header>
            <p>{selectedNotif.description}</p>
        </section>

    )
}