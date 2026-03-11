import { useEffect, useState } from "react";
import * as budgetsService from "../../services/budgetsService";
import './BudgetForm.css'

const CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Transportation",
  "Healthcare",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Personal",
  "Health",
  "Education",
  "Other",
];

const EMPTY_FORM = {
  name: "",
  description: "",
  category: "",
  monthlyLimit: "",
};

export default function BudgetForm({ budget = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!budget) {
      setFormData(EMPTY_FORM);
      return;
    }

    setFormData({
      name: budget.name || "",
      description: budget.description || "",
      category: budget.category || "",
      monthlyLimit: String(budget.monthlyLimit ?? ""),
    });
  }, [budget]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.general) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
        general: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const monthlyLimit = Number(formData.monthlyLimit);

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!Number.isFinite(monthlyLimit) || monthlyLimit <= 0) {
      newErrors.monthlyLimit = "Monthly limit must be greater than 0";
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
    setErrors({});

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        monthlyLimit: Number(formData.monthlyLimit),
      };

      const savedBudget = budget?._id
        ? await budgetsService.update({ ...payload, _id: budget._id })
        : await budgetsService.create(payload);

      if (onSuccess) {
        onSuccess(savedBudget?.budget ?? savedBudget?.data ?? savedBudget);
      }

      if (!budget) setFormData(EMPTY_FORM);
    } catch (err) {
      console.error("@BudgetForm > handleSubmit()", err);
      setErrors({ general: err?.message || "Failed to save budget" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form id="budget-form" onSubmit={handleSubmit}>
      <h2 className="form-title">
        {budget ? "Edit Budget" : "Create New Budget"}
      </h2>

      {errors.general && <div className="alert alert-error">{errors.general}</div>}

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
          className={errors.name ? "error" : ""}
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
            className={errors.category ? "error" : ""}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
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
            className={errors.monthlyLimit ? "error" : ""}
          />
          {errors.monthlyLimit && (
            <span className="error-message">{errors.monthlyLimit}</span>
          )}
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
          className="btn primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? budget
              ? "Updating..."
              : "Creating..."
            : budget
              ? "Update Budget"
              : "Create Budget"}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
