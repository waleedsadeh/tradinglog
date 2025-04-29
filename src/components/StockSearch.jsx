import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const StockSearch = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      if (inputValue.length < 2) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=YOUR_API_KEY`
        );
        const data = await response.json();
        
        if (data.bestMatches) {
          const stockOptions = data.bestMatches.map(match => ({
            symbol: match['1. symbol'],
            name: match['2. name']
          }));
          setOptions(stockOptions);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(fetchStocks, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.symbol : '');
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : `${option.symbol} - ${option.name}`
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a company or symbol"
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#191919',
              borderRadius: '0.5rem',
              border: '2px solid #f7f7f7',
              color: '#f7f7f7',
              '& fieldset': {
                border: 'none'
              }
            }
          }}
        />
      )}
      loading={loading}
      filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => 
        option.symbol === (typeof value === 'string' ? value : value.symbol)
      }
    />
  );
};

export default StockSearch;