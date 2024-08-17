'use client';

import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";


export default function SignInPage() {
    return (
        <Container maxWidth="lg" sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
            <AppBar 
                position="static" 
                sx={{ 
                    borderRadius: '12px', 
                    marginTop: '20px', 
                    marginBottom: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Toolbar sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                        Flash Study
                    </Typography>
                </Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Button color="inherit" component={Link} href="/sign-up" aria-label="Sign Up" sx={{ mr: 2 }}>
                    Sign Up
                </Button>
                </Box>
            </AppBar>

            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, p: 2 }}>
                <SignIn />
            </Box>
        </Container>
    );
}