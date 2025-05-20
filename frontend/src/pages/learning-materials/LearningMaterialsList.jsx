import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
  CircularProgress,
  Paper,
  Tooltip,
  Avatar,
  Badge,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Article as TxtIcon,
  Slideshow as PptIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';

const LearningMaterialsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const fileTypeIcons = {
    pdf: <PdfIcon sx={{ color: '#FF5252' }} />,
    doc: <DocIcon sx={{ color: '#2196F3' }} />,
    txt: <TxtIcon sx={{ color: '#4CAF50' }} />,
    ppt: <PptIcon sx={{ color: '#FF9800' }} />,
  };

  const filters = [
    { value: 'all', label: 'All Materials' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'doc', label: 'Word Documents' },
    { value: 'txt', label: 'Text Files' },
    { value: 'ppt', label: 'Presentations' },
  ];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('/api/study-materials', {
        withCredentials: true
      });
      setMaterials(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching materials:', err);
      setLoading(false);
    }
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (filter) => {
    if (filter && filter !== selectedFilter) {
      setSelectedFilter(filter);
    }
    setFilterAnchorEl(null);
  };

  const handleMenuClick = (event, material) => {
    event.stopPropagation();
    setSelectedMaterial(material);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDelete = async (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        await axios.delete(`/api/study-materials/${materialId}`, {
          withCredentials: true
        });
        setMaterials(materials.filter(m => m.id !== materialId));
      } catch (err) {
        console.error('Error deleting material:', err);
      }
    }
    handleMenuClose();
  };

  const handleDownload = (url) => {
    const backendUrl = `http://localhost:8080${url}`;
    window.open(backendUrl, '_blank');
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || material.fileType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getFileIcon = (fileType, size = 32) => {
    const icon = fileTypeIcons[fileType] || <DocIcon sx={{ color: '#757575' }} />;
    return React.cloneElement(icon, { sx: { fontSize: size, ...icon.props.sx } });
  };

  const renderFileList = (fileUrls, material) => (
    <Box sx={{ mt: 2 }}>
      {fileUrls.map((url, index) => {
        const fileName = url.split('/').pop();
        const fileExtension = fileName.split('.').pop().toLowerCase();

        return (
          <Paper
            key={index}
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'box-shadow 0.2s, border 0.2s',
              '&:hover': {
                boxShadow: 3,
                borderColor: 'primary.light',
                bgcolor: 'background.paper',
              }
            }}
          >
            <Tooltip title={fileExtension.toUpperCase()} arrow>
              <Box>{getFileIcon(fileExtension, 28)}</Box>
            </Tooltip>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName}
              </Typography>
            </Box>
            <Tooltip title="Download" arrow>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(url)}
                sx={{
                  color: 'success.main',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  minWidth: 0,
                  '&:hover': {
                    bgcolor: 'success.lighter',
                  }
                }}
              >
                Download
              </Button>
            </Tooltip>
          </Paper>
        );
      })}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box
        sx={{
          mb: 5,
          px: { xs: 2, md: 4 },
          py: 4,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #f8fafc 60%, #e1f0ff 100%)',
          boxShadow: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: 'primary.main', letterSpacing: -1 }}>
            📚 Learning Materials
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, color: 'text.secondary', fontWeight: 400 }}>
            Access and share educational resources with the community.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/learning-materials/create')}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: 18,
            background: 'linear-gradient(90deg, #1976d2 60%, #e1306c 100%)',
            color: '#fff',
            boxShadow: 3,
            '&:hover': {
              background: 'linear-gradient(90deg, #1565c0 60%, #c2185b 100%)',
            },
          }}
        >
          Upload Material
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 5,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 2px 16px rgba(60,72,88,0.10)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="🔍 Search materials by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, fontSize: 18, fontWeight: 500 }
              }}
              sx={{ backgroundColor: 'background.paper' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              sx={{
                height: '56px',
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 16,
                color: 'primary.main',
                borderColor: 'primary.light',
                background: 'linear-gradient(90deg, #f8fafc 60%, #e1f0ff 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #e1f0ff 60%, #f8fafc 100%)',
                  borderColor: 'primary.main',
                }
              }}
            >
              {filters.find(f => f.value === selectedFilter)?.label || 'All Materials'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Materials Grid */}
      <Grid container spacing={4}>
        {filteredMaterials.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                No materials found.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter.
              </Typography>
            </Box>
          </Grid>
        )}
        {filteredMaterials.map((material) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={material.id}>
            <Fade in timeout={400}>
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  background: 'linear-gradient(120deg, #f8fafc 70%, #e1f0ff 100%)',
                  boxShadow: '0 4px 24px rgba(60,72,88,0.10)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0 8px 32px rgba(60,72,88,0.18)',
                  },
                  position: 'relative',
                  overflow: 'visible',
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      badgeContent={
                        <Chip
                          label={material.fileType?.toUpperCase() || 'DOC'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(25,118,210,0.08)',
                            fontWeight: 700,
                            fontSize: 12,
                            color: 'primary.main',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          bgcolor: 'background.paper',
                          border: '2px solid #e1e7ef',
                          width: 48,
                          height: 48,
                          boxShadow: 1,
                        }}
                        variant="rounded"
                      >
                        {getFileIcon(material.fileType, 32)}
                      </Avatar>
                    </Badge>
                    {material.userId === user?.id && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, material)}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.3, color: 'primary.dark', mb: 0.5 }}>
                    {material.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                    {material.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: 14,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        fontWeight: 700,
                      }}
                    >
                      {material.userName?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Uploaded by {material.userName}
                    </Typography>
                  </Box>
                </CardContent>
                <Divider />
                <CardContent sx={{ pt: 2, pb: 2 }}>
                  {renderFileList(material.fileUrls, material)}
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => handleFilterClose()}
        PaperProps={{
          sx: {
            backgroundColor: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(60,72,88,0.15)',
            minWidth: 220,
            p: 0,
            border: '1px solid #e0e7ef',
          }
        }}
        MenuListProps={{
          sx: {
            p: 0
          }
        }}
      >
        {filters.map((filter) => (
          <MenuItem
            key={filter.value}
            onClick={() => handleFilterClose(filter.value)}
            selected={selectedFilter === filter.value}
            sx={{
              fontWeight: selectedFilter === filter.value ? 700 : 500,
              color: selectedFilter === filter.value ? 'primary.main' : 'text.primary',
              backgroundColor: selectedFilter === filter.value ? 'rgba(25,118,210,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(25,118,210,0.12)',
              },
              fontSize: 17,
              px: 3,
              py: 1.7,
              transition: 'background 0.2s',
            }}
          >
            {filter.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/learning-materials/${selectedMaterial?.id}/edit`);
            handleMenuClose();
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: '150px'
          }}
        >
          <EditIcon fontSize="small" sx={{ color: 'primary.main' }} />
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleDelete(selectedMaterial?.id)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'error.main'
          }}
        >
          <DeleteIcon fontSize="small" />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default LearningMaterialsList;