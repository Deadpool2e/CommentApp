import React ,{useState,useEffect} from "react";
import { NavLink } from "react-router-dom";
import { Card, CardContent, Typography, Container, Grid, Button } from "@mui/material";



const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Call the function to fetch all posts when the component mounts
    getAllPosts();
  }, [posts]);

  const getAllPosts = async () => {
    try {
      // Fetch all posts from the backend
      const response = await fetch("/api/getAllPosts");
      const data = await response.json();

      // Update the state with the fetched posts
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <NavLink to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </NavLink>
          </Grid>
        ))}
        {/* Add button or link to create a new post */}
        <Grid item xs={12} sm={6} md={4}>
          <NavLink to="/addpost" style={{ textDecoration: "none" }}>
            <Button variant="outlined" fullWidth>
              Create a New Post
            </Button>
          </NavLink>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
