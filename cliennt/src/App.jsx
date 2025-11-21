import React, { useState } from "react";
import axios from "axios";

const KasabaTadbirCreate = () => {
  const [form, setForm] = useState({
    title_uz: "",
    title_ru: "",
    title_oz: "",
    description_uz: "",
    description_ru: "",
    description_oz: "",
    date: "",
    time: "",
    location_uz: "",
    location_ru: "",
    location_oz: "",
    category_uz: "",
    category_ru: "",
    category_oz: "",
    users: "",
  });

  const [media, setMedia] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setMedia(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Zjg2YjUxNjlkYjEyZTM0MTVmNmY4YyIsInBob25lIjoiKzk5ODkwMDIyNDk1MCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MzcwNDExNSwiZXhwIjoxNzY0MzA4OTE1fQ.oupvVRYQpdhLQN9CU6x6IoWC2zhuUcnFzawL48grbrE"; // <<<  BU YERNI O'ZINGIZ YOZASIZ !!!

      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      // Filelarni qo‘shish
      for (let i = 0; i < media.length; i++) {
        formData.append("files", media[i]);
      }

      const response = await axios.post(
        "https://uzneftegaz-backend-production.up.railway.app/api/tadbirlar/create", // TO’G’RI URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // <<< O'ZINGIZ YOZASIZ !!!
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Xatolik yuz berdi!");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
      <input name="title_uz" placeholder="Title UZ" onChange={handleChange} />
      <input name="title_ru" placeholder="Title RU" onChange={handleChange} />
      <input name="title_oz" placeholder="Title OZ" onChange={handleChange} />

      <textarea name="description_uz" placeholder="Description UZ" onChange={handleChange} />
      <textarea name="description_ru" placeholder="Description RU" onChange={handleChange} />
      <textarea name="description_oz" placeholder="Description OZ" onChange={handleChange} />

      <input type="date" name="date" onChange={handleChange} />
      <input type="time" name="time" onChange={handleChange} />

      <input name="location_uz" placeholder="Location UZ" onChange={handleChange} />
      <input name="location_ru" placeholder="Location RU" onChange={handleChange} />
      <input name="location_oz" placeholder="Location OZ" onChange={handleChange} />

      <input name="category_uz" placeholder="Category UZ" onChange={handleChange} />
      <input name="category_ru" placeholder="Category RU" onChange={handleChange} />
      <input name="category_oz" placeholder="Category OZ" onChange={handleChange} />

      <input name="users" placeholder="Users" onChange={handleChange} />

      <input type="file" multiple onChange={handleFileChange} />

      <button type="submit">Yaratish</button>
    </form>
  );
};

export default KasabaTadbirCreate;
