'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Container,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Button,
    AppBar,
    Toolbar,
    IconButton,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserButton } from '@clerk/nextjs';

export default function FlashCard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const search = searchParams.get('id');
    const router = useRouter();
    const theme = useTheme();

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            try {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                }
            } catch (err) {
                console.error('Error fetching flashcards:', err);
                setError('Failed to fetch flashcards. Please try again later.');
            }
        }

        if (search) {
            const getFlashcardData = async () => {
                try {
                    const colRef = collection(doc(collection(db, 'users'), user.id), search);
                    const docs = await getDocs(colRef);
                    const fetchedFlashcards = [];

                    docs.forEach((doc) => {
                        fetchedFlashcards.push({ id: doc.id, ...doc.data() });
                    });

                    setFlashcards(fetchedFlashcards);
                } catch (err) {
                    console.error('Error fetching flashcards:', err);
                    setError('Failed to fetch flashcards. Please try again later.');
                }
            };

            getFlashcardData();
        } else {
            getFlashcards();
        }
    }, [user, search]);

    if (!isLoaded || !isSignedIn) {
        return null;
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    const handleBackClick = () => {
        router.push('/flashcards'); // Change '/flashcards' to the actual path of your flashcards screen
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="back"
                        onClick={handleBackClick}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flash Study
                    </Typography>
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Container maxWidth="md" sx={{ mt: 2, mb: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#007BFF', mb: 4 }}>
                    Your Flashcards
                </Typography>

                {error && (
                    <Typography variant="h6" sx={{ color: 'red', mt: 4 }}>
                        {error}
                    </Typography>
                )}

                {flashcards.length > 0 ? (
                    <Box>
                        <Card
                            sx={{
                                width: '100%',
                                maxWidth: '800px',
                                height: '400px',
                                margin: '0 auto',
                                borderRadius: 2,
                                boxShadow: 3,
                                overflow: 'hidden',
                            }}
                        >
                            <CardActionArea
                                sx={{
                                    height: '100%',
                                    width: '100%',
                                }}
                                onClick={() => handleCardClick(flashcards[currentIndex].id)}
                            >
                                <CardContent
                                    sx={{
                                        height: '100%',
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        padding: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'relative',
                                            perspective: '1000px',
                                            '& > div': {
                                                transition: 'transform 0.6s',
                                                transformStyle: 'preserve-3d',
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                transform: flipped[flashcards[currentIndex]?.id] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                            },
                                            '& > div > div': {
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                backfaceVisibility: 'hidden',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                padding: 2,
                                                boxSizing: 'border-box',
                                            },
                                            '& > div > div:nth-of-type(2)': {
                                                transform: 'rotateY(180deg)',
                                            },
                                        }}
                                    >
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcards[currentIndex]?.front || 'No front text available'}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcards[currentIndex]?.back || 'No back text available'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="outlined"
                                onClick={handlePrev}
                                disabled={flashcards.length <= 1}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleNext}
                                disabled={flashcards.length <= 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h6" sx={{ color: '#888', mt: 4 }}>
                        No flashcards available. Please create some.
                    </Typography>
                )}
            </Container>
        </Box>
    );
}