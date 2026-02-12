import { useState, useEffect, useContext, useMemo } from 'react'
import './App.css'
import { UserContext } from "./contexts/UserContext";
import Headbar from './components/Headbar/Headbar.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import * as expenseService from './services/expenseService'
import * as authService from './services/authService'
import './utils/gizmos/bancroft-proto'

function getCurrentMonthValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "2026-02"
}

function App() {
  const { user, setUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  // const [receipts, setReceipts] = useState();
  // const [notifications, setNotifications] = useState();
  // const [activity, setActivity] = useState();
  const [uid, setUid] = useState();
  const [month, setMonth] = useState(() => getCurrentMonthValue())
  const [categoryBreakdown, setCategoryBreakdown] = useState([]) // from /expenses-by category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(()=>{
    const loadDashboardData = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError("");

      try {
        const [exp, byCat] = await Promise.all([
          expenseService.index({ month }),
          expenseService.byCategory({ month }),
        ]);

        setExpenses(exp);
        setCategoryBreakdown(byCat?.categories ?? byCat ?? []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?._id, month]);

  const monthTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [expenses]
  );

  if (!user?.username) return <p>Loading. . .</p>;
  return (
    <>
      <Headbar />
      <Dashboard
      month={month}
      setMonth={setMonth}
      loading={loading}
      error={error}
      expenses={expenses}
      categoryBreakdown={categoryBreakdown}
      monthTotal={monthTotal}
      />
    </>
  )
}

export default App



