import { useState, useEffect, useContext, useMemo } from "react";
import { Routes, Route, Navigate, redirect } from "react-router";
import "./App.css";

import { UserContext, JITAuth } from "./contexts/UserContext";
import Headbar from "./components/Headbar/Headbar";
import Dashboard from "./pages/Dashboard/Dashboard";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import SignInPage from "./pages/Auth/SignInPage";
import SignOutPage from "./pages/Auth/SignOutPage";
import ExpensePage from "./pages/Expenses/ExpensePage";
import NewExpensePage from "./pages/Expenses/NewExpensePage";
import EditExpensePage from "./pages/Expenses/EditExpensePage";
import ExpenseShowPage from "./pages/Expenses/ExpenseShowPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import BudgetsPage from "./pages/Budgets/BudgetsPage";
import * as expenseService from "./services/expenseService";
import "./utils/gizmos/bancroft-proto";

function getCurrentMonthValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`; // "2026-02"
}

function RequireAuth({ isAuthed, children }) {
  if (!isAuthed) return <Navigate to="/" replace />
  return children;
}

function AppLayout({ children }) {
  return (
    <>
      <Headbar/>
      {children}
    </>
  );
}

function App() {
  const { user } = useContext(UserContext);
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(() => getCurrentMonthValue());
  const [categoryBreakdown, setCategoryBreakdown] = useState([]); // from /expenses-by category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSetMonth = (input) => setMonth(input);

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

  const isAuthed = JITAuth();

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<LandingPage isAuthed={isAuthed} />}
        />

        <Route
          path="/sign-up"
          element={<SignUpPage />}
        />

        <Route
          path="/sign-in"
          element={<SignInPage />}
        />

        {/* Protected */}
        <Route
          path="/sign-out"
          element={<SignOutPage />}
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
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
          path="/profile"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
                <ExpensePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/budgets"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
                <BudgetsPage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses/:id"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
                <ExpenseShowPage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses/new"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
                <NewExpensePage />
              </AppLayout>
            </RequireAuth>
          }
        />

        <Route
          path="/expenses/:id/edit"
          element={
            <RequireAuth isAuthed={isAuthed}>
              <AppLayout>
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
