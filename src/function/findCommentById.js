const findCommentById = (comments, id) => {
  for (const comment of comments) {
    if (comment.id === id) return comment;
    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) return found;
    }
  }
  return null;
};

export default findCommentById;
