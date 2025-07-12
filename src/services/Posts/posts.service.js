const getPosts = async () => {
  const posts = fetch('http://localhost:3000/api/v1/posts')
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.log(error));

  return posts;
};

const getPostById = async (id) => {
  const post = fetch(`http://localhost:3000/api/v1/posts/${id}`)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.log(error));
  return post;
};

const createPost = async (data) => {
  data.author = 'Thắng';
  const post = fetch('http://localhost:3000/api/v1/posts', {
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.log(error));
  return post;
};

const updatePost = async (id, data) => {
  const post = fetch(`http://localhost:3000/api/v1/posts/${id}`, {
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(data),
    method: 'PATCH',
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.log(error));
  return post;
};

const deletePost = async (id) => {
  fetch(`http://localhost:3000/api/v1/posts/${id}`, {
    headers: {
      'Content-type': 'application/json',
    },
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => console.log(error));
};

export { createPost, updatePost, deletePost, getPosts, getPostById };
