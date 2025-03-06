import AddIcon from "@mui/icons-material/Add"
import EditIcon from '@mui/icons-material/Edit'
const { useState } = require("react")
const { useEffect } = require("react");
const { Box, TableContainer, Paper, Typography, Button, IconButton, Divider, Table, TableHead, TableRow, TableCell, TableBody, Modal, TextField, Snackbar, Alert } = require('@mui/material');

const Suppliers = () => {

    // state variable to control the opening of modals
    const [openModal, setOpenModal] = useState(false);

    // state variables for controlling alerts visibility, severity and message
    const [alert, setAlert] = useState(false); // controls the visibility of the alert
    const [alertSeverity, setAlertSeverity] = useState(''); // controls the type of the alert
    const [alertMessage, setAertMessage] = useState(''); // holds the message of the alert

    // state variable to store the suppliers list
    const [suppliers, setSuppliers] = useState([]);

    // further
    // state variable to store a supplier data
    // const [supplier, setSupplier] = useState({});

    // fetching all the existing suppliers
    const getSuppliers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/supplier/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                setSuppliers(data);
                console.log('Suppliers listed with success!', data);
            } else {
                console.error('Failed to fetch the Suppliers list!', data);
            }
        } catch (error) {
            console.log('An error occured while trying to fetch de Suppliers list!', error);
        }
    };

    // synchornizing all fetched supplier data
    useEffect(() => {
        getSuppliers();
    }, []);

    // state variable to manage form inputted data
    const [formData, setFormData] = useState({
        name: '',
        contact_info: ''
    });

    // function for handling form default state and input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // function for handling the creation of a supplier
    async function save() {

        // check if all the required fieds are filled
        if (!formData.name || !formData.contact_info) {
            setAertMessage('To proceed with the creation of a Supplier, all the required fields must be filled out!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        };

        // check if the given data is valid
        if (formData.name.length <= 2 || formData.contact_info.length < 8) {
            setAertMessage('A Supplier must have a name with at least 2 characters, and a number with 8 digits for the contact info!');
            setAlertSeverity('warning');
            setAlert(true);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/supplier/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Supplier created with succes!', data);
                setAertMessage('Supplier created with succes!', data);
                setAlertSeverity('success');
                setAlert(true);

                // resetting the form fields
                setFormData({
                    name: '',
                    contact_info: ''
                });
                
                // closing the modal upon form reset
                setOpenModal(false)

                // callling the fetching of all the existing suppliers
                getSuppliers();
            } else {
                console.error('Failed to register the Supplier!', data);
                setAertMessage('Failed to register the Supplier!');
                setAlertSeverity('error');
                setAlert(true);
            }
        } catch (error) {
            console.log('An error occured while registering the Supplier!', error);
            setAertMessage('An error occured while registering the Supplier!');
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
                        Suppliers
                    </Typography>
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
                                Name
                            </TableCell>
                            <TableCell
                                align='center'
                                sx={{ fontWeight: 'bold', fontSize:'1.15rem' }}
                            >
                                Contact Info
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
                                Actions
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
                                    {supplier.name}
                                </TableCell>
                                <TableCell 
                                    align="center"
                                    sx={{ fontSize:'1rem' }}

                                >
                                    {supplier.contact_info}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    

                                >
                                    <Box
                                        display="flex"
                                        justifyContent="center"
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
                                                Active
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{ minWidth: 60, fontWeight: 'bold' }}
                                                px={2}
                                                bgcolor="#C54040"
                                                borderRadius="10px"
                                                color="#FFFFFF"
                                            >
                                                Inactive
                                            </Box>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="Edit"
                                    // onClick={() => handleSupplierUpdate(supplier)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* modal component for adding a product */}
            <Modal open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box
                    backgroundColor='#FFFFFF'
                    textAlign='center'
                    sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: 380, p: 4, borderRadius: '8px' }}
                >
                    <Typography variant='h3' component='h2' gutterBottom>
                        Create a Supplier
                    </Typography>

                    {/* name field configuration */}
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    {/* contact_info field configuration */}
                    <TextField
                        label="Contact Info"
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
                            Create Supplier
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* snackbar component for on-screen alerts */}
            <Snackbar
                open={alert}
                autoHideDuration={6000} // Duration on milliseconds before closing the alert
                onClose={() => setAlert(false)}
                anchorOrigin={{ vertical: 'down', horizontal: 'left' }} // Snackbar's screen relative position
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