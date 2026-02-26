import { useEffect } from 'react'
import { signOut } from '../../services/authService'
import { errToast } from '../../utils/gizmos'

export default function SignOutPage() {
	const navigate = useNavigate();
	useEffect(() => {
		(async () => {
			try {
				console.log("@Handle Signout")
				await signOut();
				navigate('/');
			} catch (err) {
				errToast()
			}
		})()
	},[])
  return (
	<p>Loading...</p>
  )
}