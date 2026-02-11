import { useState, useEffect, useContext } from 'react'
import './App.css'
import TestSVCs from './utils/testing/testSVCs'
import { UserContext } from "./contexts/UserContext";
import Headbar from './components/Headbar/Headbar.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import * as expenseService from './services/expenseService'
import * as authService from './services/authService'
import * as userService from './services/userService'
import { ImageIcn, errToast } from './utils/gizmos'
import './utils/gizmos/bancroft-proto'

function App() {
  const { user, setUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState();
  const [receipts, setReceipts] = useState();
  const [notifications, setNotifications] = useState();
  const [activity, setActivity] = useState();
  const [uid, setUid] = useState();

  useEffect(() => {
    const signin = async () => {

      const signedInUser = await authService.signIn({
        username: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD
      });
      console.log("@signin", signedInUser);
      setUser(signedInUser);
      setUid(signedInUser._id);
    }; signin();
  }, [])

  if (!user?.username) return <p>Loading. . .</p>;
  return (
    <>
      <Headbar />
      <Dashboard />
    </>
  )
}

export default App



