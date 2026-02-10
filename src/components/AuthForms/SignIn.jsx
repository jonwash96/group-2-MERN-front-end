import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';
import { ImageIcn, errToast } from '/gizmos'

export default function SignInForm() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      toast(`Welcome back ${signedInUser.username}`)
      navigate('/');
    } catch (err) {
      errToast(err);
    }
  };

  return (
    <main>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username or email</label>
          <input
            type='text'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button>Sign In</button>
          <button onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </main>
  );
};

