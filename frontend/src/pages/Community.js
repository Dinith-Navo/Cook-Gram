import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import PostInteraction from '../components/PostInteraction';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CommunityChat from '../components/CommunityChat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import '../styles/Community.css';

const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState(['all']);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    fetchPosts();
    fetchTrendingPosts();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (inView && hasMore && !loadingMore) {
      loadMorePosts();
    }
    // eslint-disable-next-line
  }, [inView]);

  useEffect(() => {
    if (posts) {
      const filtered = posts.filter(post => {
        const searchLower = searchTerm.toLowerCase();
        const postNameMatch = post.title?.toLowerCase().includes(searchLower);
        const userNameMatch = post.userName?.toLowerCase().includes(searchLower);
        return searchTerm === '' || postNameMatch || userNameMatch;
      });
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts?page=${page}&category=${selectedCategory}`);
      setPosts(response.data.content || response.data);
      setHasMore(response.data.content ? response.data.content.length > 0 : false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingPosts = async () => {
    try {
      const response = await axios.get('/api/posts/trending');
      setTrendingPosts(response.data);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/posts/categories');
      const fetchedCategories = ['all', ...response.data];
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadMorePosts = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await axios.get(`/api/posts?page=${nextPage}&category=${selectedCategory}`);
      const newPosts = response.data.content || response.data;
      if (newPosts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(nextPage);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
    setPosts([]);
    setLoading(true);
    fetchPosts();
  };

  const handlePostUpdate = () => {
    fetchPosts();
    fetchTrendingPosts();
  };

  const handleEditPost = (postId) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleDeletePost = (postId) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(`/api/posts/${postToDelete}`);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      fetchPosts();
    } catch (error) {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const cancelDeletePost = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  // --- Modernized Post Card ---
  const renderPost = (post) => (
    <Card
      key={post.id}
      className="modern-post-tile"
      sx={{
        borderRadius: 5,
        boxShadow: '0 6px 32px 0 rgba(60,72,88,0.10)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        bgcolor: 'background.paper',
        mb: 4,
        color: '#111',
        '&:hover': {
          boxShadow: '0 12px 48px 0 rgba(60,72,88,0.18)',
          transform: 'translateY(-4px) scale(1.01)',
        },
        overflow: 'visible',
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 4 }, pb: 2, color: '#111' }}>
        {/* Header: User Info and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            alt={post.userName}
            src={post.userPicture}
            sx={{
              mr: 2,
              cursor: 'pointer',
              width: 56,
              height: 56,
              border: '3px solid #e3eeff',
              boxShadow: '0 2px 8px rgba(66,165,245,0.10)',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: '0 4px 16px rgba(66,165,245,0.18)' }
            }}
            onClick={() => navigate(`/profile/${post.userId}`)}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                cursor: 'pointer',
                fontWeight: 700,
                color: '#a18738', // Title color changed
                fontSize: 18,
                letterSpacing: 0.2,
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={() => navigate(`/profile/${post.userId}`)}
            >
              {post.userName}
            </Typography>
            <Typography variant="caption" sx={{ color: '#333' }}>
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
          {user && post.userId === user.id && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => handleEditPost(post.id)} size="small" color="primary">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeletePost(post.id)} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 900,
            color: '#000000', // Main post title color changed
            mb: 1,
            letterSpacing: 0.5,
            fontSize: 24,
          }}
        >
          {post.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          paragraph
          sx={{
            color: '#222',
            minHeight: 48,
            fontSize: 17,
            mb: 2,
          }}
        >
          {post.description}
        </Typography>

        {/* Optional Content */}
        {post.content && (
          <Typography
            variant="body2"
            paragraph
            sx={{
              color: '#333',
              mb: 2,
              fontSize: 15,
              background: '#f7fafd',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <Box
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 2,
              background: '#f0f7ff',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrls[0]}
                alt={post.title}
                style={{
                  width: '100%',
                  maxHeight: 340,
                  objectFit: 'cover',
                  borderRadius: 16,
                  border: '2px solid #e3eeff',
                }}
              />
            ) : post.mediaType === 'video' ? (
              <video controls style={{ width: '100%', maxHeight: 340, borderRadius: 16 }}>
                <source src={post.mediaUrls[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </Box>
        )}

        {/* Recipe Details */}
        {(post.cookingTime || post.servings || post.category) && (
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 2 }}>
            {post.cookingTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, color: '#58734d' }}>
                  Cooking Time:
                </Typography>
                <Typography variant="body2" sx={{ color: '#222' }}>
                  {post.cookingTime} min
                </Typography>
              </Box>
            )}
            {post.servings && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 700, color: '#58734d' }}>
                  Servings:
                </Typography>
                <Typography variant="body2" sx={{ color: '#222' }}>
                  {post.servings}
                </Typography>
              </Box>
            )}
            {post.category && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Category:
                </Typography>
                <Typography variant="body2" sx={{ color: '#222' }}>
                  {post.category}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Ingredients */}
        {post.ingredients && post.ingredients.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#e1306c', fontSize: 16 }}>
              Ingredients:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.ingredients.map((ingredient, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: '#f0f7ff',
                    color: '#111',
                    fontWeight: 600,
                    fontSize: 14,
                    border: '1px solid #e3eeff',
                    mb: 1,
                  }}
                >
                  {ingredient}
                  {post.amounts && post.amounts[index] ? ` - ${post.amounts[index]}` : ''}
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Instructions */}
        {post.instructions && post.instructions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700, color: '#e1306c', fontSize: 16 }}>
              Instructions:
            </Typography>
            <Box component="ol" sx={{ pl: 3, mb: 1 }}>
              {post.instructions.map((step, idx) => (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <Typography variant="body2" sx={{ color: '#222', fontSize: 15 }}>
                    {step}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
      <Divider sx={{ my: 0 }} />
      <Box sx={{ px: 3, pb: 2, pt: 1 }}>
        <PostInteraction post={post} onUpdate={handlePostUpdate} />
      </Box>
    </Card>
  );

  return (
    <Box sx={{
      bgcolor: 'linear-gradient(135deg, #f0f7ff 0%, #e3eeff 50%, #dde7ff 100%)',
      minHeight: '100vh',
      py: 4,
      color: '#111'
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              mb: 4,
              color: '#111'
            }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 3 }}>
                <Typography variant="h4" sx={{
                  fontWeight: 800,
                  color: '#1976d2', // Main page title color changed
                  flex: 1
                }}>
                  Community
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                  <TextField
                    size="small"
                    placeholder="Search posts or users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel id="category-select-label" sx={{ color: '#1976d2' }}>Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      value={selectedCategory}
                      label="Category"
                      onChange={handleCategoryChange}
                      sx={{ color: '#1976d2' }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <Divider sx={{ mb: 3, bgcolor: '#bbb' }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : posts.length > 0 ? (
                <Box className="posts-grid" sx={{ mt: 2 }}>
                  {[...filteredPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(renderPost)}
                  {hasMore && (
                    <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 3, gridColumn: '1/-1' }}>
                      {loadingMore ? <CircularProgress /> : null}
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography align="center" sx={{ color: '#111' }}>
                  No posts yet. Be the first to share!
                </Typography>
              )}
            </Paper>
            {/* Optionally, add CommunityChat here or elsewhere */}
          </Grid>
          {/* Trending Posts */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 32, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Featured Chef Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 8,
                  bgcolor: 'background.paper',
                  background: 'linear-gradient(120deg, #f0f7ff 60%, #e3eeff 100%)',
                  p: 3,
                  mb: 2,
                  position: 'relative',
                  overflow: 'visible',
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  color: '#111',
                  '&:hover': {
                    boxShadow: 16,
                    transform: 'scale(1.03)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    sx={{
                      width: 72,
                      height: 72,
                      border: '4px solid #42a5f5',
                      boxShadow: '0 6px 24px rgba(33,150,243,0.18)'
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 900,
                        color: '#1976d2', // Card title color
                        letterSpacing: 1,
                        fontSize: 20
                      }}
                    >
                      Chef of the Week
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: 0.5,
                        color: '#e1306c' // Card subtitle color
                      }}
                    >
                      Alex Gourmet
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    px: 2,
                    py: 1,
                    borderLeft: '5px solid #42a5f5',
                    bgcolor: 'rgba(66,165,245,0.08)',
                    borderRadius: 2,
                    fontStyle: 'italic'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#111',
                      fontSize: 16,
                      fontWeight: 500
                    }}
                  >
                    "Cooking is an art, but all art requires knowing something about the techniques and materials."
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: 20,
                    bgcolor: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    boxShadow: 2,
                    fontSize: 13,
                    color: '#1976d2', // Featured label color
                    fontWeight: 800,
                    letterSpacing: 1,
                    border: '1px solid #e3f2fd'
                  }}
                >
                  Featured
                </Box>
              </Card>

              {/* Quick Cooking Tip Card */}
              <Card sx={{
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                p: 2,
                mb: 2,
                color: '#111',
                transition: 'box-shadow 0.3s, transform 0.3s',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'scale(1.02)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="https://img.icons8.com/color/48/chef-hat.png" alt="Tip" width={28} height={28} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1976d2', fontSize: 16 }}>Quick Cooking Tip</Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15, color: '#111' }}>
                  Always let your meat rest after cooking to keep it juicy and flavorful!
                </Typography>
              </Card>

              {/* Fun Fact Card */}
              <Card sx={{
                borderRadius: 3,
                boxShadow: 4,
                bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                p: 2,
                mb: 2,
                color: '#111',
                transition: 'box-shadow 0.3s, transform 0.3s',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'scale(1.02)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="https://img.icons8.com/color/48/egg.png" alt="Egg" width={26} height={26} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#e1306c', fontSize: 16 }}>Did You Know?</Typography>
                </Box>
                <Typography variant="body2" sx={{ mt: 1, fontSize: 15, color: '#111' }}>
                  The world's largest omelette was made with 145,000 eggs in Portugal!
                </Typography>
              </Card>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {trendingPosts.map((post) => (
                  <Card key={post.id} sx={{
                    borderRadius: 3,
                    boxShadow: 2,
                    cursor: 'pointer',
                    transition: '0.2s',
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#111',
                    '&:hover': {
                      boxShadow: 6,
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-2px)'
                    }
                  }} onClick={() => navigate(`/posts/${post.id}`)}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {post.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#e1306c' }}>
                        {post.likes} likes • {post.comments} comments
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeletePost}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#ffe4e6',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(60,72,88,0.18)',
            margin: 'auto',
            minWidth: 320,
            maxWidth: 400,
            border: '1px solid #e0e7ef',
            backgroundImage: 'none',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            opacity: 1,
            padding: 0
          }
        }}
      >
        <div style={{ padding: 32, textAlign: 'center', background: '#e0e7ef', color: '#111' }}>
          <h2 style={{
            margin: 0,
            marginBottom: 12,
            fontWeight: 800,
            fontSize: 24,
            color: '#e1306c',
            background: 'none',
            padding: 0
          }}>
            Delete Post
          </h2>
          <div style={{
            textAlign: 'center',
            padding: '16px 0',
            fontSize: 17,
            color: '#111',
            background: 'none',
            marginBottom: 16
          }}>
            Are you sure you want to delete this post?
            <br />
            <span style={{ color: '#d32f2f', fontWeight: 700, fontSize: 16 }}>
              This action cannot be undone.
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, background: 'none', marginTop: 16 }}>
            <Button onClick={cancelDeletePost} variant="outlined" sx={{ minWidth: 100, fontWeight: 700, color: '#111', borderColor: '#d32f2f' }}>Cancel</Button>
            <Button onClick={confirmDeletePost} color="error" variant="contained" sx={{ minWidth: 100, fontWeight: 700 }}>Delete</Button>
          </div>
        </div>
      </Dialog>
    </Box>
  );
};

export default Community;