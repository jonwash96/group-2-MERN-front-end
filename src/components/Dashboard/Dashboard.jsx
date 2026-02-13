import { useState, useEffect, useContext, useMemo } from 'react'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
import '../../utils/gizmos/bancroft-proto'
import { ImageIcn } from '../../utils/gizmos'
import { UserContext } from "../../contexts/UserContext";
import './Dashboard.css'
import * as data from './data'
import * as expenseService from "../../services/expenseService"
import * as budgetsService from "../../services/budgetsService"

function getCurrentMonthValue(date = new Date()) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	return `${y}-${m}`;
}

function getMonthFromDateLike(value) {
	if (typeof value === "string") {
		const match = value.match(/^(\d{4})-(\d{2})/);
		if (match) return `${match[1]}-${match[2]}`;
	}

	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return getCurrentMonthValue();
	return getCurrentMonthValue(d);
}

function money(n) {
	const num = Number(n) || 0;
	return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function getTodayDateValue(date = new Date()) {
	return date.toISOString().split("T")[0];
}

function normalizeBudgets(payload) {
	if (Array.isArray(payload)) return payload;
	if (Array.isArray(payload?.budgets)) return payload.budgets;
	if (Array.isArray(payload?.data)) return payload.data;
	return [];
}

export default function Dashboard() {
	// const navigate = useNavigate();
    // const { user } = useContext(UserContext);
	const [month, setMonth] = useState(() => getCurrentMonthValue());
    const [input, setInput] = useState({
		title: "",
		amount: "",
		category: "",
		date: getTodayDateValue(),
		isRecurring: false,
	});

	// Real data
	const [expenses, setExpenses] = useState([]);
	const [categoryBreakdown, setCategoryBreakdown] = useState([]); // from /expenses/by-category
	const [budgets, setBudgets] = useState([]);

	// UI state
	const [loading, setLoading] = useState(true);
	const [err, setErr] = useState("");

	// Load expenses, category breakdown and budgets for the selected month
	useEffect(() => {
		const load = async () => {
			setLoading(true);
			setErr("");

			try {
				const [exp, byCat, budRes] = await Promise.all([
					expenseService.index({ month }),
					expenseService.byCategory({ month }),
					budgetsService.index(), // returns { budgets }
				]);

				setExpenses(Array.isArray(exp) ? exp : []);
				setCategoryBreakdown(byCat?.categories ?? []);
				setBudgets(normalizeBudgets(budRes));
			} catch (error) {
				setErr(error?.message || "Failed to load dashboard")
			} finally {
				setLoading(false);
			}
		}

		load();
	}, [month]);

	// Derived metrics
	const totalSpent = useMemo(
       	() => expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
       	[expenses]
    );

	const recurringExpenses = useMemo(
		() => expenses.filter((e) => e.isRecurring || e.recurringExpense),
		[expenses]
	)

	const recurringTotal = useMemo(
        () => recurringExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
        [recurringExpenses]
    );


	const recurringCount = recurringExpenses.length;

	// Build map: category -> spent total (from /expenses/by-category)
	const spentByCategoryMap = useMemo(() => {
		const m = new Map();
		for (const row of categoryBreakdown) m.set(row.category, Number(row.total) || 0);
		return m;
	}, [categoryBreakdown])

	const budgetSnapshots = useMemo(() => {
		return budgets
			.map((budget) => {
				const limit = Number(budget.monthlyLimit) || 0;
				const spent = spentByCategoryMap.get(budget.category) || 0;
				const remaining = Math.max(0, limit - spent);
				const usedPct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

				return { ...budget, limit, spent, remaining, usedPct };
			})
			.sort((a, b) => b.usedPct - a.usedPct);
	}, [budgets, spentByCategoryMap]);

	// Total monthly budget and remaining
  const budgetTotals = useMemo(() => {
    const totalLimit = budgets.reduce((sum, b) => sum + (Number(b.monthlyLimit) || 0), 0);

    // Only count spending for categories that have budgets
    const spentTowardBudgets = budgets.reduce((sum, b) => {
      return sum + (spentByCategoryMap.get(b.category) || 0);
    }, 0);

    const remaining = Math.max(0, totalLimit - spentTowardBudgets);
    const usedPct = totalLimit > 0 ? Math.min((spentTowardBudgets / totalLimit) * 100, 100) : 0;

    return { totalLimit, spentTowardBudgets, remaining, usedPct };
  }, [budgets, spentByCategoryMap]);

  // Recent transactions list (use real expenses)
  const recentTransactions = useMemo(
		() =>
			[...expenses]
				.sort((a, b) => {
					const aTime = new Date(a.createdAt || a.date || 0).getTime();
					const bTime = new Date(b.createdAt || b.date || 0).getTime();
					return bTime - aTime;
				})
				.slice(0, 6),
		[expenses],
	);

	// pie starts here
	const calculateSpendingByCategory = () => {
		const categoryTotals = {};
		
		data.expenseCategories.forEach(([category]) => {
			categoryTotals[category] = 0;
		});
		
		expenses.forEach(expense => {
			if (expense.category && Object.prototype.hasOwnProperty.call(categoryTotals, expense.category)) {
				categoryTotals[expense.category] += Number(expense.amount) || 0;
			}
		});
		
		const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
		
		// Convert to percentages of pie slices
		const pieData = data.expenseCategories.map(([category, color]) => {
			const amount = categoryTotals[category];
			const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
			return { category, color, percentage, amount };
		});
		
		return pieData;
	};

	const generatePieGradient = () => {
		const pieData = calculateSpendingByCategory();
		let currentAngle = 0;
		const gradientStops = [];
		
		pieData.forEach((slice) => {
			if (slice.percentage > 0) {
				const startAngle = currentAngle;
				currentAngle += (slice.percentage / 100) * 360;
				const endAngle = currentAngle;
				
				// this is how it knows where the color stops are for each slice
				gradientStops.push(`${slice.color} ${startAngle}deg ${endAngle-1}deg`);
			}
		});
		
		return gradientStops.length > 0 
			? `conic-gradient(${gradientStops.join(', ')})` 
			: 'conic-gradient(#ccc 0deg 360deg)';
	};
// pie ends here this gave me a headache ngl i wouldnt wish this on my worst enemy
    const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

	  const handleCreateExpense = async (e) => {
	    e.preventDefault();
	    setErr("");

	    try {
      const payload = {
        title: input.title.trim(),
        amount: Number(input.amount),
        category: input.category,
        date: input.date,
        isRecurring: Boolean(input.isRecurring),
      };

	      const createdExpense = await expenseService.create(payload);
	      if (!createdExpense?._id) throw new Error("Failed to create expense");

	      // Show the new item immediately; refresh below keeps data fully in sync.
	      setExpenses((prev) =>
	        [createdExpense, ...prev.filter((exp) => exp._id !== createdExpense._id)].sort((a, b) => {
	          const aTime = new Date(a.createdAt || a.date || 0).getTime();
	          const bTime = new Date(b.createdAt || b.date || 0).getTime();
	          return bTime - aTime;
	        }),
	      );

	      const createdMonth = getMonthFromDateLike(createdExpense.date || payload.date);
	      if (createdMonth !== month) setMonth(createdMonth);

	      try {
	        // Refresh month data after create
	        const [exp, byCat] = await Promise.all([
	          expenseService.index({ month: createdMonth }),
	          expenseService.byCategory({ month: createdMonth }),
	        ]);

	        setExpenses(Array.isArray(exp) ? exp : []);
	        setCategoryBreakdown(byCat?.categories ?? []);
	      } catch (refreshError) {
	        // Keep optimistic row if refresh fails.
	        console.error("@Dashboard > refreshAfterCreate()", refreshError);
	      }

	      // Reset form
	      setInput({
	        title: "",
	        amount: "",
	        category: "",
	        date: getTodayDateValue(),
	        isRecurring: false,
	      });
    } catch (e2) {
      setErr(e2?.message || "Failed to create expense");
    }
  };

  const handleDeleteTransaction = async (expenseId) => {
    if (!window.confirm("Delete this transaction?")) return;
    setErr("");

    try {
      await expenseService.deleteExpense(expenseId);

      const [exp, byCat] = await Promise.all([
        expenseService.index({ month }),
        expenseService.byCategory({ month }),
      ]);

      setExpenses(Array.isArray(exp) ? exp : []);
      setCategoryBreakdown(byCat?.categories ?? []);
    } catch (e2) {
      setErr(e2?.message || "Failed to delete expense");
    }
  };

  if (loading) return <p style={{ padding: 16 }}>Loading dashboard…</p>;

if (err) {
  return (
    <div style={{ padding: 16 }}>
      <p><strong>Error:</strong> {err}</p>
    </div>
  );
}

	const handleToggleRecurring = () => {setInput({ ...input, isRecurring: !input.isRecurring })};
	const handleToggleExpenseStatus = (expenseId) => {
		// This would need backend API to toggle status
		console.log("Toggle expense status:", expenseId);
	};
    const handleSearch = () => {console.log("@Headbar > handleSearch", input.search)};

	return(
		<main className="dashboard">
			<div style={{ padding: "0 12px", display: "flex", gap: 12, alignItems: "center" }}>
               <h3 style={{ margin: 0 }}>Dashboard</h3>
               <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>

        <section id="top">
            <div id="total-spent" className="card med">
				<header>
					<h6 className="title">Total Spent</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">${money(totalSpent)}</p>
                <div className="info-block">
					<span className="compare-ratio">
						<span className="arrow" style={{color:'inherit'}}>⬆</span>
						<span className="Amount" style={{color:'inherit'}}>{"12"}%</span>
					</span>
					<span className="detail">This month</span>
                </div>
            </div>

            <div id="budget-remaining" className="card med">
				<header>
					<h6 className="title">Budget Remaining</h6>
					<span style={{ display: "flex", alignItems: "center", gap: 8 }}>
						<Link to="/budgets">Manage</Link>
						<ImageIcn role="ph" size="12pt" />
					</span>
				</header>

				<p className="money-block amount">
					${money(budgetTotals.remaining)}
					<span> / ${money(budgetTotals.totalLimit)}</span>
				</p>

                <div className="info-block">
					<div className="progress-bar">
						<div className="progress" style={{ width: `${Math.round(budgetTotals.usedPct)}%` }}></div>
					</div>
						<div className="detail" style={{float:'right'}}>
							{Math.round(budgetTotals.usedPct)}% used
                		</div>
            		</div>

				{budgetSnapshots.length > 0 ? (
					<div className="budget-mini-list">
						{budgetSnapshots.slice(0, 3).map((budget) => (
							<div
								key={budget._id || `${budget.name}-${budget.category}`}
								className="budget-mini-item"
							>
								<div className="mini-row">
									<span>{budget.name || budget.category}</span>
									<span>{Math.round(budget.usedPct)}%</span>
								</div>
								<div className="mini-progress">
									<div
										className="mini-progress-fill"
										style={{ width: `${Math.round(budget.usedPct)}%` }}
									></div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="detail" style={{ marginTop: 10 }}>
						No budgets yet. <Link to="/budgets">Create your first budget</Link>
					</p>
				)}
					</div>

            <div id="monthly-recurring" className="card med">
				<header>
					<h6 className="title">Monthly Recurring</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">${money(recurringTotal)}</p>
                <div className="info-block">
					<span className="detail">{recurringCount} active subscriptions</span>
                </div>
            </div>
		</section>

        <section id="middle">
            <div id="new-expense" className="card med left">
				<header>
                	<h5 className="title">Add New Expense</h5>
				</header>
               	<form onSubmit={handleCreateExpense}>
					<label htmlFor="AE-title">Title</label>
					<input id="AE-title" type="text" name="title" onChange={handleChange} value={input.title} required />
					<label htmlFor="AE-amount">Amount</label>
					<input id="AE-amount" type="number" name="amount" onChange={handleChange} value={input.amount} required />
					<label htmlFor="AE-category">Category</label>
					<select id="AE-category" type="number" name="category" onChange={handleChange} value={input.category} required>
						<option value="">--Select a Category</option>
						{data.expenseCategories.map(([name]) =>
							<option key={name} value={name}>{name}</option>
						)}
					</select>
					<label htmlFor="AE-date">Date</label>
					<input id="AE-date" type="date" name="date" onChange={handleChange} value={input.date} required />
					
					<div className="recurring-toggle-block">
						<div className="recurring-label-group">
							<label htmlFor="AE-recurring">Monthly Recurring Payment</label>
							<span className="recurring-subtext">
								{input.isRecurring ? 'This expense will repeat monthly' : 'One-time payment'}
							</span>
						</div>
						<label className="toggle-switch">
							<input 
								id="AE-recurring"
								type="checkbox" 
								name="isRecurring" 
								checked={input.isRecurring}
								onChange={handleToggleRecurring}
							/>
							<span className="toggle-slider"></span>
						</label>
					</div>

					<button type="submit">Add Expense </button>
			   	</form>
            </div>

            <div id="spending-by-category" className="card large right">
				<header>
					<h5 className="title">Spending By Category</h5>
					<Link to="/expenses/report">View Report</Link>
				</header>
				<figcaption>
					{calculateSpendingByCategory().map(({category, color, percentage, amount}) => 
						percentage > 0 && (
							<div key={"fig-cap-wrapper-"+category}>
								<div style={{'--col':color}}>
									{category} (${money(amount)})
								</div>
							</div>
						)
					)}
				</figcaption>
				<figure>
					<div className="pie-wrapper">
						<div 
							className="pie-slices" 
							style={{backgroundImage: generatePieGradient()}}
						></div>
					</div>
				</figure>
            </div>
		</section>

        <section id="bottom">
            <div id="recent-transactions" className="card med">
				<header>
					<h5 className="title">Recent Transactions</h5>
					<Link to="/expenses/report">See All</Link>
				</header>
				<ul id="recent-transactions">
					<li key="header">
						<span>Description</span>
						<span>Category</span>
						<span>Amount</span>
						<span>Action</span>
					</li>
				{recentTransactions.map(transaction => 
					<li key={transaction._id}>
						<span>{transaction.title}</span>
						<span>{transaction.category}</span>
						<span>${money(transaction.amount)}</span>
						<span>
							<Link
								to={`/expenses/${transaction._id}/edit`}
								className="icon-action"
								aria-label={`Edit ${transaction.title || "transaction"}`}
							>
								<ImageIcn content="✏️" />
							</Link>
							<button
								type="button"
								className="icon-action"
								onClick={() => handleDeleteTransaction(transaction._id)}
								aria-label={`Delete ${transaction.title || "transaction"}`}
							>
								<ImageIcn content="🗑️" />
							</button>
						</span>
					</li>
				)}
				</ul>
            </div>

            <div id="recurring-expenses" className="card med">
				<header>
					<h5 className="title">Recurring Expenses</h5>
					<Link to="/expenses/report">See All</Link>
				</header>
				<ul id="recent-transactions">
                {recurringExpenses.map(expense => 
					<li key={expense._id} className="controls-li">
						<ImageIcn role="ph" size="24px" options="round" />
						<div className="text-block">
							<p>{expense.title}</p>
							<span>{new Date(expense.date).getDate()._toOrdered()} of the month</span>
						</div>
						<div className="right">
							<span>${money(expense.amount)}</span>
							<label className="toggle-switch-small">
								<input 
									type="checkbox" 
									checked={expense.isRecurring}
									onChange={() => handleToggleExpenseStatus(expense._id)} 
								/>
								<span className="toggle-slider-small"></span>
							</label>
						</div>
					</li>
				)}
				</ul>
            </div>
		</section>
    </main>
	)
}
