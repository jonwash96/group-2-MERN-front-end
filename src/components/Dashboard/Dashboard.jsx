import { useState, useEffect, useContext, useMemo } from 'react'
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

function money(n) {
	const num = Number(n) || 0;
	return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Dashboard() {
	// const navigate = useNavigate();
    // const { user } = useContext(UserContext);
	const [month, setMonth] = useState(() => getCurrentMonthValue());
    const [input, setInput] = useState({
		title: "",
		amount: "",
		category: "",
		date: "",
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
				setBudgets(budRes?.budgets ?? []);
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
  const recentTransactions = useMemo(() => expenses.slice(0, 6), [expenses]);

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

      await expenseService.create(payload);

      // Refresh month data after create
      const [exp, byCat] = await Promise.all([
        expenseService.index({ month }),
        expenseService.byCategory({ month }),
      ]);

      setExpenses(Array.isArray(exp) ? exp : []);
      setCategoryBreakdown(byCat?.categories ?? []);

      // Reset form
      setInput({
        title: "",
        amount: "",
        category: "",
        date: "",
        isRecurring: false,
      });
    } catch (e2) {
      setErr(e2?.message || "Failed to create expense");
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
					<ImageIcn role="ph" size="12pt" />
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
					<div className="recurring-block">
						<label htmlFor="AE-recurring">Recurring</label>
						<input id="AE-recurring" type="checkbox" name="isRecurring" onChange={handleChange} checked={input.isRecurring} />
					</div>
					<button type="submit">Add Expense</button>
			   	</form>
            </div>

            <div id="spending-by-category" className="card large right">
				<header>
					<h5 className="title">Spending By Category</h5>
					<Link to="/expenses/report">View Report</Link>
				</header>
				<figcaption>
					{data.expenseCategories.map(([key,col]) =>
						<div>
							<div key={"fig-cap-"+key} style={{'--col':col}}>{key}</div>
						</div>
					)}
				</figcaption>
				<figure>
					<div className="pie-wrapper">
						<div className="pie-slices"></div>
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
							<Link to={`/expenses/${transaction._id}/edit`}><ImageIcn content="✎" /></Link>
							<Link to={`/expenses/${transaction._id}/edit`}><ImageIcn content="🗑️" /></Link>
						</span>
					</li>
				)}
				</ul>
            </div>

            <div id="recurring-expenses" className="card med">
				<header>
					<h5 className="title">Recurring Expenses</h5>
					<Link to="/expenses/report">➕ Add New</Link>
				</header>
				<ul id="recent-transactions">
                {recurringExpenses.map(expense => 
					<li key={expense._id} className="controls-li">
						<ImageIcn role="ph" size="24px" options="round" />
						<div className="text-block">
							<p>{expense.title}</p>
							<span>{new Date(expense.date).getDate()} of the month</span>
						</div>
						<div className="right">
							<span>${money(expense.amount)}</span>
							<div className="toggle">
								<input type="checkbox" checked={Boolean(expense.isRecurring || expense.recurringExpense)} readOnly />
							</div>
						</div>
					</li>
				)}
				</ul>
            </div>
		</section>
    </main>
	)
}