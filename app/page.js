'use client';

import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Container } from "@mui/system";
import { AppBar, Button, Toolbar, Typography, Box, Grid } from "@mui/material";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const { user } = useUser();
  const [userPlan, setUserPlan] = useState(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#007BFF', // Your primary color
      },
      secondary: {
        main: '#FF4081', // Secondary color
      },
      background: {
        default: '#F5F5F5', // Background color
      },
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    },
  });

  useEffect(() => {
    if (user) {
      // Fetch user's subscription plan from your backend
      axios.get(`/api/user-plan?userId=${user.id}`)
        .then((response) => {
          setUserPlan(response.data.plan); // Assumes response has a "plan" field
        })
        .catch((error) => {
          console.error('Error fetching user plan:', error);
        });
    }
  }, [user]);

  const handleGetStarted = () => {
    if (!user) {
      router.push('/sign-up');
    } else if (!userPlan) {
      alert('Please choose a plan to get started!');
      // Instead of redirecting, scroll to the pricing section
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (userPlan === 'Pro') {
      router.push('/full-access'); // Redirect to the full access area
    } else if (userPlan === 'Basic') {
      router.push('/generate-cards'); // Redirect to the card generation page
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" disableGutters sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
        <Head>
          <title>Flash Study</title>
          <meta name="description" content="Create flashcards from your text" />
        </Head>

        <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.main }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 600 }}>
              Flash Study
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
              <SignedOut>
                {/* Buttons removed */}
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: "center",
          minHeight: '50vh',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 3,
          padding: { xs: 3, md: 6 },
          mt: 4,
        }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Welcome to Flash Study
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.secondary }}>
            Create flashcards from your text in seconds
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3, px: 5, py: 2, fontSize: '1.2rem', borderRadius: '50px' }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </Box>

        <Box sx={{ my: 6, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Features</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
              <Typography>
                Create flashcards from your text in seconds simply
                input what you want and let our software do the rest.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
              <Typography>
                Let our AI break down your text into easy to understand and concise flashcards, perfect for studying.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
              <Typography>
                Access your flashcards from any device, any time, anywhere.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Pricing Section with ID for scrolling */}
        <Box id="pricing" sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Pricing</Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h5" gutterBottom>Basic</Typography>
                <Typography variant="subtitle1" gutterBottom> $5 / Month</Typography>
                <Typography>
                  Access to basic flash card features and limited storage.
                </Typography>
                <a href="https://buy.stripe.com/test_9AQg2H06KagjdKo9AD" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1rem', borderRadius: '50px' }}
                  >
                    Choose Basic
                  </Button>
                </a>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h5" gutterBottom>Pro</Typography>
                <Typography variant="subtitle1" gutterBottom> $10 / Month</Typography>
                <Typography>
                  Unlimited flashcards and storage, with priority support.
                </Typography>
                <a href="https://buy.stripe.com/test_9AQ7wb3iWdsv5dS5ko" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1rem', borderRadius: '50px' }}
                  >
                    Choose Pro
                  </Button>
                </a>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}