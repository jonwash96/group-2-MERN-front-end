import { useState, useEffect, useContext } from 'react'
import { useNavigate, Link } from "react-router"
import './LandingPage.css'

export default function LandingPage({ isAuthed }) {
	const [joinImages, setJoinImages] = useState([
		{name:'image', description:'', url:'/landing-page/img1.jpg'},
		{name:'image', description:'', url:'/landing-page/img2.jpg'},
		{name:'image', description:'', url:'/landing-page/img3.jpg'},
		{name:'image', description:'', url:'/landing-page/img4.jpg'},
		{name:'image', description:'', url:'/landing-page/img5.jpg'},
		{name:'image', description:'', url:'/landing-page/img6.jpg'},
	])

	const navigate = useNavigate();

	const goToSignIn = () => {
		navigate("/sign-in");
	};
	console.log("@LandingPage", isAuthed)

	const goToSignUp = () => {
		navigate("/sign-up");
	};
	const goToSignDashboard = () => {
		navigate("/dashboard");
	};

	const goToSignOut = () => {
		navigate("/sign-out");
	};

	return(
		<div id="landing-page-wrapper">
		<nav className="landing-page">
			<div className="wrapper">
				<div className="left">
					<p>$pend Sense</p>
					
					<Link to="/docs">Documentation</Link>
					<a href="https://github.com/jonwash96/group-2-MERN-front-end.git" target="_blank" rel="noreferrer">Github</a>
					<Link to="/info">Info</Link>
				</div>

				{isAuthed 
				? (<>
					<div className="right">
						<button type="button" onClick={goToSignDashboard} className="primary">Dashboard</button>
						<button type="button" onClick={goToSignOut} className="secondary">Sign Out</button>
					</div> 
				</>) : (<>
					<div className="right">
						<button type="button" onClick={goToSignIn} className="secondary">Log In</button>
						<button type="button" onClick={goToSignUp} className="primary">Sign Up</button>
					</div> 
				</>)
			}
			</div>
		</nav>

		<main id="landing-page">
			<section id="hero">
				<div className="hero-wrapper">
					<header className="text-block">
				<img src="/logosolo.png" width="200px" />
						<h1>Money, money, money, money. Gotta Get That Bread</h1>
						<p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus modi perferendis sequi, cum nisi velit saepe soluta corporis rerum quasi voluptatum iste iure nemo nam atque laborum. Voluptatem, minima ipsum.</p>

						{/* Made this go to sign up as well */}
						<button type="button" className="primary" onClick={goToSignUp}>Start Saving</button>
					</header>

					<div className="image-wrapper">
						<img src="/landing-page/hero.png" />
					</div>
				</div>
			</section>

			<section id="join">
				<div className="slider-wrapper">
					<div className="slider-inner"> 
						{joinImages.map((image, idx) => 
							<div className="img" key={idx}>
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
					<img src="/landing-page/screenshot1.jpg" alt="Expense Tracker Image" />
				</div>
				<div className="text-block">
					<h2>Track Your Expenses</h2>
					<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo quae, distinctio.</p>
					<button type="button" className="tertiary">Learn More</button>
				</div>
			</section>

			<section id="budgets" className="left">
				<div className="img">
					<img src="/landing-page/screenshot2.jpg" alt="Budget Tracker Image" />
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
				<a href="https://www.github.com/jonwash96"><span>Jonathan Washington</span></a><br />
				<span>Adam Myers</span><br />
				<span>Rick Oweis</span><br /><br />
				Winter 2026, In the USA.
			</div>
		</footer>
		</div>
	)
}