import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as expenseService from '../services/expenseService';

export default function EditExpensePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Other');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Housing', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Education', 'Personal', 'Other'];
  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'];

  useEffect(() => {
    loadExpense();
  }, [id]);

  const loadExpense = async () => {
    try {
      const expense = await expenseService.showOne(id);
      setAmount(expense.amount);
      setCategory(expense.category);
      setDate(new Date(expense.date).toISOString().split('T')[0]);
      setNotes(expense.notes || '');
      setPaymentMethod(expense.paymentMethod || 'Other');
    } catch (err) {
      setError('Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await expenseService.update({
        _id: id,
        amount: parseFloat(amount),
        category,
        date,
        notes,
        paymentMethod
      });
      navigate('/expenses');
    } catch (err) {
      setError(err.message || 'Failed to update expense');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/expenses">← Back to Expenses</Link>
      <h1>Edit Expense</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount ($):</label>
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Payment Method:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Notes:</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
          />
        </div>
        
        <button type="submit">Update Expense</button>
        <Link to="/expenses">Cancel</Link>
      </form>
    </div>
  );
}