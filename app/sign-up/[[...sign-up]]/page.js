'use client';

import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
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
                <Button color="inherit" component={Link} href="/sign-in" aria-label="Login" sx={{ mr: 2 }}>
                    Sign In
                </Button>
                </Box>
            </AppBar>

            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mt: 4, p: 2 }}>
                <SignUp />
            </Box>
        </Container>
    );
}