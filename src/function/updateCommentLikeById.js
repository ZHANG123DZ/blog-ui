function updateCommentLikeById(comments, commentId) {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const isLiked = comment.isLiked;
      return {
        ...comment,
        isLiked: !isLiked,
        likes: isLiked ? Number(comment.likes) - 1 : Number(comment.likes) + 1,
      };
    }

    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentLikeById(comment.replies, commentId),
      };
    }

    return comment;
  });
}

export default updateCommentLikeById;
