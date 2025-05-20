import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import DocIcon from '@mui/icons-material/Description';
import TxtIcon from '@mui/icons-material/TextSnippet';
import PptIcon from '@mui/icons-material/TextFields';

const COLOR_BEIGE = '#cfac78';
const COLOR_GREEN = '#49940c';
const COLOR_PURPLE = '#8a2f7c';

const MAX_FILES = 5;

const LearningMaterialCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    files: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    setError(null);
    setSelectedFiles(files);

    const previews = files.map(file => {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = (file.size / 1024 / 1024).toFixed(2);
      return {
        name: fileName,
        type: fileType,
        size: fileSize,
        isPdf: fileType === 'application/pdf'
      };
    });
    setMediaPreviews(previews);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    selectedFiles.forEach(file => {
      data.append('files', file);
    });

    try {
      await axios.post('/api/study-materials', data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/learning-materials');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload material');
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: COLOR_BEIGE,
        py: 6,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: 5,
            background: '#fff',
            boxShadow: `0 8px 32px 0 ${COLOR_PURPLE}22`,
            border: `2px solid ${COLOR_PURPLE}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/learning-materials')}
              sx={{
                mr: 2,
                color: COLOR_PURPLE,
                borderColor: COLOR_PURPLE,
                borderRadius: 3,
                px: 2,
                py: 1,
                fontWeight: 700,
                background: COLOR_BEIGE,
                '&:hover': {
                  background: COLOR_GREEN,
                  color: COLOR_BEIGE,
                  borderColor: COLOR_GREEN,
                },
              }}
              variant="outlined"
            >
              Back
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: COLOR_PURPLE,
                letterSpacing: 1,
                textShadow: `0 2px 8px ${COLOR_GREEN}44`,
              }}
            >
              Upload Learning Material
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              mt: 2,
            }}
          >
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: COLOR_PURPLE } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontWeight: 600,
                },
              }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
              fullWidth
              variant="outlined"
              InputLabelProps={{ style: { color: COLOR_PURPLE } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontWeight: 500,
                },
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ color: COLOR_GREEN, mb: 1 }}>
                Upload Files
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  mb: 2,
                  color: COLOR_PURPLE,
                  borderColor: COLOR_PURPLE,
                  borderRadius: 3,
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  background: COLOR_BEIGE,
                  '&:hover': {
                    borderColor: COLOR_GREEN,
                    color: COLOR_GREEN,
                    background: COLOR_BEIGE,
                  },
                }}
              >
                Select Files
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  hidden
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
                Maximum {MAX_FILES} files allowed (PDF, DOC, DOCX, TXT, PPT, PPTX)
              </Typography>
              {mediaPreviews.length > 0 && (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mt: 2,
                    borderRadius: 3,
                    background: COLOR_BEIGE,
                    borderColor: COLOR_GREEN,
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom sx={{ color: COLOR_PURPLE, fontWeight: 700 }}>
                    Selected Files ({mediaPreviews.length})
                  </Typography>
                  <List>
                    {mediaPreviews.map((file, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: '#fff',
                          boxShadow: 1,
                          '&:hover': {
                            bgcolor: COLOR_BEIGE,
                          },
                        }}
                        secondaryAction={
                          <Tooltip title="Remove file">
                            <IconButton
                              edge="end"
                              onClick={() => handleRemoveFile(index)}
                              sx={{
                                color: COLOR_PURPLE,
                                '&:hover': {
                                  bgcolor: COLOR_GREEN,
                                  color: COLOR_BEIGE,
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {file.isPdf ? (
                                <PdfIcon sx={{ color: '#FF5252' }} />
                              ) : file.type.includes('word') ? (
                                <DocIcon sx={{ color: '#2196F3' }} />
                              ) : file.type.includes('text') ? (
                                <TxtIcon sx={{ color: '#4CAF50' }} />
                              ) : (
                                <PptIcon sx={{ color: '#FF9800' }} />
                              )}
                              <Typography variant="body2" sx={{ fontWeight: 600, color: COLOR_PURPLE }}>
                                {file.name}
                              </Typography>
                              <Chip
                                label={`${file.size} MB`}
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor: COLOR_GREEN,
                                  color: COLOR_BEIGE,
                                  fontWeight: 700,
                                }}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              disabled={uploading || selectedFiles.length === 0}
              sx={{
                mt: 2,
                fontWeight: 700,
                fontSize: 18,
                py: 1.5,
                background: COLOR_PURPLE,
                color: COLOR_BEIGE,
                borderRadius: 3,
                boxShadow: `0 4px 16px ${COLOR_PURPLE}22`,
                '&:hover': {
                  background: COLOR_GREEN,
                  color: COLOR_BEIGE,
                },
                transition: 'all 0.3s',
              }}
            >
              {uploading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: COLOR_BEIGE }} />
                  Uploading...
                </Box>
              ) : (
                'Upload Material'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LearningMaterialCreate;