import { useEffect, useMemo, useState } from "react";
import BudgetForm from "./BudgetForm";
import * as budgetsService from "../services/budgetsService";

function normalizeBudgets(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.budgets)) return payload.budgets;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function money(n) {
  const num = Number(n) || 0;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBudgets = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await budgetsService.index();
        setBudgets(normalizeBudgets(data));
      } catch (err) {
        setError(err?.message || "Failed to load budgets");
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, []);

  const handleDelete = async (budgetId) => {
    if (!window.confirm("Delete this budget?")) return;

    try {
      setError("");
      await budgetsService.deleteBudget(budgetId);
      setBudgets((prev) => prev.filter((b) => b._id !== budgetId));
      if (selectedBudget?._id === budgetId) setSelectedBudget(null);
    } catch (err) {
      setError(err?.message || "Failed to delete budget");
    }
  };

  const handleFormSuccess = (savedBudget) => {
    if (!savedBudget?._id) {
      setError("Budget saved, but response was missing an id. Refresh to resync.");
      return;
    }

    const next = savedBudget;

    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b._id === next._id);
      if (idx === -1) return [next, ...prev];

      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });

    setSelectedBudget(null);
    setShowCreateForm(false);
  };

  const totalBudget = useMemo(
    () => budgets.reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0),
    [budgets],
  );

  if (loading) return <div style={{ padding: 16 }}>Loading budgets...</div>;

  return (
    <main style={{ padding: 16, display: "grid", gap: 16 }}>
      <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0 }}>Budgets</h1>
          <p style={{ margin: "6px 0 0", color: "#666" }}>
            {budgets.length} budget{budgets.length === 1 ? "" : "s"} | Total monthly limit: {money(totalBudget)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedBudget(null);
            setShowCreateForm((prev) => !prev);
          }}
        >
          {showCreateForm ? "Close Form" : "Create Budget"}
        </button>
      </section>

      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}

      {(showCreateForm || selectedBudget) && (
        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <BudgetForm
            budget={selectedBudget}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setSelectedBudget(null);
              setShowCreateForm(false);
            }}
          />
        </section>
      )}

      <section style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
        {budgets.length === 0 ? (
          <p style={{ margin: 0, padding: 16 }}>No budgets yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                <th style={{ textAlign: "left", padding: 12 }}>Category</th>
                <th style={{ textAlign: "left", padding: 12 }}>Monthly Limit</th>
                <th style={{ textAlign: "left", padding: 12 }}>Description</th>
                <th style={{ textAlign: "left", padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 12 }}>{budget.name}</td>
                  <td style={{ padding: 12 }}>{budget.category}</td>
                  <td style={{ padding: 12 }}>{money(budget.monthlyLimit)}</td>
                  <td style={{ padding: 12 }}>{budget.description || "-"}</td>
                  <td style={{ padding: 12, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBudget(budget);
                        setShowCreateForm(false);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(budget._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
