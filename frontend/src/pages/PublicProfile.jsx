import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios.get(`/users/${username}`)
      .then((res) => setProfile(res.data))
      .catch(() => alert("Profile not found"));
  }, [username]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.bio || "No bio yet"}</p>
    </div>
  );
}

export default PublicProfile;