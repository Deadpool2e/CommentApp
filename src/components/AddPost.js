import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPost = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const navigate = useNavigate();

  const handleCreatePost =async (e) => {
    e.preventDefault();

    console.log("Post Data:",{ title: postTitle, content: postContent } );
    let response;
    try {
        response = await axios.post('/api/addPost', { title: postTitle, content: postContent });

        // Handle the response as needed
        console.log('Post Successful:', response.data);
        setPostContent("");
        setPostTitle("")
        navigate(`/posts/${response.data.id}`);

    } catch (error) {
      console.error('Post Error:', error.response ? error.response.data : error.message);
    }

    
    // navigate.push("/");
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" component="div" gutterBottom>
        Create a New Post
      </Typography>
      <Box>
        <TextField
          label="Post Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
        />
        <TextField
          label="Post Content"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleCreatePost}>
          Create Post
        </Button>
      </Box>
    </Container>
  );
};

export default AddPost;
