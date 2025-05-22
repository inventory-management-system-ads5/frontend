import AddIcon from "@mui/icons-material/Add"
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useState, useEffect } from "react";
import { Box, TableContainer, Paper, Typography, Button, IconButton, Divider, Table, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Snackbar, Alert } from '@mui/material';
import { api } from '../../services/api';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const Suppliers = () => {
    const [openModal, setOpenModal] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_info: ''
    });

    const getSuppliers = async () => {
        try {
            const data = await api.get('/supplier/');
            setSuppliers(data);
            console.log('Suppliers listed with success!', data);
        } catch (error) {
            console.error('Failed to fetch the Suppliers list!', error);
            setAlertMessage('Error loading suppliers list');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    useEffect(() => {
        getSuppliers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSupplierUpdate = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contact_info: supplier.contact_info
        });
    };

    const save = async () => {
        if (!formData.name || !formData.contact_info) {
            setAlertMessage('All fields are required!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        if (formData.name.length <= 2 || formData.contact_info.length < 8) {
            setAlertMessage('Name must have at least 2 characters and contact must have at least 8 digits!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        try {
            const data = await api.post('/supplier/add/', formData);
            console.log('Supplier created with success!', data);
            setAlertMessage('Supplier created successfully!');
            setAlertSeverity('success');
            setAlert(true);

            setFormData({
                name: '',
                contact_info: ''
            });
            setOpenModal(false);
            getSuppliers();
        } catch (error) {
            console.error('Failed to register the Supplier!', error);
            setAlertMessage('Error creating supplier');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const updateSupplier = async () => {
        if (!formData.name || !formData.contact_info) {
            setAlertMessage('All fields are required!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        if (formData.name.length <= 2 || formData.contact_info.length < 8) {
            setAlertMessage('Name must have at least 2 characters and contact must have at least 8 digits!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        try {
            const data = await api.put(`/supplier/${editingSupplier.id}/update/`, formData);
            console.log('Supplier updated with success!', data);
            setAlertMessage('Supplier updated successfully!');
            setAlertSeverity('success');
            setAlert(true);

            setFormData({
                name: '',
                contact_info: ''
            });
            setEditingSupplier(null);
            getSuppliers();
        } catch (error) {
            console.error('Failed to update the Supplier!', error);
            setAlertMessage('Error updating supplier');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const updateSupplierStatus = async (supplier) => {
        try {
            const data = await api.patch(`/supplier/${supplier.id}/update-status/`, {
                is_active: !supplier.is_active
            });
            console.log('Supplier status updated with success!', data);
            setAlertMessage('Supplier status updated successfully!');
            setAlertSeverity('success');
            setAlert(true);
            getSuppliers();
        } catch (error) {
            console.error('Failed to update the Supplier status!', error);
            setAlertMessage('Error updating supplier status');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const deleteSupplier = async (supplier) => {
        try {
            await api.delete(`/supplier/${supplier.id}/delete/`);
            console.log('Supplier deleted successfully!');
            setAlertMessage('Supplier deleted successfully!');
            setAlertSeverity('success');
            setAlert(true);
            getSuppliers();
        } catch (error) {
            console.error('Failed to delete the Supplier!', error);
            setAlertMessage('Error deleting supplier');
            setAlertSeverity('error');
            setAlert(true);
        }
    };

    const exportSuppliers = async () => {
        try {
            const response = await fetch(`${API_URL}/supplier/export/csv/`, {
                method: 'GET',
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'text/csv, application/csv',
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error exporting suppliers');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'suppliers.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setAlertMessage('Suppliers exported successfully!');
            setAlertSeverity('success');
            setAlert(true);
        } catch (error) {
            console.error('Error exporting suppliers:', error);
            setAlertMessage(error.message || 'Error exporting suppliers');
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
                        Fornecedores
                    </Typography>
                    <Box display="flex" gap={2}>
                        <Button
                            variant='contained'
                            size='large'
                            endIcon={<FileDownloadIcon />}
                            sx={{ fontWeight: 'bold', backgroundColor: '#87AA20' }}
                            onClick={exportSuppliers}
                        >
                            EXPORTAR
                        </Button>
                        <Button
                            variant='contained'
                            size='large'
                            endIcon={<AddIcon />}
                            sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }}
                            onClick={() => setOpenModal(true)}
                        >
                            ADICIONAR
                        </Button>
                    </Box>
                </Box>
                <Divider />
                <Table arial-label='suppliers table'>
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
                                Nome
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Contato
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Status
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {suppliers.map((supplier) => (
                            <TableRow key={supplier.id}
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
                                    {supplier.id}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontSize:'1rem' }}
                                >
                                    {editingSupplier?.id === supplier.id ? (
                                        <TextField
                                            size="small"
                                            value={formData.name}
                                            onChange={handleChange}
                                            name="name"
                                            fullWidth
                                        />
                                    ) : (
                                        supplier.name
                                    )}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontSize:'1rem' }}
                                >
                                    {editingSupplier?.id === supplier.id ? (
                                        <TextField
                                            size="small"
                                            value={formData.contact_info}
                                            onChange={handleChange}
                                            name="contact_info"
                                            fullWidth
                                        />
                                    ) : (
                                        supplier.contact_info
                                    )}
                                </TableCell>
                                <TableCell
                                    align="center"
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        gap={2}
                                        width="full"
                                    >
                                        {supplier.is_active ? (
                                            <Box
                                                sx={{ minWidth: 60, fontWeight: 'bold', textAlign: 'center' }}
                                                px={2}
                                                bgcolor="#87AA20"
                                                borderRadius="10px"
                                                color="#FFFFFF"
                                            >
                                                Ativo
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{ minWidth: 60, fontWeight: 'bold' }}
                                                px={2}
                                                bgcolor="#C54040"
                                                borderRadius="10px"
                                                color="#FFFFFF"
                                            >
                                                Inativo
                                            </Box>
                                        )}
                                        {editingSupplier?.id === supplier.id && (
                                            <IconButton
                                                aria-label="Toggle Status"
                                                onClick={() => updateSupplierStatus(supplier)}
                                                sx={{
                                                    color: supplier.is_active ? '#C54040' : '#87AA20',
                                                    '&:hover': {
                                                        backgroundColor: supplier.is_active ? 'rgba(197, 64, 64, 0.1)' : 'rgba(135, 170, 32, 0.1)'
                                                    }
                                                }}
                                            >
                                                {supplier.is_active ? <BlockIcon /> : <CheckCircleIcon />}
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    {editingSupplier?.id === supplier.id ? (
                                        <Box>
                                            <IconButton
                                                aria-label="Save"
                                                onClick={updateSupplier}
                                                sx={{ color: '#87AA20' }}
                                            >
                                                <CheckIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Cancel"
                                                onClick={() => {
                                                    setEditingSupplier(null);
                                                    setFormData({
                                                        name: '',
                                                        contact_info: ''
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
                                                onClick={() => handleSupplierUpdate(supplier)}
                                                sx={{ color: '#384dc9' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => deleteSupplier(supplier)}
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
                        Criar Fornecedor
                    </Typography>

                    <TextField
                        label="Nome"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Contato"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{ fontWeight: 'bold', backgroundColor: '#384dc9' }}
                            onClick={save}
                        >
                            Criar Fornecedor
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

export default Suppliers;
