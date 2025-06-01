import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigate('/supplier')}
        >
          Manage Suppliers
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate('/category')}
        >
          Manage Categories
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
