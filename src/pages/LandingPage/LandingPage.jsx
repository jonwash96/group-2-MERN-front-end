import { useState, useEffect, useContext } from 'react'
import './LandingPage.css'

export default function LandingPage({ simulateSignInOut }) {
	const [joinImages, setJoinImages] = useState([
		{name:'image', description:'', url:'/svg/noimg.svg'},
		{name:'image', description:'', url:'/svg/noimg.svg'},
		{name:'image', description:'', url:'/svg/noimg.svg'},
		{name:'image', description:'', url:'/svg/noimg.svg'},
		{name:'image', description:'', url:'/svg/noimg.svg'},
	])

	return(
		<div id="landing-page-wrapper">
		<nav className="landing-page">
			<div className="wrapper">
				<div className="left">
					<p>$pend Sense</p>
					<span>Documentation</span>
					<span>Github</span>
					<span>Info</span>
				</div>
				<div className="right">
					<button type="button" onClick={()=>simulateSignInOut(true)} className="secondary">Log In</button>
					<button type="button" onClick={()=>simulateSignInOut(true)} className="primary">Sign Up</button>
				</div>
			</div>
		</nav>

		<main id="landing-page">
			<section id="hero">
				<div className="hero-wrapper">
					<header className="text-block">
						<h1>Money, money, money, money. Gotta Get That Bread</h1>
						<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus modi perferendis sequi, cum nisi velit saepe soluta corporis rerum quasi voluptatum iste iure nemo nam atque laborum. Voluptatem, minima ipsum.</p>
						<button type="button" className="primary">Start Saving</button>
					</header>
					<div className="image-wrapper">
						<img src="/svg/noimg.svg" />
					</div>
				</div>
			</section>

			<section id="join">
				<div className="slider-wrapper">
					<div className="slider-inner"> 
						{joinImages.map(image => 
							<div className="img" key={Math.random()}>
								<img src={image.url} alt={image.name} />
							</div>
						)}
					</div>
				</div>
				<div className="text-block">
					<h2>Become a member and start managing your money today</h2>
					<p>Track your spending, create budgets and more.</p>
				</div>
			</section>

			<section id="expense-tracker" className="right">
				<div className="img">
					<img src="/svg/noimg.svg" alt="Expense Tracker Image" />
				</div>
				<div className="text-block">
					<h2>Track Your Expenses</h2>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quae, distinctio.</p>
					<button type="button" className="tertiary">Learn More</button>
				</div>
			</section>

			<section id="budgets" className="left">
				<div className="img">
					<img src="/svg/noimg.svg" alt="Budget Tracker Image" />
				</div>
				<div className="text-block">
					<h2>Create Budgets</h2>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quae, distinctio.</p>
					<button type="button" className="tertiary">Learn More</button>
				</div>
			</section>
		</main>

		<footer>
			<div>
				<h5>$pend Sense</h5>
				Designed & Developed by:<br /><br />
				<span>Jonathan Washington</span><br />
				<span>Adam Myers</span><br />
				<span>Rick Oweis</span><br /><br />
				Winter 2026, In the USA.
			</div>
		</footer>
		</div>
	)
}