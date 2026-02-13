import { useState, useEffect, useContext, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router";
import "./App.css";

import { UserContext } from "./contexts/UserContext";
import Headbar from "./components/Headbar/Headbar";
import Dashboard from "./components/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ExpensePage from "./pages/ExpensePage";
import NewExpensePage from "./pages/NewExpensePage";
import EditExpensePage from "./pages/EditExpensePage";

import * as expenseService from "./services/expenseService";
import * as authService from "./services/authService";
import "./utils/gizmos/bancroft-proto";

function getCurrentMonthValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "2026-02"
}
function RequireAuth({ isAuthed, children }) {
  if (!isAuthed) return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ simulateSignInOut, children }) {
  return (
    <>
      <Headbar simulateSignInOut={simulateSignInOut} />
      {children}
    </>
  );
}

function App() {
  const { user, setUser } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  // const [receipts, setReceipts] = useState();
  // const [notifications, setNotifications] = useState();
  // const [activity, setActivity] = useState();
  const [uid, setUid] = useState();
  const [month, setMonth] = useState(() => getCurrentMonthValue());
  const [categoryBreakdown, setCategoryBreakdown] = useState([]); // from /expenses-by category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUserTest, setLoggedInUserTest] = useState(false);

  useEffect(() => {
    const signin = async () => {
      const signedInUser = await authService.signIn({
        username: import.meta.env.VITE_USERNAME,
        password: import.meta.env.VITE_PASSWORD,
      });
      console.log("@signin", signedInUser);
      setUser(signedInUser);
      setUid(signedInUser._id);
    };
    signin();
  }, [setUser]);

  useEffect(() => {
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
    [expenses],
  );

  const simulateSignInOut = (bool) => setLoggedInUserTest(bool);

  const isAuthed = loggedInUserTest;

  if (!user?.username) return <p>Loading. . .</p>;

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<LandingPage simulateSignInOut={simulateSignInOut} />}
        />

        <Route
          path="/sign-up"
          element={<SignUpPage simulateSignInOut={simulateSignInOut} />}
        />

        <Route
          path="/sign-in"
          element={<SignInPage simulateSignInOut={simulateSignInOut} />}
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout simulateSignInOut={simulateSignInOut}>
                <Dashboard
                  expenses={expenses}
                  month={month}
                  setMonth={setMonth}
                  monthTotal={monthTotal}
                  loading={loading}
                  error={error}
                />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout simulateSignInOut={simulateSignInOut}>
                <ExpensePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses/new"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout simulateSignInOut={simulateSignInOut}>
                <NewExpensePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses/:id/edit"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout simulateSignInOut={simulateSignInOut}>
                <EditExpensePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
