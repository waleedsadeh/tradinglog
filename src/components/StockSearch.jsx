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
          `https://api.twelvedata.com/symbol_search?symbol=${inputValue}&apikey=${process.env.REACT_APP_TWELVE_DATA_API_KEY}`
        );
        const data = await response.json();
        console.log('API Response:', data);

        if (data.data) {
          const stockOptions = data.data
            // Filter only US stocks and common stocks
            .filter(item => 
              item.instrument_type === 'Common Stock' && 
              (item.exchange === 'NYSE' || item.exchange === 'NASDAQ')
            )
            // Limit to first 10 results
            .slice(0, 10)
            // Map to required format
            .map(item => ({
              symbol: item.symbol,
              name: item.instrument_name,
              exchange: item.exchange
            }));
          console.log('Processed options:', stockOptions);
          setOptions(stockOptions);
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setOptions([]);
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
        typeof option === 'string' 
          ? option 
          : `${option.symbol} - ${option.name} (${option.exchange})`
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