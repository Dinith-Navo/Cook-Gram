import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook, YouTube } from '@mui/icons-material';

const cream = '#FFF9ED';
const oliveGreen = '#708238';
const tomatoRed = '#FF6347';
const darkBrown = '#4E342E';

const Footer = () => {
  return (
    <Box
      component="footer"
      style={{
        padding: '32px 24px',
        marginTop: 'auto',
        background: 'linear-gradient(135deg,rgba(125, 128, 108, 0.86) 0%,rgb(199, 211, 64) 100%)',
        color: '#F5F5F5',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              style={{ color: oliveGreen, fontWeight: 'bold', marginBottom: '16px' }}
            >
              Cookgram
            </Typography>
            <Typography
              variant="body2"
              style={{ color: darkBrown }}
            >
              Ignite your culinary passion with Cookgram. Explore vibrant recipes, connect with global food enthusiasts, and share your kitchen adventures.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              style={{ color: oliveGreen, fontWeight: 'bold', marginBottom: '16px' }}
            >
              Explore
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              style={{ color: darkBrown, display: 'block', marginBottom: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = darkBrown)}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              to="/recipes"
              style={{ color: darkBrown, display: 'block', marginBottom: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = darkBrown)}
            >
              Recipes
            </Link>
            <Link
              component={RouterLink}
              to="/community"
              style={{ color: darkBrown, display: 'block', marginBottom: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = darkBrown)}
            >
              Community
            </Link>
            <Link
              component={RouterLink}
              to="/events"
              style={{ color: darkBrown, display: 'block', marginBottom: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = darkBrown)}
            >
              Events
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              style={{ color: oliveGreen, fontWeight: 'bold', marginBottom: '16px' }}
            >
              Connect With Us
            </Typography>
            <Typography
              variant="body2"
              style={{ color: darkBrown, marginBottom: '8px' }}
            >
              Email: hello@cookgram.app
            </Typography>
            <Typography
              variant="body2"
              style={{ color: darkBrown, marginBottom: '16px' }}
            >
              Address: 123 Flavor Street, Culinary City, CA 90210
            </Typography>
            <Box>
              <IconButton
                href="https://instagram.com/cookgram"
                target="_blank"
                style={{ color: oliveGreen }}
                onMouseOver={e => (e.target.style.color = tomatoRed)}
                onMouseOut={e => (e.target.style.color = oliveGreen)}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href="https://twitter.com/cookgram"
                target="_blank"
                style={{ color: oliveGreen }}
                onMouseOver={e => (e.target.style.color = tomatoRed)}
                onMouseOut={e => (e.target.style.color = oliveGreen)}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://facebook.com/cookgram"
                target="_blank"
                style={{ color: oliveGreen }}
                onMouseOver={e => (e.target.style.color = tomatoRed)}
                onMouseOut={e => (e.target.style.color = oliveGreen)}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://youtube.com/cookgram"
                target="_blank"
                style={{ color: oliveGreen }}
                onMouseOver={e => (e.target.style.color = tomatoRed)}
                onMouseOut={e => (e.target.style.color = oliveGreen)}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box style={{ marginTop: '40px' }}>
          <Typography
            variant="body2"
            align="center"
            style={{ color: darkBrown }}
          >
            © {new Date().getFullYear()} Cookgram. All rights reserved. |{' '}
            <Link
              component={RouterLink}
              to="/privacy"
              style={{ color: oliveGreen, textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = oliveGreen)}
            >
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link
              component={RouterLink}
              to="/terms"
              style={{ color: oliveGreen, textDecoration: 'none', fontWeight: 'bold' }}
              onMouseOver={e => (e.target.style.color = tomatoRed)}
              onMouseOut={e => (e.target.style.color = oliveGreen)}
            >
              Terms of Service
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;