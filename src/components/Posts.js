import React, { useEffect, useState } from "react";

export const Posts = () => {
  const initialPostData = { title: "", body: "" };

  const [posts, setPosts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newPost, setNewPost] = useState(initialPostData);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newPost),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNewPost(initialPostData);
        setIsFormVisible(false);
        setPosts([data, ...posts]);
      });
  };

  const onCancel = () => {
    setIsFormVisible(false);
    setNewPost(initialPostData);
  };

  return (
    <div>
      {!isFormVisible && (
        <button onClick={() => setIsFormVisible(true)}>Add New Post</button>
      )}
      {isFormVisible && (
        <form onSubmit={onSubmit}>
          <h3>New Post</h3>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <br />
          <textarea
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          ></textarea>
          <br />
          <button type="submit">Submit</button>
          <button onClick={onCancel}>Cancel</button>
        </form>
      )}
      <h1>Posts</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
