import { useState, useEffect, useContext } from 'react'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
import '../../utils/gizmos/bancroft-proto'
import { ImageIcn, errToast } from '../../utils/gizmos'
import { toast } from 'react-toastify'
import { UserContext } from "../../contexts/UserContext";
import './Headbar.css'
import '../../utils/gizmos/bancroft-proto'

export default function Headbar() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [input, setInput] = useState({});
    const [selectedNotif, setSelectedNotif] = useState(null);

    const handleChange = (e) => {setInput({ ...input, [e.target.name]:e.target.value })};
    const handleSearch = () => {console.log("@Headbar > handleSearch", input.search)};

    const markAsRead = (notifId) => {
        setUser({...user, notifications: user.notifications.map(notif => 
            notif._id===notifId ? notif.status = 'read' : notif)
        });
    };

const month = 2;

    return(
        <section id="headbar">
            <div className="left">
                <Link to="/dashboard" id="logotype">$pend Sense</Link>
            </div>

            <div className="center">
                <form action={handleSearch} className="searchbar">
                    <ImageIcn content="🔍" size=".6em" />
                    <input onChange={handleChange} value={input.search} name="search" type="search" placeholder="Search" />
                </form>
            </div>

            <div className="right">
                {user ? <>
                    <div id="dashboard-date-menu" className="flyout-menu">
                        <label htmlFor="calendar-toggle">📆</label>
                        <input type="checkbox" id="calendar-toggle" />
                        <ul style={{ padding: "0 12px", gap: 12, alignItems: "center" }}>
                            <h6 style={{ margin: 0 }}>View Month</h6>
                            <li><input id="set-dashboard-date" type="month" value={month} onChange={(e) => setMonth(e.target.value)} /></li>
                        </ul>
                    </div>
                    <div id="create-menu" className="flyout-menu">
                        <button className="type3">➕</button>
                        <ul>
                            <h6>Create</h6>
                            <li><Link to="/expenses/new">Expense</Link></li>
                            <li><Link to="/budgets">Budget</Link></li>
                        </ul>
                    </div>
            
                    <div id="profile-menu" className="flyout-menu">
                        <Link to="/profile">{user.username}</Link>
                        <ImageIcn role="profile-photo" size="small" />
                        <span> ▾</span>
                        <ul>
                            <li><Link to="/profile">Profile</Link></li>
                            <li><Link to="/expenses">Expenses</Link></li>
                            <li><Link to="/budgets">Budgets</Link></li>
                            <li><Link to="/auth/sign-out">Sign Out</Link></li>
                        </ul>
                    </div>

                    <div id="notification-menu" className="flyout-menu">
                        <ImageIcn role="notifications" data={user.notifications?.length} size="25px" />
                        <ul> {/* ⏬ Done this way so that they can transition between show/hide */}
                            <NotificationsList 
                                className={selectedNotif ? "show-notif" : "show-notif-list"} 
                                props={{user, setSelectedNotif, markAsRead}} />
                            <ShowNotification 
                                className={selectedNotif ? "show-notif" : "show-notif-list"} 
                                props={{selectedNotif, setSelectedNotif}} />
                        </ul>
                    </div>
                </> : <>
                    <div id="nouser-auth">
                        <Link to="/auth/sign-up">Sign Up</Link>
                        <Link to="/auth/sign-in">Sign In</Link>
                    </div>
                </>}
            </div>
        </section>
    )
}

function NotificationsList({props}) {
    const {user, setSelectedNotif, markAsRead} = props;
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
            {(user.notifications || []).map(notif => 
                <li key={notif._id} onClick={()=>handleSelect(notif._id)}>
                    <header>
                        <h5>{notif.title}</h5>
                        <span>{notif.created_at?._epochTo('recent')}</span>
                    </header>
                    <span title={notif.description || ""}>{(notif.description || "")._ellipses(120)}</span>
                </li>
            )}
        </ul>
    )
}

function ShowNotification({props}) {
    const {selectedNotif, setSelectedNotif} = props;
    if (!selectedNotif) return;
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
