'use client';

import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, writeBatch, doc, getDoc } from "firebase/firestore";
import { AppBar, Box, Container, IconButton, Toolbar, TextField, Typography, Paper, Button, Card, CardActionArea, CardContent, DialogTitle, DialogContent, DialogContentText, DialogActions, Dialog, CircularProgress, Tooltip, Grid } from "@mui/material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { UserButton } from '@clerk/nextjs';


export default function Generate() {
    const { user, isLoading } = useUser();
    const router = useRouter();

    const YourComponent = () => {
        const router = useRouter();
        const { isLoaded, user } = useAuth(); // Clerk's useAuth hook to get authentication status at to it
      
        useEffect(() => {
          if (isLoaded) { // Wait for authentication status to be loaded
            if (!user) {
              router.push('/sign-up'); // Redirect to sign-up page if not authenticated
            } else {
              router.push('/generate'); // Redirect to generate page if authenticated
            }
          }
        }, [isLoaded, user, router]);
      };

    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const textRef = useRef(null);

    const adjustFontSize = () => {
        const textElement = textRef.current;
        if (!textElement) return;

        let fontSize = 26; // Start with a slightly larger font size
        textElement.style.fontSize = `${fontSize}px`;

        // Reduce the font size until the text fits within the card
        while (textElement.scrollHeight > textElement.clientHeight && fontSize > 14) {
            fontSize -= 1;
            textElement.style.fontSize = `${fontSize}px`;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: text,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.length > 0) {
                setFlashcards(data);
                setCurrentIndex(0);
                setFlipped(false);
            } else {
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error generating flashcards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateMore = async () => {
        if (!text.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: text,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.length > 0) {
                setFlashcards((prevFlashcards) => [...prevFlashcards, ...data]);
            } else {
                console.error('Unexpected response format:', data);
            }
        } catch (error) {
            console.error('Error generating additional flashcards:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
        setFlipped(false);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
        setFlipped(false);
    };

    const handleCardClick = () => {
        setFlipped((prevFlipped) => !prevFlipped);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleViewAllToggle = () => {
        setViewAll((prev) => !prev);
    };

    const handleSelectCard = (index) => {
        setCurrentIndex(index);
        setFlipped(false);
        setViewAll(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name');
            return;
        }

        if (!user || !user.id) {
            alert('User not authenticated');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(db, 'users', user.id);
        const docSnap = await getDoc(userDocRef);

        const colRef = collection(userDocRef, name);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('A flashcard collection with this name already exists. Please choose a different name');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        flashcards.forEach((flashcard, index) => {
            const cardDocRef = doc(colRef, `card-${index + 1}`);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                background: 'linear-gradient(135deg, #e0f7fa, #e3f2fd)', // Gradient background
                zIndex: 1, // Ensure content is above the background
            }}
        >
            <AppBar position="fixed">
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton edge="start" color="inherit" aria-label="view flashcards" onClick={() => router.push('/flashcards')}>
                            <LibraryBooksIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ ml: 1 }}>
                            View Your Flashcards
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <UserButton />
                </Toolbar>
            </AppBar>

            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#007BFF' }}>
                    Generate Flashcard
                </Typography>
                <Paper sx={{ p: 4, width: '100%', maxWidth: '700px', borderRadius: 4, boxShadow: 6 }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            mb: 4,
                            '&:focus-within': {
                                boxShadow: '0 0 15px rgba(0, 123, 255, 0.6)',
                                borderColor: '#007BFF',
                            },
                        }}
                    />
                    <Tooltip title="Click to generate flashcards">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            fullWidth
                            sx={{
                                padding: '12px',
                                fontSize: '1.2rem',
                                borderRadius: '10px',
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.08)',
                                    backgroundColor: '#0056b3',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={28} color="inherit" /> : 'Submit'}
                        </Button>
                    </Tooltip>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ textAlign: 'center', width: '100%', mt: 6 }}>
                    <Button
                        variant="outlined"
                        onClick={handleViewAllToggle}
                        sx={{ mb: 6, fontSize: '1rem', padding: '10px 20px' }}
                    >
                        {viewAll ? 'View Single Flashcard' : 'View All Flashcards'}
                    </Button>

                    {viewAll ? (
                        <Box
                            sx={{
                                maxHeight: '500px', // Adjust the height as needed
                                overflowY: 'auto',
                                width: '100%',
                            }}
                        >
                            <Grid container spacing={3}>
                                {flashcards.map((flashcard, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card
                                            sx={{
                                                borderRadius: 3,
                                                boxShadow: 4,
                                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                                backgroundColor: '#ffffff', // White card background with subtle shadow
                                                '&:hover': {
                                                    boxShadow: 10,
                                                    transform: 'translateY(-12px)',
                                                },
                                            }}
                                        >
                                            <CardActionArea
                                                onClick={() => handleSelectCard(index)}
                                                sx={{
                                                    padding: '24px',
                                                    minHeight: '160px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        overflowY: 'auto',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        textAlign: 'center',
                                                        padding: '15px',
                                                        maxHeight: '120px',
                                                        overflowWrap: 'break-word',
                                                        wordWrap: 'break-word',
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: '#333',
                                                            fontSize: 'calc(1rem + 0.5vw)',
                                                            lineHeight: '1.5',
                                                            textAlign: 'center',
                                                            display: 'block',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {flashcard.front}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ) : (
                        <Box>
                            {/* Flashcard Number Indicator */}
                            <Typography variant="h6" sx={{ mb: 3, color: '#007BFF' }}>
                                {`Card ${currentIndex + 1} / ${flashcards.length}`}
                            </Typography>

                            <Card
                                sx={{
                                    width: '100%',
                                    maxWidth: '700px',
                                    margin: '0 auto',
                                    height: '350px',
                                    borderRadius: 3,
                                    boxShadow: 4,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    perspective: '1000px',
                                    backgroundColor: '#ffffff', // White card background with subtle shadow
                                }}
                            >
                                <CardActionArea
                                    onClick={handleCardClick}
                                    sx={{
                                        padding: '24px',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        transformStyle: 'preserve-3d',
                                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                        transition: 'transform 0.6s',
                                        position: 'relative',
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            padding: '20px',
                                        }}
                                    >
                                        <Typography
                                            ref={textRef}
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                                fontSize: '22px',
                                                lineHeight: '1.4',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                                maxHeight: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {flashcards[currentIndex].front}
                                        </Typography>
                                    </CardContent>
                                    <CardContent
                                        sx={{
                                            position: 'absolute',
                                            width: '100%',
                                            height: '100%',
                                            backfaceVisibility: 'hidden',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center',
                                            transform: 'rotateY(180deg)',
                                            padding: '20px',
                                        }}
                                    >
                                        <Typography
                                            ref={textRef}
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                color: '#333',
                                                fontSize: '22px',
                                                lineHeight: '1.4',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                                maxHeight: '100%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {flashcards[currentIndex].back}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Box>
                    )}

                    {!viewAll && (
                        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '700px', margin: '0 auto' }}>
                            <Button
                                variant="outlined"
                                onClick={handlePrev}
                                disabled={flashcards.length <= 1}
                                sx={{
                                    fontSize: '1rem',
                                    padding: '10px 20px',
                                }}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleNext}
                                disabled={flashcards.length <= 1}
                                sx={{
                                    fontSize: '1rem',
                                    padding: '10px 20px',
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGenerateMore}
                            sx={{
                                padding: '12px 24px',
                                fontSize: '1.2rem',
                                borderRadius: '10px',
                                transition: 'transform 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.08)',
                                    backgroundColor: '#0056b3',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={28} color="inherit" /> : 'Generate More Flashcards'}
                        </Button>
                    </Box>

                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleOpen}
                            sx={{
                                padding: '12px 24px',
                                fontSize: '1.2rem',
                                borderRadius: '10px',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.08)' }
                            }}
                        >
                            Save Flashcards
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{ color: '#007BFF' }}>Cancel</Button>
                    <Button onClick={saveFlashcards} sx={{ color: '#007BFF' }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}