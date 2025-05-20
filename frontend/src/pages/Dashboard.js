import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';

const COLOR_BEIGE = '#cfac78';
const COLOR_GREEN = '#49940c';
const COLOR_PURPLE = '#8a2f7c';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [cookingTips, setCookingTips] = useState([]);

  useEffect(() => {
    fetchCookingTips();
  }, []);

  const fetchCookingTips = async () => {
    setCookingTips([
      { tip: "Let meat rest after cooking for juicier results.", author: "Chef Gordon" },
      { tip: "Use fresh herbs to brighten up any dish.", author: "Chef Priya" },
      { tip: "Taste as you cook to adjust seasoning.", author: "Chef Alex" },
      { tip: "Clean as you go to keep your workspace organized.", author: "Chef Mei" },
    ]);
  };

  useEffect(() => {
    fetchTrendingRecipes();
    fetchDailyChallenge();
    fetchAchievements();
  }, []);

  const fetchTrendingRecipes = async () => {
    try {
      const response = await axios.get('/api/posts/trending');
      setTrendingRecipes(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
    }
  };

  const fetchDailyChallenge = async () => {
    setDailyChallenge({
      title: "Today's Cooking Challenge",
      description: "Create a fusion dish combining two different cuisines!",
      participants: 158,
      deadline: "8 hours left"
    });
  };

  const fetchAchievements = async () => {
    setAchievements([
      { title: 'Recipe Master', progress: 70, total: 100, description: 'Create 100 recipes' },
      { title: 'Community Star', progress: 45, total: 50, description: '50 recipe reviews' },
      { title: 'Trending Chef', progress: 8, total: 10, description: 'Get 10 recipes trending' }
    ]);
  };

  // UI starts here
  return (
    <Box sx={{ py: 4, minHeight: '100vh', background: COLOR_BEIGE }}>
      <Container maxWidth="xl">
        {/* Greeting */}
        <Box
          sx={{
            mb: 5,
            p: 4,
            borderRadius: 4,
            background: COLOR_PURPLE,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              color: COLOR_BEIGE,
              mb: 1,
              textShadow: `0 2px 8px ${COLOR_GREEN}44`,
            }}
          >
            {`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${user?.name?.split(' ')[0] || 'Chef'}! 👋`}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: COLOR_BEIGE }}>
            What delicious recipe will you create today?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Community Spotlight */}
              <Card
                sx={{
                  background: COLOR_GREEN,
                  color: COLOR_BEIGE,
                  borderRadius: 4,
                  boxShadow: 4,
                  overflow: 'visible',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ fontSize: 44, mr: 2, color: COLOR_BEIGE }} />
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      Join Our Vibrant Community!
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.93 }}>
                    Connect with <b>5,000+</b> food enthusiasts, share recipes, and learn from the best!
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/community')}
                    sx={{
                      bgcolor: COLOR_PURPLE,
                      color: COLOR_BEIGE,
                      px: 4,
                      py: 1.5,
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      boxShadow: `0 8px 24px ${COLOR_PURPLE}33`,
                      '&:hover': {
                        bgcolor: COLOR_BEIGE,
                        color: COLOR_PURPLE,
                        boxShadow: `0 12px 32px ${COLOR_PURPLE}66`,
                      },
                      transition: 'all 0.3s',
                    }}
                    startIcon={<PeopleIcon />}
                  >
                    Explore Community
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: COLOR_BEIGE,
                }}
              >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: COLOR_GREEN }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { title: 'Share Recipe', icon: <RestaurantIcon />, path: '/posts/create', color: COLOR_PURPLE },
                    { title: 'Browse Recipes', icon: <LocalDiningIcon />, path: '/community', color: COLOR_GREEN },
                    { title: 'Learning Hub', icon: <BookmarkIcon />, path: '/learning-materials', color: COLOR_BEIGE },
                    { title: 'My Favorites', icon: <StarIcon />, path: '/profile', color: COLOR_PURPLE },
                  ].map((action) => (
                    <Grid item xs={6} sm={3} key={action.title}>
                      <Tooltip title={action.title}>
                        <Card
                          sx={{
                            cursor: 'pointer',
                            height: 120,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            boxShadow: 2,
                            background: '#fff',
                            '&:hover': {
                              background: action.color + '22',
                              transform: 'scale(1.04)',
                              boxShadow: 4,
                            },
                            transition: 'all 0.2s',
                          }}
                          onClick={() => navigate(action.path)}
                        >
                          <Box sx={{ color: action.color, mb: 1, fontSize: 32 }}>{action.icon}</Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLOR_PURPLE }}>
                            {action.title}
                          </Typography>
                        </Card>
                      </Tooltip>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Daily Challenge & Cooking Tips */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      height: '100%',
                      background: COLOR_BEIGE,
                      color: COLOR_PURPLE,
                      borderRadius: 4,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <WhatshotIcon sx={{ fontSize: 40, mb: 1, color: COLOR_GREEN }} />
                          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                            {dailyChallenge?.title || "Today's Challenge"}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 2, opacity: 0.93 }}>
                            {dailyChallenge?.description || 'Create a fusion dish combining Asian and Mediterranean cuisines!'}
                          </Typography>
                          <Chip
                            label={`${dailyChallenge?.participants || 158} participants`}
                            size="small"
                            sx={{ backgroundColor: COLOR_GREEN, color: COLOR_BEIGE, fontWeight: 600 }}
                          />
                        </Box>
                        <Chip
                          label={dailyChallenge?.deadline || "8 hours left"}
                          size="small"
                          sx={{ backgroundColor: COLOR_PURPLE, color: COLOR_BEIGE, fontWeight: 600 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      height: '100%',
                      background: COLOR_PURPLE,
                      borderRadius: 4,
                      boxShadow: 3,
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ color: COLOR_BEIGE, fontWeight: 700 }}>
                        Cooking Tips of the Day
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {cookingTips.map((tip, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ mb: 1, fontStyle: 'italic', color: COLOR_BEIGE }}>
                              "{tip.tip}"
                            </Typography>
                            <Typography variant="caption" sx={{ color: COLOR_GREEN }}>
                              - {tip.author}
                            </Typography>
                            {index < cookingTips.length - 1 && <Divider sx={{ mt: 2, borderColor: COLOR_BEIGE }} />}
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Trending Recipes */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: COLOR_BEIGE,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: COLOR_GREEN }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_GREEN }}>
                    Trending Recipes
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {trendingRecipes.map((recipe, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 3,
                          boxShadow: 2,
                          '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 4 },
                          transition: 'all 0.2s',
                        }}
                        onClick={() => navigate(`/posts/${recipe.id}`)}
                      >
                        <CardMedia
                          component="img"
                          height="140"
                          image={recipe.mediaUrls?.[0] || 'https://source.unsplash.com/random/?food'}
                          alt={recipe.title}
                          sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, color: COLOR_PURPLE }}>
                            {recipe.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Avatar
                              src={recipe.userPicture}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            <Typography variant="caption" sx={{ color: COLOR_GREEN }}>
                              {recipe.userName}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Achievements */}
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: COLOR_BEIGE,
                  boxShadow: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmojiEventsIcon sx={{ mr: 1, color: COLOR_GREEN }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_PURPLE }}>
                    Your Achievements
                  </Typography>
                </Box>
                {achievements.map((achievement, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLOR_PURPLE }}>
                        {achievement.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: COLOR_GREEN }}>
                        {achievement.progress}/{achievement.total}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(achievement.progress / achievement.total) * 100}
                      sx={{
                        mb: 1,
                        height: 8,
                        borderRadius: 4,
                        background: '#fff',
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, ${COLOR_GREEN} 0%, ${COLOR_PURPLE} 100%)`,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: COLOR_GREEN }}>
                      {achievement.description}
                    </Typography>
                  </Box>
                ))}
              </Paper>

              {/* Quick Stats */}
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: COLOR_PURPLE,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: COLOR_BEIGE }}>
                  Your Cooking Journey
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR_BEIGE }}>28</Typography>
                      <Typography variant="body2" sx={{ color: COLOR_GREEN }}>Recipes</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR_BEIGE }}>142</Typography>
                      <Typography variant="body2" sx={{ color: COLOR_GREEN }}>Followers</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR_BEIGE }}>45</Typography>
                      <Typography variant="body2" sx={{ color: COLOR_GREEN }}>Following</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: COLOR_BEIGE }}>89</Typography>
                      <Typography variant="body2" sx={{ color: COLOR_GREEN }}>Likes</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
// ...end of file...