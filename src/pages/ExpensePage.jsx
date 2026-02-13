import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import * as expenseService from '../services/expenseService';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await expenseService.index();
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load expenses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  if (loading) return <div>Loading expenses...</div>;

  return (
    <div>
      <h1>All Expenses</h1>
      <Link to="/expenses/new">+ Add Expense</Link>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {expenses.length === 0 ? (
        <p>No expenses yet.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{expense.category}</td>
                <td>${expense.amount}</td>
                <td>{expense.notes || '-'}</td>
                <td>
                  <Link to={`/expenses/${expense._id}/edit`}>Edit</Link> | 
                  <Link to={`/expenses/${expense._id}`}>View</Link>
                  <button onClick={() => handleDelete(expense._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
