import { useEffect, useState } from "react";
import userService from "../services/userService";
import Loading from "../components/Loading";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  useEffect(() => {
    userService
      .getMyProfile()
      .then((res) => {
        setProfile(res.data);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          bio: res.data.bio || "",
        });
      })
      .catch(() => alert("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;

    if (profile?.avatar) {
      return profile.avatar.startsWith("http")
        ? profile.avatar
        : `http://localhost:8080${profile.avatar}`;
    }

    return "";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await userService.updateMyProfile(formData);
      setProfile(res.data);
      alert("Profile updated");
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    try {
      const res = await userService.uploadAvatar(file);
      setProfile((prev) => ({
        ...prev,
        avatar: res.data,
      }));
      alert("Avatar uploaded");
    } catch (error) {
      alert("Failed to upload avatar");
    }
  };

  if (loading) return <Loading message="Loading profile..." />;

  return (
    <div>
      <h1>My Profile</h1>

      {getAvatarUrl() && (
        <img src={getAvatarUrl()} alt="Avatar" width="120" />
      )}

      <p>Username: {profile?.username}</p>
      <p>Email: {profile?.email}</p>

      <input type="file" onChange={handleAvatarUpload} />

      <form onSubmit={handleUpdate}>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First name"
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last name"
        />

        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;