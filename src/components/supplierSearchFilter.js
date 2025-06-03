import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function SupplierSearchFilter({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(null); // null for "all", true for "active", false for "inactive"

    const handleSearch = () => {
        onSearch(searchTerm, isActive);
    };

    const handleClear = () => {
        setSearchTerm('');
        setIsActive(null);
        onSearch('', null); // Clear search results in parent
    };

    return (
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', m: 1, justifyContent: 'space-between' }}>
            <TextField
                label="Search by Name or Contact Info"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                sx={{
                    minWidth: 250,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#384dc9',},
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#384dc9',},}}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isActive === true}
                        onChange={() => setIsActive(isActive === true ? null : true)}
                        sx={{ color: '#384dc9', '&.Mui-checked': { color: '#384dc9', }, }}
                    />
                }
                label="Active Suppliers"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isActive === false}
                        onChange={() => setIsActive(isActive === false ? null : false)}
                        sx={{ color: '#384dc9', '&.Mui-checked': { color: '#384dc9', }, }}
                    />
                }
                label="Inactive Suppliers"
            />
            <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{ height: 40, fontWeight: 'bold', backgroundColor: '#384dc9' }}
            >
                Search
            </Button>
            <Button
                variant="outlined"
                onClick={handleClear}
                sx={{ height: 40, fontWeight: 'bold', borderColor: '#384dc9', color: '#384dc9' }}
            >
                Clear Filters
            </Button>
        </Box>
    );
}

export default SupplierSearchFilter;