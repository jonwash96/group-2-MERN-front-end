import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import * as expenseService from "../../services/expenseService";

export default function ExpenseShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await expenseService.showOne(id);
        setExpense(data);
      } catch (err) {
        setError(err?.message || "Failed to load expense");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleDelete = async () => {
    try {
      setError("");
      await expenseService.deleteExpense(id);
      navigate("/expenses");
    } catch (err) {
      setError(err?.message || "Failed to delete expense");
    }
  };

  if (loading) return <p>Loading expense…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!expense) return <p>Expense not found.</p>;

  const amount = Number(expense.amount ?? 0);

  return (
    <div style={{ padding: 16 }}>
      <h1>Expense Details</h1>

      <div style={{ marginTop: 12 }}>
        <p>
          <b>Merchant:</b> {expense.merchant || expense.vendor || "—"}
        </p>
        <p>
          <b>Amount:</b> ${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}
        </p>
        <p>
          <b>Category:</b> {expense.category || "—"}
        </p>
        <p>
          <b>Date:</b>{" "}
          {expense.date ? new Date(expense.date).toLocaleDateString() : "—"}
        </p>
        <p>
          <b>Notes:</b> {expense.notes || "—"}
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <Link to="/expenses">Back</Link>
        <Link to={`/expenses/${expense._id}/edit`}>Edit</Link>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
