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
				<p className="money-block amount">{"1,256.35"}</p>
                <div className="info-block">
					<span className="compare-ratio">
						<span className="arrow" style={{color:'inherit'}}>⬆</span>
						<span className="Amount" style={{color:'inherit'}}>{"12"}%</span>
					</span>
					<span className="detail">vs last month</span>
                </div>
            </div>

            <div id="budget-left" className="card med">
				<header>
					<h6 className="title">Budget Left</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">{"1,256.35"}</p>
                <div className="info-block">
					<div className="progress-bar">
						<div className="progress" style={{color:'inherit'}}></div>
					</div>
					<div className="detail">{"82"}% used</div>
                </div>
            </div>

            <div id="monthly-recurring" className="card med">
				<header>
					<h6 className="title">Monthly Recurring</h6>
					<ImageIcn role="ph" size="12pt" />
				</header>
				<p className="money-block amount">{"1,256.35"}</p>
                <div className="info-block">
					<span className="detail">{"5"} active subscriptions</span>
                </div>
            </div>
		</section>

        <section id="middle">
            <div id="new-expense" className="card med">
				<header>
                	<h5 className="title">Add New Expense</h5>
				</header>
               	<form onSubmit={handleCreateExpense}>
					<label htmlFor="AE-amount">Amount</label>
					<input id="AE-amount" type="number" anme="amount" onChange={handleChange} value={input.amount} required />
					<label htmlFor="AE-category">Category</label>
					<input id="AE-category" type="number" name="category" onChange={handleChange} value={input.category} required />
					<label htmlFor="AE-date">Date</label>
					<input id="AE-date" type="date" name="date" onChange={handleChange} value={input.date} required />
					<div className="recurring-block">
						<label htmlFor="AE-recurring">recurring</label>
						<input id="AE-recurring" type="checkbox" name="recurring" onChange={handleChange} value={input.recurring} required />
					</div>
					<button type="submit">Add Expense </button>
			   	</form>
            </div>

            <div className="card large">
				<header>
					<h5 className="title">Add New Expense</h5>
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
					<div clasName="pie-wrapper">
						<div className="pie-slices"></div>
					</div>
				</figure>
            </div>
		</section>

        <section id="bottom">
            <div className="card med">
                <div className="title">Title Content Goes Here</div>
                <div className="money-sign">$</div>
                <div className="amount">325/<span>$1,256.35</span></div>
                <div className="members">
                    <div className="chip">
                        <ImageIcn role="ph" size="12pt" />
                        <span>Member Name</span>
                    </div>
                    <div className="chip">
                        <ImageIcn role="ph" size="12pt" />
                        <span>Member Name</span>
                    </div>
                    <span>+ # more</span>
                </div>
            </div>
		</section>


        <section id="suggested-recipes">
        </section>
    </main>
	)
}