import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const CommunityChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/community-chat');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await axios.post('/api/community-chat', null, { params: { message } });
      setMessage('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleMenuOpen = (event, msg) => {
    event.stopPropagation();
    setSelectedMessage(msg);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleEdit = () => {
    setEditingId(selectedMessage.id);
    setEditValue(selectedMessage.message);
    handleMenuClose();
  };

  const handleEditSave = async (id) => {
    if (!editValue.trim()) return;
    try {
      await axios.put(`/api/community-chat/${id}`, { message: editValue });
      setEditingId(null);
      setEditValue('');
      fetchMessages();
    } catch (err) {
      console.error('Error updating message:', err);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/community-chat/${selectedMessage.id}`);
      handleMenuClose();
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const renderMessage = (msg) => {
    const isCurrentUser = user && msg.userId === user.id;

    return (
      <Box
        key={msg.id}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          mb: 2.5,
          flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          gap: 1.5,
        }}
      >
        <Avatar
          src={msg.userPicture}
          sx={{
            width: 36,
            height: 36,
            bgcolor: isCurrentUser ? '#a7027d' : '#e3e6f3',
            color: isCurrentUser ? '#fff' : '#a7027d',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 2px 8px rgba(167,2,125,0.08)',
          }}
        >
          {!msg.userPicture && (msg.userName ? msg.userName[0] : '?')}
        </Avatar>
        <Box sx={{ maxWidth: '75%', minWidth: '100px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: isCurrentUser ? 'row-reverse' : 'row',
              gap: 1,
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '0.92rem',
                color: '#111',
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              {msg.userName || 'Unknown'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#111',
                fontSize: '0.78rem',
                opacity: 0.6,
              }}
            >
              {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
          {editingId === msg.id ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <TextField
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                size="small"
                fullWidth
                autoFocus
                multiline
                maxRows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    color: '#111',
                  },
                  '& input': {
                    color: '#111',
                  },
                }}
                InputProps={{
                  style: { color: '#111' },
                }}
              />
              <IconButton onClick={() => handleEditSave(msg.id)} color="primary" size="small">
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleEditCancel} color="error" size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                bgcolor: isCurrentUser
                  ? 'linear-gradient(135deg, #f857a6 0%, #a7027d 100%)'
                  : 'rgba(245,245,255,0.8)',
                color: '#111',
                borderRadius: isCurrentUser
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px',
                boxShadow: isCurrentUser
                  ? '0 2px 8px rgba(167,2,125,0.10)'
                  : '0 2px 8px rgba(31,38,135,0.06)',
                px: 2.5,
                py: 1.5,
                mb: 0.5,
                mt: 0.5,
                wordBreak: 'break-word',
                fontSize: '1.05rem',
                position: 'relative',
                transition: 'background 0.2s',
                display: 'inline-block',
                maxWidth: '100%',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: '#111',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                {msg.message}
              </Typography>
            </Box>
          )}
        </Box>
        {user && msg.userId === user.id && editingId !== msg.id && (
          <IconButton
            size="small"
            onClick={e => handleMenuOpen(e, msg)}
            className="message-actions"
            sx={{
              opacity: 0.7,
              color: '#a7027d',
              padding: 0.5,
              '&:hover': {
                color: '#f857a6',
                backgroundColor: 'transparent',
              },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e3e6f3 100%)',
        py: 6,
        px: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 600,
          minHeight: 600,
          borderRadius: 5,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.85)',
          border: '1.5px solid rgba(167, 2, 125, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 4,
            pt: 3,
            pb: 2,
            borderBottom: '1.5px solid #f0f0f0',
            background: 'rgba(255,255,255,0.7)',
            zIndex: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111', letterSpacing: 1 }}>
            Community Chat
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              opacity: 0.85,
              mt: 0.5,
              fontSize: '1rem',
              letterSpacing: 0.1,
              color: '#111',
            }}
          >
            Please be kind and respectful to others in this chat. Let’s keep it friendly!
          </Typography>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 4,
            py: 3,
            background: 'transparent',
            position: 'relative',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(167,2,125,0.08)',
              borderRadius: '8px',
            },
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={28} sx={{ color: '#a7027d' }} />
            </Box>
          ) : messages.length === 0 ? (
            <Typography
              sx={{
                color: '#111',
                fontStyle: 'italic',
                opacity: 0.8,
                mt: 6,
                fontSize: '1.1rem',
              }}
              align="center"
            >
              No messages yet. Be the first to start the conversation!
            </Typography>
          ) : (
            messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar */}
        <Box
          sx={{
            px: 4,
            pb: 3,
            pt: 2,
            background: 'rgba(255,255,255,0.85)',
            borderTop: '1.5px solid #f0f0f0',
            position: 'sticky',
            bottom: 0,
            zIndex: 2,
          }}
        >
          {user ? (
            <Box
              component="form"
              onSubmit={handleSend}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(245,245,255,0.7)',
                borderRadius: 3,
                boxShadow: '0 2px 8px rgba(167,2,125,0.04)',
                px: 2,
                py: 1,
              }}
            >
              <Avatar
                src={user?.photoURL}
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1,
                  bgcolor: '#a7027d',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}
              >
                {user?.displayName?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <TextField
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message…"
                size="small"
                fullWidth
                disabled={sending}
                multiline
                maxRows={4}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    fontSize: '1rem',
                    color: '#111',
                  },
                  '& input': {
                    color: '#111',
                  },
                  '& textarea': {
                    color: '#111',
                  },
                }}
                InputProps={{
                  style: { color: '#111' },
                }}
                InputLabelProps={{
                  style: { color: '#111' },
                }}
              />
              <IconButton
                type="submit"
                disabled={sending || !message.trim()}
                sx={{
                  borderRadius: 2,
                  width: 44,
                  height: 44,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #a7027d 60%, #f857a6 100%)',
                  boxShadow: '0 2px 8px rgba(167,2,125,0.10)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f857a6 60%, #a7027d 100%)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(167,2,125,0.12)',
                    color: '#fff',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          ) : (
            <Typography
              sx={{
                color: '#111',
                fontStyle: 'italic',
                opacity: 0.8,
                fontSize: '1.05rem',
              }}
              align="center"
            >
              Login to participate in the chat.
            </Typography>
          )}
        </Box>

        {/* Message Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 2,
            sx: {
              borderRadius: 2,
              minWidth: 120,
            },
          }}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{
              py: 1,
              color: '#111',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: 'error.main',
              py: 1,
              '&:hover': {
                backgroundColor: 'error.lighter',
              },
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} />
            Delete
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
};

export default CommunityChat;