import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'
const { Box, Button, TextField, Typography, Snackbar, Alert, Paper} = require('@mui/material');

const SignIn = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('info');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSignin = async () => {
        if(!formData.email || !formData.password) {
            setAlertMessage("All fields are required");
            setAlertSeverity("warning");
            setAlert(true)
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: formData.email,
                    password:formData.password,
                    username: ""
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful", data);
                setAlertMessage("Login successful!");
                setAlertSeverity("success");
                setAlert(true);

                // Salva token no localStorage (opcional)
                localStorage.setItem("token", data.token);

                // Navegando para o /suppliers/
                navigate('/suppliers/')

            } else {
                setAlertMessage(data.message || "Invalid Credentials");
                setAlertSeverity("error");
                setAlert(true)
            }
        } catch (error) {
            console.error("Login error", error);
            setAlertMessage("An error occured during login.");
            setAlertSeverity("warning");
            setAlert(true);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Paper elevation={3} sx={{ padding: 4, minWidth: 320 }}>
                <Typography variant='h4' gutterBottom align='center'>
                    Sign in
                </Typography>
                <TextField label='Email' name='email' type='email' fullWidth margin='normal' value={formData.email} onChange={handleChange}
                />
                <TextField label='Password' name='password' type='password' fullWidth margin='normal' value={formData.password} onChange={handleChange}
                />
                <Box mt={2}>
                    <Button variant='contained' color='primary' fullWidth sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }} onClick={handleSignin}>Login</Button>
                </Box>
            </Paper>

            <Snackbar
                open={alert}
                autoHideDuration={5000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity={alertSeverity}
                    onClose={() => setAlert(false)}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

        </Box>
    );

};

export default SignIn;

