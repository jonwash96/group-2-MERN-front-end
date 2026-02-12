import { useState, useEffect, useContext } from 'react'
import { styled } from 'styled-components'
import { Link, useNavigate } from 'react-router'
import '../../utils/gizmos/bancroft-proto'
import { ImageIcn, errToast } from '../../utils/gizmos'
import { toast } from 'react-toastify'
import { UserContext } from "../../contexts/UserContext";
import './Dashboard.css'

export default function Dashboard() {
	const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [input, setInput] = useState({});

    const handleChange = (e) => {setInput({ ...input, [e.target.name]:e.target.value })};
    const handleSearch = () => {console.log("@Headbar > handleSearch", input.search)};

	return(
		<main className="dashboard">
        <header>
            <div className="left">
                <h1><span className="thin">Hello,</span> {user.displayName}</h1>
                <p>Explore Your Recipes, Favourite Ingredients, and .</p>
            </div>
            <form className="btn-block" action="/recipes/new" method="GET">
                <button className="action-btn">➕ New Recipe</button>
            </form>
        </header>

        <section id="ingredients">
            <div className="section-head">
                <h2>My ingredients</h2>
                <button className="view-full">
                    <div>blank</div>
                </button>
                <div>
                    <div id="view-favoriteIngredients">Favourites</div>
                    <div id="view-myIngredients">Added By Me</div>
                </div>
            </div>
            <section className="slider">
                <div className="ingredients-grid">
                    {user.expenses.map((expense,idx) => {
                        <div className="ingredient card" name={expense.title} listNumber={idx}>
                            <p>blank</p>
                            <p>{expense.title}</p>
                            {expense.img
                                ? <img src={expense.img} alt={expense.title} />
                                : <img src="/svg/noimg.svg" />
                            }
                        </div>
					})}
                </div>
                <div className="ingredients-grid">
                    {user.expenses.map((expense,idx) => {
                        <div className="ingredient card" name={expense.title} listNumber={idx}>
                            <p>{expense.amount || ''}</p>
                            <p>{expense.title}</p>
                            {expense.img
                                ? <img src={expense.img} alt={expense.title} />
                                : <img src="/svg/noimg.svg" />
                            }
                        </div>
                    })}
                </div>
            </section>
        </section>

        <section id="pantry">
            <div className="section-head">
                <h2>My Pantry</h2>
            </div>
            <div className="pantry-scroller">
                {user.expenses.map((expense,idx) => {
                    <div className="item card" name={expense.title} listNumber={idx}>
                        <a href="/user/pantry/dashboard/">
                            <div className="top">
                                {expense.img
                                    ? <img src={expense.img} alt={expense.title} />
                                    : <img src="/svg/noimg.svg" />
                                }
                                <p className="title">{expense.title}</p>
                                <p className="category">{expense.ingredientID?.category}</p>
                                <p className="quantity">{expense.amount} left</p>
                            </div>
                        </a>
                        <hr />
                        <a href="/search/?ingredients" className="bottom">
                            <div className="action">
                                Browse Recipes
                                <img src="/svg/noimg.svg" />
                            </div>
                        </a>
                    </div>
                })}
            </div>
        </section>

        <section id="suggested-recipes">
            <div className="section-head">
                <h2>Suggested Recipes</h2>
                <p>Based on your activity</p>
                <button>See More</button>
            </div>
            {user.suggested ? <>
                <div className="suggested-recipes-grid">
                    {user.expenses.map((expense,idx) => {
                        <div className="recipe card small" name={expense.title} listNumber={idx}>
                            <img src={expense.img} alt={expense.title} />
                            <p>{expense.title}</p>
                            <p>{expense.amount}</p>
                            <div className="chips">
                                <div className="chip"><img src="/svg/noimg.svg" />Prep: {recipe.prepTime}</div>
                                <div className="chip"><img src="/svg/noimg.svg" />Cook: {recipe.cookTime}</div>
                                <div className="chip"><img src="/svg/noimg.svg" />Serves: {recipe.servings}</div>
                            </div>
                        </div>
                    })}
                    <div className="next">
					<img src="/svg/noimg.svg" />
                    </div>
                </div>
            </> : <>
                <h4>No suggested Recipes</h4>
            </>}
        </section>
        
        <section id="user-recipes">
            <div className="section-head">
                <h2>My Recipes</h2>
                <button>View All</button>
            </div>
            <div className="user-recipes-grid">
                {user.expenses.length > 0 ? <>
                    {user.expenses.map((expense,idx) => {
                        <div className="recipe card small" name={expense.title} listNumber={idx}>
                            <img src={expense.img} alt={expense.title} />
                            <p>{expense.title}</p>
                            <p>{expense.amount}</p>
                            <div className="chips">
                                <div className="chip"><img src="/svg/noimg.svg" />Prep: {expense.prepTime}</div>
                                <div className="chip"><img src="/svg/noimg.svg" />Cook: {expense.cookTime}</div>
                                <div className="chip"><img src="/svg/noimg.svg" />Serves: {expense.servings}</div>
                            </div>
                        </div>
                    })}
                    <div className="next">
                        <img src="/svg/noimg.svg" />
                    </div>
                </> : <>
                    <h4>No Recipes to Show</h4>
                </>}
            </div>
        </section>
    </main>
	)
}