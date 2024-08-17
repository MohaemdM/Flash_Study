'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Container, Typography, Box } from '@mui/material';

const ResultsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSession = async () => {
            if (!session_id) return;

            try {
                const res = await fetch(`/api/checkout-sessions?session_id=${session_id}`);
                const sessionData = await res.json();
                if (res.ok) {
                    setSession(sessionData);
                } else {
                    setError(sessionData.error);
                }
            } catch (err) {
                setError("An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [session_id]);

    if (loading) {
        return (
            <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
                <CircularProgress />
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="100vw" sx={{ textAlign: 'center', mt: 4 }}>
            {session?.payment_status === 'paid' ? (
                <>
                    <Typography variant="h6">Payment successful</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Session ID: {session_id}</Typography>
                        <Typography variant="body1">
                            We have received your payment. You will receive an email with the details shortly.
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Typography variant="h6">Payment Failed</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">
                            Your payment was not successful. Please try again.
                        </Typography>
                    </Box>
                </>
            )}
        </Container>
    );
}

export default ResultsPage;