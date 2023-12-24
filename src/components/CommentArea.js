import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  IconButton,
  Divider,
  Avatar,
  Paper,
  Typography,
  Box,
  Button,
  Badge,
} from "@mui/material";
import { UserContext } from "../App";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import axios from "axios";
import ReportIcon from '@mui/icons-material/Report';

const CommentArea = ({
  comment,
  setComments,
  setErrorOpen,
  setErrorMessage,
  setSuccessMessage,
  setSuccessOpen,
  postId,
  level
}) => {
  const { state, dispatch } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.content);
  const [username, setUsername] = useState(comment.user_name);
  const [upvote, setUpvote] = useState(comment.upvotes);
  const [downvote, setDownvote] = useState(comment.downvotes);
  const [isEditable, setIsEditable] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState(comment.replies);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };

  useEffect(() => {
    // Calculate the timestamp when the comment will no longer be editable
    const commentTime = new Date(comment.created_at);
    const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds
    const editableUntil = commentTime.getTime() + fiveMinutesInMillis;
    const now = new Date().getTime();
    if (now <= editableUntil) {
      setIsEditable(true);
    }
    // Set up a timer to check if the comment is still editable
    const timerId = setInterval(() => {
      const now = new Date().getTime();
      if (now > editableUntil) {
        setIsEditable(false);
        clearInterval(timerId);
      }
    }, 1000); // Check every second

    return () => {
      // Clean up the timer when the component unmounts
      clearInterval(timerId);
    };
  }, [comment.created_at]);

  const handleEdit = () => {
    // Check if the comment is still editable
    if (!isEditable && !(state.userData && state.userData.is_moderator)) {
      setErrorMessage(
        "Comment can only be edited within 5 minutes of creation."
      );
      setErrorOpen(true);
      return;
    }

    setIsEditing(true);
  };

  const onUpvote = async () => {
    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }

    try {
      // Send a POST request to your backend endpoint to handle upvoting
      const response = await axios.post(`/api/upvoteComment`, {
        comment_id: comment.id,
        user_id: state.userData.sno,
        comment_user_id: comment.user_id
      });

      if (response.status === 200) {
        // Update the UI or state to reflect the upvote
        // You might want to refresh the comments or update the UI in some way
        // For example, you can fetch the updated comments and set the state
        const updatedUpvote = await axios.get(
          `/api/updatedUpvote/${comment.id}`
        );
        const updatedDownvote = await axios.get(
          `/api/updatedDownvote/${comment.id}`
        );

        console.log(updatedDownvote, updatedUpvote);
        setUpvote(updatedUpvote.data.upvotes);
        setDownvote(updatedDownvote.data.downvotes);
      } else {
        console.error("Failed to upvote comment.");
      }
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const onDownvote = async () => {
    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }

    try {
      // Send a POST request to your backend endpoint to handle downvoting
      const response = await axios.post("/api/downvoteComment", {
        comment_id: comment.id,
        user_id: state.userData.sno,
      });

      if (response.status === 200) {
        const updatedUpvote = await axios.get(
          `/api/updatedUpvote/${comment.id}`
        );
        const updatedDownvote = await axios.get(
          `/api/updatedDownvote/${comment.id}`
        );

        setUpvote(updatedUpvote.data.upvotes);
        setDownvote(updatedDownvote.data.downvotes);
        // Update the UI or state to reflect the downvote
        // You might want to refresh the comments or update the UI in some way
        // For example, you can fetch the updated comments and set the state
      } else {
        console.error("Failed to downvote comment.");
      }
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  useEffect(() => {
    const getReplies = async () => {
      try {
        const updatedRepliesResponse = await axios.get(
          `/api/getReplies/${comment.id}`
        );
        const updatedRepliesData = updatedRepliesResponse.data; // Use .data to get the response data
        setReplies(updatedRepliesData);
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };

    getReplies();
  }, [comment]);

  const handleDelete = async () => {
    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }  
    if(replies.length > 0){
      try {
        // Make an API call to delete the comment
        const response = await axios.put(`/api/deleteupdateComment`, {        
            comment_id: comment.id,
            user_id: state.userData.sno,
        });

        console.log(response);

        if (response.status === 201){
          setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id ? { ...c, content: "This comment was deleted." } : c
          )
        );
        }
         else {
          console.error("Failed to delete comment.");
        }
      } catch (error) {
        if (error.response.status === 401) {
          setErrorMessage("You are not allowed to delete this comment.");
          setErrorOpen(true);
          return;
        }
        console.error("Error deleting comment:", error);
      }
    }
    else{
      try {
        // Make an API call to delete the comment
        const response = await axios.put(`/api/deleteComment`, {        
            comment_id: comment.id,
            user_id: state.userData.sno,
            is_moderator: state.userData.is_moderator,
          
        });

        console.log(response);

        if (response.status === 200) {
          setComments((prevComments) =>
            prevComments.filter((c) => c.id !== comment.id)
          );
        } else if (response.status === 201){
          setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id ? { ...c, content: "This comment was deleted by a moderator." } : c
          )
        );
        }
         else {
          console.error("Failed to delete comment.");
        }
      } catch (error) {
        if (error.response.status === 401) {
          setErrorMessage("You are not allowed to delete this comment.");
          setErrorOpen(true);
          return;
        }
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Make a PUT request to update the comment
      const response = await axios.put(`/api/updateComment`, {
        comment_id: comment.id,
        edited_text: editedText,
        user_id: state.userData.sno,
        is_moderator: state.userData.is_moderator
      });

      console.log(response);

      if (response.status === 200) {
        // Comment update successful
        // You may want to refresh the comments or update the UI in some way
        // For example, you can fetch the updated comments and set the state

        // Update the local state with the edited text
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id ? { ...c, content: editedText } : c
          )
        );

        // Exit edit mode
        setIsEditing(false);
      } else {
        console.error("Failed to update comment.");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage("You are not allowed to Edit this comment.");
        setErrorOpen(true);
        return;
      }
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.content);
  };

  const handleReplySubmit = async () => {
    

    try {
      const userId = state.userData.sno;

      // Send a POST request to your backend endpoint using Axios
      const response = await axios.post("/api/addComment", {
        user_id: userId,
        post_id: postId,
        parent_comment_id: comment.id,
        content: replyText,
        user_name: state.userData.name
      });

      if (response.status === 201) {
        // Reply added successfully
        setReplyText(""); // Clear the reply text field
        handleToggleReply();
        // You might want to refresh the list of replies or update the UI in some way
        // For example, you can fetch the updated replies and set the state
        const updatedRepliesResponse = await axios.get(
          `/api/getReplies/${comment.id}`
        );
        const updatedRepliesData = updatedRepliesResponse.data; // Use .data to get the response data
        setReplies(updatedRepliesData);
      } else if (response.status === 401) {
        // User is not logged in, handle accordingly
        console.log("User is not logged in.");
      } else {
        // Handle other status codes
        console.error("Failed to add a reply.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onReply = () => {
    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }
    if(level>5){
      setErrorMessage("Maximum five levels of replies can be there on a top-level comment.");
      setErrorOpen(true);
      return;
    }
    setIsReplyOpen(true);
  };

  const handleToggleReply = () => {
    setIsReplyOpen(!isReplyOpen);
  };

  const renderReplies = (replies) => {
    if (!replies || replies.length === 0 || !showReplies || level>5) {
      return null;
    }

    return (
      <Box sx={{ marginLeft: 2 }}>
        {replies.map((reply, index) => (
          <Box
            key={reply.id}
            sx={{ display: "flex", flexDirection: "column", marginBottom: 2 }}
          >
            <SubdirectoryArrowRightIcon />
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: 5 }}>
              <CommentArea
                comment={reply}
                setComments={setComments}
                setErrorOpen={setErrorOpen}
                setErrorMessage={setErrorMessage}
                postId={postId}
                level={level+1}
              />
            </Box>
            {index !== replies.length - 1 && <Divider />}
          
          </Box>
        ))}
      </Box>
    );
  };

  const handleHide = async ()=>{
    if (!state.isLoggedIn) {
      setErrorMessage("User is not logged in.");
      setErrorOpen(true);
      return;
    }

    try {
      // Make an API call to hide/unhide the comment
      const response = await axios.post(`/api/hideComment/${comment.id}`);
      console.log(response);

      if (response.status === 200) {
        
          setComments((prevComments) =>
            prevComments.map((c) =>
              c.id === comment.id
                ? { ...c, content: "This comment is hidden by the moderator." }
                : c
            )
          );
        
      } else {
        console.error("Failed to hide comment.");
      }
    } catch (error) {
      console.error("Error hide comment:", error);
    }
  };

  const handleReport = async () => {
    try {
      const response = await axios.post("/api/reportComment", {
        comment_id: comment.id,
        user_id: state.userData.sno,
      });

      if (response.status === 200) {
        // Comment reported successfully
        setSuccessMessage("You have reported this comment.");
        setSuccessOpen(true);
        console.log("Comment reported successfully");
      } else {
        console.error("Failed to report comment.");
      }
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage("You have already reported this comment.");
        setErrorOpen(true);
      } else if(error.response.status ===403){
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === comment.id ? { ...c, content: "This comment is hidden because of spam." } : c
          )
        );
        
      } 
      else {
        console.error("Error reporting comment:", error);
      }
    }
  };



  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Avatar>
          <AccountCircleIcon />
        </Avatar>
        <Box ml={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            {username || "User"}
          </Typography>
          {comment.is_hidden ? (
      <Typography variant="body1" color="grey">
        {comment.content}
      </Typography>
    ) : comment.is_spam ? (
      <Typography variant="body1" color="grey">
        This comment is hidden because of spam.
      </Typography>
    ) : (
      <Typography variant="body1">{comment.content}</Typography>
    )}
        </Box>
      </Box>
      {isEditing ? (
        <>
          <TextField
            multiline
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <Button color="primary" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button color="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Box mt={2} display="flex" alignItems="center">
            <Button color="primary" onClick={onUpvote}>
              <ThumbUpIcon sx={{ marginRight: 1 }} /> {upvote}
            </Button>
            <Button color="primary" onClick={onDownvote}>
              <ThumbDownIcon sx={{ marginRight: 1 }} /> {downvote}
            </Button>
            <Button color="primary" onClick={onReply}>
              <ReplyIcon sx={{ marginRight: 1 }} /> Reply
            </Button>
            {(isEditable || (state.userData && state.userData.is_moderator === 1) )&& (
              <IconButton color="primary" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            )}
            {(state.userData && state.userData.is_moderator===1 ) && (
              
            (comment.is_hidden || (state.userData && comment.user_id===state.userData.sno)) ? "" : (
              <Button color="primary" onClick={handleHide}>Hide</Button>
              )
            
            )}

            <IconButton color="secondary" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>

            {(state.userData && comment.user_id!==state.userData.sno) &&
              <IconButton color="primary" onClick={handleReport}>
              <ReportIcon />
            </IconButton>
            }
          </Box>
        </>
      )}
      <Divider sx={{ marginTop: 2 }} />

      {replies && replies.length > 0 && level<6 && (
        <Button color="primary" onClick={handleToggleReplies}>
          {showReplies ? "Hide Replies" : "Show Replies"}
        </Button>
      )}
      {showReplies && renderReplies(replies)}

      {isReplyOpen  && (
        <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              multiline
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="Add a reply"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
          </Box>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button color="primary" onClick={handleReplySubmit}>
              Reply
            </Button>
            <Button color="primary" onClick={handleToggleReply}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentArea;
