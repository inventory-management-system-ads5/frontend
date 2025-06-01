import AddIcon from "@mui/icons-material/Add"
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState, useEffect } from "react";
import { Box, TableContainer, Paper, Typography, Button, IconButton, Divider, Table, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Snackbar, Alert } from '@mui/material';
import { api } from '../../services/api';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const Categories = () => {
    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const getCategories = async () => {
        try {
            const data = await api.get('/category/');
            setCategories(data);
            console.log('Categories listed with success!', data);
        } catch (error) {
            console.error('Failed to fetch the Categories list!', error);
            setAlertMessage('Error loading categories list');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleCategoryUpdate = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description
        });
    };

    const save = async () => {
        if (!formData.name || !formData.description) {
            setAlertMessage('All fields are required!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        if (formData.name.length <= 2 || formData.description.length < 10) {
            setAlertMessage('Name must have at least 2 characters and description must have at least 10 characters!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        try {
            const data = await api.post('/category/add/', formData);
            console.log('Category created with success!', data);
            setAlertMessage('Category created successfully!');
            setAlertSeverity('success');
            setAlert(true);

            setFormData({
                name: '',
                description: ''
            });
            setOpenModal(false);
            getCategories();
        } catch (error) {
            console.error('Failed to register the Category!', error);
            setAlertMessage('Error creating category');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const updateCategory = async () => {
        if (!formData.name || !formData.description) {
            setAlertMessage('All fields are required!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        if (formData.name.length <= 2 || formData.description.length < 10) {
            setAlertMessage('Name must have at least 2 characters and description must have at least 10 characters!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        try {
            const data = await api.put(`/category/${editingCategory.id}/update/`, formData);
            console.log('Category updated with success!', data);
            setAlertMessage('Category updated successfully!');
            setAlertSeverity('success');
            setAlert(true);

            setFormData({
                name: '',
                description: ''
            });
            setEditingCategory(null);
            getCategories();
        } catch (error) {
            console.error('Failed to update the Category!', error);
            setAlertMessage('Error updating category');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const deleteCategory = async (category) => {
        try {
            await api.delete(`/category/${category.id}/delete/`);
            console.log('Category deleted successfully!');
            setAlertMessage('Category deleted successfully!');
            setAlertSeverity('success');
            setAlert(true);
            getCategories();
        } catch (error) {
            console.error('Failed to delete the Category!', error);
            setAlertMessage('Error deleting category');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    return (
        <Box p={8} width='100%'>
            <TableContainer
                component={Paper}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <Box
                    paddingX={5}
                    paddingY={3.1}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                >
                    <Typography
                        variant='h3'
                        component='h1'
                        gutterBottom
                        sx={{ textAlign: 'center', flex: '1' }}
                    >
                        Categories
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button
                            variant='contained'
                            size='large'
                            endIcon={<AddIcon />}
                            sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }}
                            onClick={() => setOpenModal(true)}
                        >
                            ADD
                        </Button>
                    </Box>
                </Box>
                <Divider />
                <Table arial-label='categories table'>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Id
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Name
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Description
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}
                                hover
                                sx={{
                                    '&:hover': {
                                        cursor: 'pointer',
                                    },
                                }}>
                                <TableCell
                                    align="center"
                                    sx={{ fontSize:'1rem' }}
                                >
                                    {category.id}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontSize:'1rem' }}
                                >
                                    {editingCategory?.id === category.id ? (
                                        <TextField
                                            size="small"
                                            value={formData.name}
                                            onChange={handleChange}
                                            name="name"
                                            fullWidth
                                        />
                                    ) : (
                                        category.name
                                    )}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontSize:'1rem' }}
                                >
                                    {editingCategory?.id === category.id ? (
                                        <TextField
                                            size="small"
                                            value={formData.description}
                                            onChange={handleChange}
                                            name="description"
                                            fullWidth
                                        />
                                    ) : (
                                        category.description
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {editingCategory?.id === category.id ? (
                                        <Box>
                                            <IconButton
                                                aria-label="Save"
                                                onClick={updateCategory}
                                                sx={{ color: '#87AA20' }}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Cancel"
                                                onClick={() => {
                                                    setEditingCategory(null);
                                                    setFormData({
                                                        name: '',
                                                        description: ''
                                                    });
                                                }}
                                                sx={{ color: '#C54040' }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                    ) : (
                                        <Box>
                                            <IconButton
                                                aria-label="Edit"
                                                onClick={() => handleCategoryUpdate(category)}
                                                sx={{ color: '#384dc9' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => deleteCategory(category)}
                                                sx={{ color: '#C54040' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    )}
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box
                    backgroundColor='#FFFFFF'
                    textAlign='center'
                    sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: 380, p: 4, borderRadius: '8px' }}
                >
                    <Typography variant='h3' component='h2' gutterBottom>
                        Create Category
                    </Typography>

                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }}
                            onClick={save}
                        >
                            Create Category
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar
                open={alert}
                autoHideDuration={6000}
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'down', horizontal: 'left' }}
            >
                <Alert
                    onClose={() => setAlert(false)}
                    severity={alertSeverity}
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Categories;
