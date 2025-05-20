import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const COLOR_BEIGE = '#cfac78';
const COLOR_GREEN = '#49940c';
const COLOR_PURPLE = '#8a2f7c';

const MAX_IMAGES = 3;
const MAX_VIDEO_DURATION_SECONDS = 30;

const PostEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    media: [],
    mediaType: '',
    ingredients: [''],
    amounts: [''],
    instructions: [''],
    cookingTime: '',
    servings: ''
  });
  const [mediaPreviews, setMediaPreviews] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        const post = response.data;

        if (user.id !== post.userId) {
          navigate('/posts');
          return;
        }

        setFormData({
          title: post.title,
          description: post.description,
          content: post.content || '',
          media: [],
          mediaType: post.mediaType || '',
          ingredients: post.ingredients || [''],
          amounts: post.amounts || [''],
          instructions: post.instructions || [''],
          cookingTime: post.cookingTime || '',
          servings: post.servings || ''
        });
        setMediaPreviews(post.mediaUrls || []);
      } catch (error) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // eslint-disable-next-line
  }, [id, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    setMediaError('');

    if (formData.media.length + files.length > MAX_IMAGES) {
      setMediaError(`Maximum ${MAX_IMAGES} media files allowed`);
      return;
    }

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          media: [...prev.media, file]
        }));
        setMediaPreviews(prev => [...prev, { url: URL.createObjectURL(file), type: 'image' }]);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function () {
          if (this.duration > MAX_VIDEO_DURATION_SECONDS) {
            setMediaError('Videos must be 30 seconds or less');
            return;
          }
          setFormData(prev => ({
            ...prev,
            media: [...prev.media, file]
          }));
          setMediaPreviews(prev => [...prev, { url: URL.createObjectURL(file), type: 'video' }]);
        };
        video.src = URL.createObjectURL(file);
      } else {
        setMediaError('Invalid file type. Please upload images or videos only.');
        return;
      }
    }
  };

  const handleRemoveMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
    setMediaPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleArrayInputChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      if (formData.content) {
        formDataToSend.append('content', formData.content);
      }

      if (formData.ingredients && formData.ingredients.length > 0) {
        const validIngredients = formData.ingredients.filter(ingredient => ingredient.trim() !== '');
        validIngredients.forEach(ingredient => {
          formDataToSend.append('ingredients', ingredient);
        });
      }

      if (formData.amounts && formData.amounts.length > 0) {
        const validAmounts = formData.amounts.filter(amount => amount.trim() !== '');
        validAmounts.forEach(amount => {
          formDataToSend.append('amounts', amount);
        });
      }

      if (formData.instructions && formData.instructions.length > 0) {
        const validInstructions = formData.instructions.filter(instruction => instruction.trim() !== '');
        validInstructions.forEach(instruction => {
          formDataToSend.append('instructions', instruction);
        });
      }

      if (formData.cookingTime) {
        formDataToSend.append('cookingTime', formData.cookingTime);
      }

      if (formData.servings) {
        formDataToSend.append('servings', formData.servings);
      }

      if (formData.media && formData.media.length > 0) {
        formData.media.forEach(file => {
          formDataToSend.append('media', file);
        });
      }

      await axios.put(`/api/posts/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/posts/${id}`);
    } catch (error) {
      setError(error.response?.data || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: COLOR_BEIGE,
        minHeight: '100vh',
        py: 6,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 3,
            boxShadow: `0 8px 32px 0 ${COLOR_PURPLE}22`,
            background: '#fff',
            border: `2px solid ${COLOR_PURPLE}`,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: COLOR_PURPLE,
                mb: 2,
                textAlign: 'center',
                letterSpacing: 1,
              }}
            >
              Edit Recipe
            </Typography>
            <Divider sx={{ mb: 3, borderColor: COLOR_BEIGE, borderBottomWidth: 3 }} />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Recipe Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    variant="outlined"
                    InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Short Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    multiline
                    minRows={2}
                    variant="outlined"
                    InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Full Content (optional)"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    minRows={3}
                    variant="outlined"
                    InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, color: COLOR_GREEN }}>
                    Media (Images/Videos)
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      mb: 1,
                      color: COLOR_PURPLE,
                      borderColor: COLOR_PURPLE,
                      '&:hover': {
                        borderColor: COLOR_GREEN,
                        color: COLOR_GREEN,
                        background: COLOR_BEIGE,
                      },
                    }}
                  >
                    Upload Media
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                    />
                  </Button>
                  {mediaError && <Alert severity="error" sx={{ mb: 1 }}>{mediaError}</Alert>}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                    {mediaPreviews.map((media, idx) => (
                      <Box key={idx} sx={{ position: 'relative' }}>
                        {media.type === 'image' ? (
                          <img
                            src={media.url || media}
                            alt="preview"
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: `2px solid ${COLOR_BEIGE}`,
                            }}
                          />
                        ) : (
                          <video
                            src={media.url || media}
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 8,
                              border: `2px solid ${COLOR_BEIGE}`,
                            }}
                            controls
                          />
                        )}
                        <IconButton
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bgcolor: COLOR_BEIGE,
                            color: COLOR_PURPLE,
                            '&:hover': { bgcolor: COLOR_GREEN, color: '#fff' },
                          }}
                          onClick={() => handleRemoveMedia(idx)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cooking Time (minutes)"
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Servings"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    type="number"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, color: COLOR_GREEN }}>
                    Ingredients
                  </Typography>
                  <List>
                    {formData.ingredients.map((ingredient, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <TextField
                          label={`Ingredient ${idx + 1}`}
                          value={ingredient}
                          onChange={e => handleArrayInputChange(idx, e.target.value, 'ingredients')}
                          sx={{ mr: 2 }}
                          InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                        />
                        <TextField
                          label={`Amount ${idx + 1}`}
                          value={formData.amounts[idx] || ''}
                          onChange={e => handleArrayInputChange(idx, e.target.value, 'amounts')}
                          sx={{ mr: 2 }}
                          InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                        />
                        <IconButton
                          onClick={() => removeArrayItem(idx, 'ingredients')}
                          disabled={formData.ingredients.length === 1}
                          sx={{
                            color: COLOR_PURPLE,
                            '&:hover': { color: COLOR_GREEN },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem('ingredients')}
                    sx={{
                      mt: 1,
                      color: COLOR_GREEN,
                      borderColor: COLOR_GREEN,
                      borderWidth: 2,
                      borderStyle: 'solid',
                      background: COLOR_BEIGE,
                      '&:hover': {
                        background: COLOR_GREEN,
                        color: COLOR_BEIGE,
                        borderColor: COLOR_PURPLE,
                      },
                    }}
                  >
                    Add Ingredient
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, color: COLOR_GREEN }}>
                    Cooking Steps
                  </Typography>
                  <List>
                    {formData.instructions.map((step, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <TextField
                          label={`Step ${idx + 1}`}
                          value={step}
                          onChange={e => handleArrayInputChange(idx, e.target.value, 'instructions')}
                          sx={{ mr: 2 }}
                          InputLabelProps={{ style: { color: COLOR_PURPLE } }}
                        />
                        <IconButton
                          onClick={() => removeArrayItem(idx, 'instructions')}
                          disabled={formData.instructions.length === 1}
                          sx={{
                            color: COLOR_PURPLE,
                            '&:hover': { color: COLOR_GREEN },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => addArrayItem('instructions')}
                    sx={{
                      mt: 1,
                      color: COLOR_GREEN,
                      borderColor: COLOR_GREEN,
                      borderWidth: 2,
                      borderStyle: 'solid',
                      background: COLOR_BEIGE,
                      '&:hover': {
                        background: COLOR_GREEN,
                        color: COLOR_BEIGE,
                        borderColor: COLOR_PURPLE,
                      },
                    }}
                  >
                    Add Cooking Step
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={saving}
                    sx={{
                      mt: 2,
                      fontWeight: 700,
                      fontSize: 18,
                      py: 1.5,
                      background: COLOR_PURPLE,
                      color: COLOR_BEIGE,
                      '&:hover': {
                        background: COLOR_GREEN,
                        color: COLOR_BEIGE,
                      },
                    }}
                    startIcon={saving ? <CircularProgress size={24} sx={{ color: COLOR_BEIGE }} /> : null}
                  >
                    {saving ? 'Updating...' : 'Update Recipe'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default PostEdit;