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
import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
];

const BudgetForm = ({ budget = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    monthlyLimit: ''
  });

const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (budget) {
      setFormData({
        name: budget.name || '',
        description: budget.description || '',
        category: budget.category || '',
        monthlyLimit: budget.monthlyLimit || ''
      });
    }
  }, [budget]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        }
    if (!formData.category) {
        newErrors.category = 'Category is required';
        }
    if (!formData.monthlyLimit || parseFloat(formData.monthlyLimit) <= 0) {
        newErrors.monthlyLimit = 'Monthly limit must be greater than 0';
        }
        return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
try {
      const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000";
      const BASE_URL = `${API_URL}/budgets`;
      
      const url = budget ? `${BASE_URL}/${budget._id}` : BASE_URL;
      const method = budget ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          monthlyLimit: parseFloat(formData.monthlyLimit)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.err || 'Failed to save budget');
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(data.data || data);
      }

      // Reset form if creating new
      if (!budget) {
        setFormData({
          name: '',
          description: '',
          category: '',
          monthlyLimit: ''
        });
      }

    } catch (err) {
      console.error("@BudgetForm > handleSubmit()", err);
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {budget ? 'Edit Budget' : 'Create New Budget'}
      </h2>
      
      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">
          Budget Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Food Budget"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">
            Category <span className="required">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="monthlyLimit">
            Monthly Limit <span className="required">*</span>
          </label>
          <input
            type="number"
            id="monthlyLimit"
            name="monthlyLimit"
            value={formData.monthlyLimit}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.monthlyLimit ? 'error' : ''}
          />
          {errors.monthlyLimit && <span className="error-message">{errors.monthlyLimit}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Budget details (optional)"
          rows="3"
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (budget ? 'Updating...' : 'Creating...') 
            : (budget ? 'Update Budget' : 'Create Budget')
          }
        </button>

        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );


export { BudgetForm };
