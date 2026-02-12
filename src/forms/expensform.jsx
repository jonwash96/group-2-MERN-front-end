import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

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

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'PayPal',
  'Other'
];

const ExpenseForm = ({ expense = null, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    paymentMethod: '',
    merchant: '',
    amount: '',
    status: 'completed'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name || '',
        description: expense.description || '',
        category: expense.category || '',
        paymentMethod: expense.paymentMethod || '',
        merchant: expense.merchant || '',
        amount: expense.amount || '',
        status: expense.status || 'completed'
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Expense name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const API_URL = import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000";
      const BASE_URL = `${API_URL}/expenses`;
      
      const url = expense ? `${BASE_URL}/${expense._id}` : BASE_URL;
      const method = expense ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.err || 'Failed to save expense');
      }

      if (onSuccess) {
        onSuccess(data.data || data);
      }

      // new exoense starts here
      if (!expense) {
        setFormData({
          name: '',
          description: '',
          category: '',
          paymentMethod: '',
          merchant: '',
          amount: '',
          status: 'completed'
        });
      }

    } catch (err) {
      console.error("@ExpenseForm > handleSubmit()", err);
      setErrors({ general: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {expense ? 'Edit Expense' : 'Add New Expense'}
      </h2>
      
      {errors.general && (
        <div className="alert alert-error">
          {errors.general}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">
          Expense Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Grocery Shopping"
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">
            Amount <span className="required">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.amount ? 'error' : ''}
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

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
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <option value="">Select Payment Method</option>
            {PAYMENT_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="merchant">Merchant</label>
          <input
            type="text"
            id="merchant"
            name="merchant"
            value={formData.merchant}
            onChange={handleChange}
            placeholder="e.g., Walmart, Amazon"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional details (optional)"
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
            ? (expense ? 'Updating...' : 'Adding...') 
            : (expense ? 'Update Expense' : 'Add Expense')
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
};

export default ExpenseForm;