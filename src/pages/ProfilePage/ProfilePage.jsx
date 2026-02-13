import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import * as userService from "../../services/userService";
import { Link } from 'react-router'
import './profilePage.css'

export default function ProfilePage() {
  const { user, setUser } = useContext(UserContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await userService.index(user._id);
        setProfile(data);
      } catch (error) {
        setError(error?.message || "Faile to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setUser]);

  if (loading) return <p>Loading profile…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile && user) return <p>No profile found.</p>;

  const u = profile || user;
  console.log("user:", user)
  console.log("profile:", profile)
  console.log("u:", u)

  return (
    <main id="profile">
      <div className="img">
        <img src={u.photo.url} />
      </div>
      <div className="text-block">
        <h1>My Profile</h1>

        <div>
          <p>
            <b>Username:</b> {u?.username || "-"}
          </p>
          <p>
            <b>Email:</b> {u?.email || "-"}
          </p>
          <p>
            <b>Display Name:</b> {u?.displayName || "-"}
          </p>
          <p>
            <b>User ID:</b> {u?._id || "-"}
          </p>

          {/* Optional: add edit profile later */}
          {/* <Link to="/profile/edit">Edit Profile</Link> */}
        </div>
      </div>
      <Link to="/dashboard"><button className="primary">Dashboard</button></Link>
    </main>
  );
}
