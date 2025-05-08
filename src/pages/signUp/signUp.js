import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const { Box, Button, TextField, Typography, Snackbar, Alert, Paper } = require('@mui/material');

const SignUp = () => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value }));
    };

    const handleRegister = async () => {
        const { name, email, password } = formData;

        if (!name || !email || !password) {
            setAlertMessage("All fields are required");
            setAlertSeverity("warning");
            setAlert(true);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                setAlertMessage("Registration successful!");
                setAlertSeverity("success");
                alert(true);

                // Armazenando o token (se necessário)
                localStorage.setItem("token", data.token);

                // Redireciona para o login
                setTimeout(() => navigate("/suppliers/", 1500));

            } else {
                setAlertMessage("Registration failed");
                setAlertSeverity("error");
                setAlert(true);
            }
        } catch (error) {
            console.log("Registration error", error);
            setAlertMessage("An error occured during registration");
            setAlertSeverity("error");
            setAlert(true);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 320 }}>
                <Typography variant="h4" gutterBottom align="center">Sign Up</Typography>
                <TextField label="Name" name="name" fullWidth margin="normal" value={formData.name} onChange={handleChange} />
                <TextField label="Email" name="email" fullWidth margin="normal" value={formData.email} onChange={handleChange} />
                <TextField label="Password" name="password" fullWidth margin="normal" value={formData.password} onChange={handleChange} />

                <Box mt={2}>
                    <Button variant="contained" color="primary" fullWidth sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }} onClick={handleRegister}>Resgister</Button>
                </Box>
            </Paper>

            <Snackbar
                open={alert}
                autoHideDuration={5000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={alertSeverity} onClose={() => setAlert(false)} sx={{ width: "100%" }}>
                    {alertMessage}
                </Alert>
            </Snackbar>

        </Box>

    );

};

export default SignUp;
