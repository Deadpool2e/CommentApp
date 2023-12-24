import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Stack,
  Box,
  Container,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import CommentArea from "./CommentArea";
import { UserContext } from "../App";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const PostPage = () => {
  const { state, dispatch } = useContext(UserContext);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // Fetch comments from API
  const [post, setpost] = useState(); // Fetch comments from API
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { postId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post data
        const postResponse = await axios.get(`/api/getPost/${postId}`);
        const postData = postResponse.data; // Use .data to get the response data
        setpost(postData);

        // Fetch comments data
        const commentsResponse = await axios.get(`/api/getComments/${postId}`);
        const commentsData = commentsResponse.data; // Use .data to get the response data
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error, e.g., show an error message to the user
      }
    };
    fetchData();
  }, [postId]);


  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }

    // Check if commentText is not empty
    if (!commentText.trim()) {
      setErrorMessage("Comment content is empty.");
      setErrorOpen(true);
      return;
    }

    try {
      // Assuming you have a function to get the logged-in user's ID
      const userId = state.userData.sno;

      // Send a POST request to your backend endpoint using Axios
      const response = await axios.post("/api/addComment", {
        user_id: userId,
        user_name: state.userData.name,
        post_id: postId,
        parent_comment_id: null,
        content: commentText,
      });

      if (response.status === 201) {
        // Comment added successfully
        setCommentText("");
        // You might want to refresh the list of comments or update the UI in some way
        try {
          const updatedCommentsResponse = await axios.get(
            `/api/getComments/${postId}`
          );
          const updatedCommentsData = updatedCommentsResponse.data; // Use .data to get the response data
          // Update the state with the new comments
          setComments(updatedCommentsData);
        } catch (error) {
          console.error("Error fetching updated comments:", error);
          // Handle the error, e.g., show an error message to the user
        }
      } else if (response.status === 401) {
        // User is not logged in, handle accordingly
        console.log("User is not logged in.");
      } else {
        // Handle other status codes
        console.error("Failed to add a comment.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box mt={2}>
      {post && (
        <Box mb={2}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
        </Box>
      )}

      <form onSubmit={handleCommentSubmit}>
        <Stack spacing={1} direction="row">
          <TextField
            label="Add a comment"
            multiline
            variant="outlined"
            fullWidth
            size="small" // Set the size to small
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            {" "}
            {/* Set the size to small */}
            Add Comment
          </Button>
        </Stack>
      </form>

      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <CommentArea
              comment={comment}
              setComments={setComments}
              setErrorMessage={setErrorMessage}
              setErrorOpen={setErrorOpen}
              setSuccessMessage={setSuccessMessage}
              setSuccessOpen={setSuccessOpen}
              postId={postId}
              level={1}
            />
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrorOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccessOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PostPage;
