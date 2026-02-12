import { useState, useEffect, useContext } from 'react'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
import '../../utils/gizmos/bancroft-proto'
import { ImageIcn, errToast } from '../../utils/gizmos'
import { toast } from 'react-toastify'
import { UserContext } from "../../contexts/UserContext";
import './Dashboard.css'
import * as data from './data'

export default function Dashboard() {
	const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [input, setInput] = useState({});

	// FAKE TESTING DATA
	const [recentTransactions, setRecentTransactions] = useState([
		{_id:Math.random(), title:'dummy1', category:'dCat1', amount:432.56},
		{_id:Math.random(), title:'dummy2', category:'dCat2', amount:26.85},
		{_id:Math.random(), title:'dummy3', category:'dCat3', amount:4323.99},
		{_id:Math.random(), title:'dummy4', category:'dCat4', amount:6.03},
	]);
	const [recurringExpenses, setRecurringExpenses] = useState([
		{_id:Math.random(), title:'Internet Bill', period:'monthly', date:1, amount:60, status:true},
		{_id:Math.random(), title:'Gym Bill', period:'monthly', date:15, amount:40, status:false},
		{_id:Math.random(), title:'SuperCloud Bill', period:'quarterly', date:28, amount:10, status:true},
		{_id:Math.random(), title:'Netflix', period:'monthly', date:1, amount:23, status:false},
		{_id:Math.random(), title:'Youtube Premium', period:'monthly', date:18, amount:60, status:true},
		{_id:Math.random(), title:'Insurance', period:'monthly', date:1, amount:120, status:true},
		{_id:Math.random(), title:'Github Pro', period:'monthly', date:12, amount:4, status:true},
	]);
	const budget = {
		percentage: 36,
		monthlyLimit: 2000,
		remaining: 720
	}

    const handleChange = (e) => {setInput({ ...input, [e.target.name]:e.target.value })};
    const handleSearch = () => {console.log("@Headbar > handleSearch", input.search)};
	const handleCreateExpense = () => {};

	return(
		<main className="dashboard">
        <section id="top">
            <div id="total-spent" className="card med">
				<header>
					<h6 className="title">Total Spent</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">${"1,256.35"}</p>
                <div className="info-block">
					<span className="compare-ratio">
						<span className="arrow" style={{color:'inherit'}}>⬆</span>
						<span className="Amount" style={{color:'inherit'}}>{"12"}%</span>
					</span>
					<span className="detail"> vs last month</span>
                </div>
            </div>

            <div id="budget-remaining" className="card med">
				<header>
					<h6 className="title">Budget Remaining</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">${budget.remaining}<span> / ${budget.monthlyLimit}</span></p>
                <div className="info-block">
					<div className="progress-bar">
						<div className="progress" style={{width:budget.percentage+'%'}}></div>
					</div>
					<div className="detail" style={{float:'right'}}>{100-budget.percentage}% used</div>
                </div>
            </div>

            <div id="monthly-recurring" className="card med">
				<header>
					<h6 className="title">Monthly Recurring</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">${"1,256.35"}</p>
                <div className="info-block">
					<span className="detail">{"5"} active subscriptions</span>
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
						{data.expenseCategories.map(category =>
							<option value={category[0]}>{category[0]}</option>
						)}
					</select>
					<label htmlFor="AE-date">Date</label>
					<input id="AE-date" type="date" name="date" onChange={handleChange} value={input.date} required />
					<div className="recurring-block">
						<label htmlFor="AE-recurring">Recurring</label>
						<input id="AE-recurring" type="checkbox" name="recurring" onChange={handleChange} value={input.recurring} required />
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
					<li key={transaction.id}>
						<span>{transaction.title}</span>
						<span>{transaction.category}</span>
						<span>{transaction.amount}</span>
						<span>
							<Link to={'/transactions/'+transaction._id+'/edit'}><ImageIcn content="✎" /></Link>
							<Link to={'/transactions/'+transaction._id+'/edit'}><ImageIcn content="🗑️" /></Link>
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
					<li key={expense.id} className="controls-li">
						<ImageIcn role="ph" size="24px" options="round" />
						<div className="text-block">
							<p>{expense.title}</p>
							<span>{expense.period} • {expense.date._toOrdered()} of the month</span>
						</div>
						<div className="right">
							<span>${expense.amount}</span>
							<div className="toggle">
								<input type="checkbox" onChange={handleChange} value={expense.status} />
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