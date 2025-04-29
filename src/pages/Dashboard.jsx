import React, { useState, useEffect } from "react";
import { Header, Footer } from '../components';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import StockSearch from '../components/StockSearch';
import "../styles/Dashboard.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [tradingData, setTradingData] = useState({
    sellPrice: "", 
    buyPrice: "", 
    stock: "", 
    timeBought: "", 
    timeSold: "",
    amountOfShares: "", 
    fees: ""
  });
  
  const [dividendData, setDividendData] = useState({
    dividendsMade: "", 
    whichStock: "", 
    payDay: ""
  });
  
  const [withdrawData, setWithdrawData] = useState({
    withdrawAmount: "", 
    whenTaken: ""
  });
  
  const [depositData, setDepositData] = useState({
    depositAmount: "", 
    whenTaken: ""
  });

  const [tradingSummary, setTradingSummary] = useState({
    mostTraded: [],
    mostProfitable: [],
    mostLoss: []
  });
  
  // Success/error messages
  const [message, setMessage] = useState({ text: "", type: "" });

  // NEW CODE: Add this useEffect hook for auto-dismissing messages
  useEffect(() => {
    // Create a timeout only if we have a message
    if (message.text) {
      // Store timeout ID for cleanup
      const timer = setTimeout(() => {
        // Clear the message after timeout
        setMessage({ text: "", type: "" });
      }, 1000); // 1 second timeout
      
      // Cleanup function that runs if component unmounts or message changes
      return () => clearTimeout(timer);
    }
  }, [message.text]); // Only run when message.text changes

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Add after other useEffect hooks
useEffect(() => {
  if (!currentUser) return;
  
  const fetchTradingSummary = async () => {
    try {
      const db = getFirestore();
      const tradesRef = collection(db, `users/${currentUser.uid}/tradingData`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tradesSnapshot = await getDocs(tradesRef);
      const todaysTrades = tradesSnapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(trade => {
          const tradeDate = new Date(trade.timeSold);
          return tradeDate >= today;
        });

      // Most traded assets (change from 3 to 2)
      const tradesByStock = todaysTrades.reduce((acc, trade) => {
        acc[trade.stock] = (acc[trade.stock] || 0) + 1;
        return acc;
      }, {});

      const mostTraded = Object.entries(tradesByStock)
        .map(([symbol, count]) => ({ symbol, trades: count }))
        .sort((a, b) => b.trades - a.trades)
        .slice(0, 2);  // Changed from 3 to 2

      // Calculate profit/loss for each trade
      const tradesWithProfit = todaysTrades.map(trade => ({
        ...trade,
        profit: (trade.sellPrice - trade.buyPrice) * trade.amountOfShares - (trade.fees || 0)
      }));

      // Split into profitable and loss trades
      const profitableTrades = tradesWithProfit
        .filter(trade => trade.profit > 0)
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 2);

      const lossTrades = tradesWithProfit
        .filter(trade => trade.profit < 0)
        .sort((a, b) => a.profit - b.profit)
        .slice(0, 2);

      setTradingSummary({
        mostTraded,
        mostProfitable: profitableTrades,
        mostLoss: lossTrades
      });
    } catch (error) {
      console.error("Error fetching trading summary:", error);
    }
  };

  fetchTradingSummary();
}, [currentUser]);

  const handleTradingSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Validate all fields are filled
    for (const key in tradingData) {
      if (!tradingData[key]) {
        setMessage({ text: `Please fill in the ${key} field`, type: "error" });
        return;
      }
    }
    
    // Validate time sold is after time bought
    const timeBoughtDate = new Date(tradingData.timeBought);
    const timeSoldDate = new Date(tradingData.timeSold);
    
    if (timeSoldDate <= timeBoughtDate) {
      setMessage({ text: "Time sold must be after time bought", type: "error" });
      return;
    }
    
    // Continue with form submission
    try {
      const db = getFirestore();
      await addDoc(collection(db, `users/${currentUser.uid}/tradingData`), {
        ...tradingData,
        buyPrice: parseFloat(tradingData.buyPrice),
        sellPrice: parseFloat(tradingData.sellPrice),
        amountOfShares: parseInt(tradingData.amountOfShares),
        fees: parseFloat(tradingData.fees),
        createdAt: serverTimestamp()
      });
      
      setTradingData({
        sellPrice: "", 
        buyPrice: "", 
        stock: "", 
        timeBought: "", 
        timeSold: "",
        amountOfShares: "", 
        fees: ""
      });
      
      setMessage({ text: "Trading data saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    }
  };

  const handleDividendSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    // Validate all fields are filled
    for (const key in dividendData) {
      if (!dividendData[key]) {
        setMessage({ text: `Please fill in the ${key} field`, type: "error" });
        return;
      }
    }
    
    try {
      const db = getFirestore();
      await addDoc(collection(db, `users/${currentUser.uid}/dividends`), {
        ...dividendData,
        dividendsMade: parseFloat(dividendData.dividendsMade),
        createdAt: serverTimestamp()
      });
      
      setDividendData({
        dividendsMade: "", 
        whichStock: "", 
        payDay: ""
      });
      
      setMessage({ text: "Dividend data saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      const db = getFirestore();
      await addDoc(collection(db, `users/${currentUser.uid}/withdrawals`), {
        ...withdrawData,
        createdAt: serverTimestamp()
      });
      
      setWithdrawData({
        withdrawAmount: "", 
        whenTaken: ""
      });
      
      setMessage({ text: "Withdrawal data saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    try {
      const db = getFirestore();
      await addDoc(collection(db, `users/${currentUser.uid}/deposits`), {
        ...depositData,
        createdAt: serverTimestamp()
      });
      
      setDepositData({
        depositAmount: "", 
        whenTaken: ""
      });
      
      setMessage({ text: "Deposit data saved successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: `Error: ${error.message}`, type: "error" });
    }
  };





  // New state variables for tracking profits/losses
  const [profitStats, setProfitStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    allTime: 0
  });
  const [statsData, setStatsData] = useState({
  fees: 0,
  dividends: 0,
  totalShares: 0,
  totalAssets: 0,
  totalTrades: 0,
});
  // Add this before the return statement
  const formatProfit = (amount) => {
    if (amount === null || amount === 0) {
      return { value: "0", color: "#80ff00" };
    }
    return {
      value: amount > 0 ? `+$${Math.abs(amount).toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`,
      color: amount >= 0 ? "#80ff00" : "#DC143C"
    };
  };

  // Function to calculate trade profit
  const calculateTradeProfit = (trade) => {
    const { sellPrice, buyPrice, amountOfShares, fees = 0 } = trade;
    return ((sellPrice - buyPrice) * amountOfShares) - fees;
  };

  // Update the useEffect that calculates profits
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchProfitData = async () => {
      try {
        const db = getFirestore();
        // Fetch trades
        const tradesRef = collection(db, `users/${currentUser.uid}/tradingData`);
        const tradesSnapshot = await getDocs(tradesRef);
        const trades = tradesSnapshot.docs.map(doc => doc.data());
        
        // Fetch dividends separately (only for display, not for profit calculation)
        const dividendsRef = collection(db, `users/${currentUser.uid}/dividends`);
        const dividendsSnapshot = await getDocs(dividendsRef);
        const dividends = dividendsSnapshot.docs.map(doc => doc.data());
        
        // Calculate stats
        let totalFees = 0;
        let totalShares = 0;
        let totalDividends = 0;
        const uniqueAssets = new Set();
        
        // Initialize profit variables
        let todayProfit = 0;
        let weekProfit = 0;
        let monthProfit = 0;
        let allTimeProfit = 0;
        
        // Get current date info
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        
        // Process trades (excluding dividends from profit calculations)
        trades.forEach(trade => {
          totalFees += parseFloat(trade.fees) || 0;
          totalShares += parseInt(trade.amountOfShares) || 0;
          uniqueAssets.add(trade.stock);
          
          // Calculate profit for this trade
          const profit = calculateTradeProfit(trade);
          const tradeDate = new Date(trade.timeSold).getTime();
          
          // Add to all time profit (trades only)
          allTimeProfit += profit;
          
          // Check if trade was today
          if (tradeDate >= today) {
            todayProfit += profit;
          }
          
          // Check if trade was this week
          if (tradeDate >= weekStart) {
            weekProfit += profit;
          }
          
          // Check if trade was this month
          if (tradeDate >= monthStart) {
            monthProfit += profit;
          }
        });
        
        // Calculate total dividends separately (not included in profit calculations)
        dividends.forEach(dividend => {
          totalDividends += parseFloat(dividend.dividendsMade) || 0;
        });
        
        // Update profit stats (trades only) and statsData
        setProfitStats({
          today: todayProfit,
          thisWeek: weekProfit,
          thisMonth: monthProfit,
          allTime: allTimeProfit
        });
        
        setStatsData({
          fees: totalFees,
          dividends: totalDividends, // Displayed separately in the dividends card
          totalShares: totalShares,
          totalAssets: uniqueAssets.size,
          totalTrades: trades.length
        });
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchProfitData();
    
  }, [currentUser]);

  // Add this state with your other state variables
const [weeklyProfitLossData, setWeeklyProfitLossData] = useState([]);

// Add this useEffect to calculate weekly profit/loss data
useEffect(() => {
  if (!currentUser) return;
  
  const fetchWeeklyProfitLossData = async () => {
    try {
      const db = getFirestore();
      const tradesRef = collection(db, `users/${currentUser.uid}/tradingData`);
      const tradesSnapshot = await getDocs(tradesRef);
      const trades = tradesSnapshot.docs.map(doc => ({
        ...doc.data(),
        timeSold: new Date(doc.data().timeSold)
      }));
      
      // Sort trades by date
      trades.sort((a, b) => a.timeSold - b.timeSold);
      
      // Group by week
      const weekMap = {};
      const now = new Date();
      const currentYear = now.getFullYear();
      
      trades.forEach(trade => {
        // Calculate trade profit
        const profit = ((trade.sellPrice - trade.buyPrice) * trade.amountOfShares) - (trade.fees || 0);
        
        // Get week number
        const tradeDate = trade.timeSold;
        if (tradeDate.getFullYear() !== currentYear) return; // Only current year
        
        // Get the week number (0-based, where 0 is the first week)
        const startOfYear = new Date(currentYear, 0, 1);
        const days = Math.floor((tradeDate - startOfYear) / (24 * 60 * 60 * 1000));
        const weekNum = Math.floor(days / 7);
        
        // Add to the right week
        if (!weekMap[weekNum]) {
          weekMap[weekNum] = {
            weekNum,
            profits: 0,
            losses: 0
          };
        }
        
        // Add to profits or losses
        if (profit >= 0) {
          weekMap[weekNum].profits += profit;
        } else {
          weekMap[weekNum].losses += Math.abs(profit);
        }
      });
      
      // Convert to array
      const weeklyData = Object.values(weekMap)
        .sort((a, b) => a.weekNum - b.weekNum)
        .map(week => ({
          week: `Week ${week.weekNum + 1}`,
          profits: week.profits,
          losses: -week.losses // Negative for display
        }));
      
      setWeeklyProfitLossData(weeklyData);
    } catch (error) {
      console.error("Error fetching weekly profit/loss data:", error);
    }
  };
  
  fetchWeeklyProfitLossData();
}, [currentUser]);


  const [depositChartData, setDepositChartData] = useState([
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
    { month: 'Jul', amount: 0 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 0 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 0 }
  ]);

  // Add this useEffect to fetch deposit data
  useEffect(() => {
    if (!currentUser) return;

    const fetchDepositData = async () => {
      try {
        const db = getFirestore();
        const depositsRef = collection(db, `users/${currentUser.uid}/deposits`);
        const depositsSnapshot = await getDocs(depositsRef);
        const deposits = depositsSnapshot.docs.map(doc => ({
          ...doc.data(),
          whenTaken: doc.data().whenTaken ? new Date(doc.data().whenTaken) : new Date()
        }));

        // Initialize monthly totals and counts
        const monthlyData = Array(12).fill().map(() => ({
          amount: 0,
          count: 0
        }));

        // Calculate total deposits and count for each month
        deposits.forEach(deposit => {
          const month = deposit.whenTaken.getMonth();
          monthlyData[month].amount += parseFloat(deposit.depositAmount) || 0;
          monthlyData[month].count += 1;
        });

        // Update chart data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const newChartData = months.map((month, index) => ({
          month,
          amount: monthlyData[index].amount,
          count: monthlyData[index].count
        }));

        setDepositChartData(newChartData);
      } catch (error) {
        console.error("Error fetching deposit data:", error);
      }
    };

    fetchDepositData();
  }, [currentUser]);


  // Add this state for withdrawal chart data
const [withdrawalChartData, setWithdrawalChartData] = useState([
  { month: 'Jan', amount: 0, count: 0 },
  { month: 'Feb', amount: 0, count: 0 },
  { month: 'Mar', amount: 0, count: 0 },
  { month: 'Apr', amount: 0, count: 0 },
  { month: 'May', amount: 0, count: 0 },
  { month: 'Jun', amount: 0, count: 0 },
  { month: 'Jul', amount: 0, count: 0 },
  { month: 'Aug', amount: 0, count: 0 },
  { month: 'Sep', amount: 0, count: 0 },
  { month: 'Oct', amount: 0, count: 0 },
  { month: 'Nov', amount: 0, count: 0 },
  { month: 'Dec', amount: 0, count: 0 }
]);

// Add this useEffect to fetch withdrawal data
useEffect(() => {
  if (!currentUser) return;

  const fetchWithdrawalData = async () => {
    try {
      const db = getFirestore();
      const withdrawalsRef = collection(db, `users/${currentUser.uid}/withdrawals`);
      const withdrawalsSnapshot = await getDocs(withdrawalsRef);
      const withdrawals = withdrawalsSnapshot.docs.map(doc => ({
        ...doc.data(),
        whenTaken: doc.data().whenTaken ? new Date(doc.data().whenTaken) : new Date()
      }));

      // Initialize monthly totals and counts
      const monthlyData = Array(12).fill().map(() => ({
        amount: 0,
        count: 0
      }));

      // Calculate total withdrawals and count for each month
      withdrawals.forEach(withdrawal => {
        const month = withdrawal.whenTaken.getMonth();
        monthlyData[month].amount += parseFloat(withdrawal.withdrawAmount) || 0;
        monthlyData[month].count += 1;
      });

      // Update chart data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const newChartData = months.map((month, index) => ({
        month,
        amount: monthlyData[index].amount,
        count: monthlyData[index].count
      }));

      setWithdrawalChartData(newChartData);
    } catch (error) {
      console.error("Error fetching withdrawal data:", error);
    }
  };

  fetchWithdrawalData();
}, [currentUser]);



  if (loading) {
    return <div className="trading-loading">Loading...</div>;
  }

  if (!currentUser) {
    return (
      <div className="trading-dashboard">
        <Header/>
        <div className="trading-dashboard-container">
          <h1>You must be logged in to access the Dashboard</h1>
        </div>
        <Footer/>
      </div>
    );
  }

const getCurrentMonthName = () => {
  const now = new Date();
  return now.toLocaleString('default', { month: 'long' }); // Returns full month name (e.g., "April")
};


  return (
    <div className="trading-dashboard">
      <Header />
      <div className="trading-dashboard-container">
        <div className="dashboard-header">
          <h1>Your Trading Dashboard</h1>
          
          {message.text && (
            <div className={`trading-message trading-${message.type}`}>
              {message.text}
            </div>
          )}
        </div>
        
        <div className="dashboard-content">
          {/* Forms container - left side */}
          <div className="forms-container">
            <div className="trading-dashboard-sections">
              {/* Your existing forms here */}
              <div className="trading-form-container">
                <h2>Record a Trade</h2>
                <form onSubmit={handleTradingSubmit} className="trading-form">
                  <div className="trading-form-row">
                    <label htmlFor="buyPrice">Buy Price:</label>
                    <input
                      type="number"
                      id="buyPrice"
                      placeholder="Enter purchase price (e.g. 42.50)"
                      value={tradingData.buyPrice}
                      onChange={(e) => setTradingData({...tradingData, buyPrice: e.target.value})}
                      required
                      step="0.01"
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="sellPrice">Sell Price:</label>
                    <input
                      type="number"
                      id="sellPrice"
                      placeholder="Enter selling price (e.g. 45.75)"
                      value={tradingData.sellPrice}
                      onChange={(e) => setTradingData({...tradingData, sellPrice: e.target.value})}
                      required
                      step="0.01"
                    />
                  </div>
                  
                  <div className="trading-form-row StockSearch">
                    <label htmlFor="stock">Stock:</label>
                    <StockSearch
                      value={tradingData.stock}
                      onChange={(newValue) => setTradingData({...tradingData, stock: newValue})}
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="timeBought">Time Bought:</label>
                    <input
                      type="datetime-local"
                      id="timeBought"
                      value={tradingData.timeBought}
                      onChange={(e) => setTradingData({...tradingData, timeBought: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="timeSold">Time Sold:</label>
                    <input
                      type="datetime-local"
                      id="timeSold"
                      value={tradingData.timeSold}
                      onChange={(e) => setTradingData({...tradingData, timeSold: e.target.value})}
                      required
                    />
                  </div>
                  
                  {/* Update the amount of shares input field */}
                  <div className="trading-form-row">
                    <label htmlFor="amountOfShares">Amount Of Shares:</label>
                    <input
                      type="number"
                      id="amountOfShares"
                      placeholder="Enter number of shares (e.g. 10)"
                      value={tradingData.amountOfShares}
                      onChange={(e) => setTradingData({...tradingData, amountOfShares: e.target.value})}
                      required
                      min="1"  // Ensures shares are at least 1
                      step="1"  // Ensures whole numbers
                    />
                  </div>
                  
                  {/* Update the fees input field */}
                  <div className="trading-form-row">
                    <label htmlFor="fees">Fees:</label>
                    <input
                      type="number"
                      id="fees"
                      placeholder="Enter trading fees (e.g. 1.99)"
                      value={tradingData.fees}
                      onChange={(e) => setTradingData({...tradingData, fees: e.target.value})}
                      required
                      min="0"  // Ensures no negative values
                      step="0.01"
                    />
                  </div>
                  
                  <button type="submit" className="trading-submit-button">Save Trade</button>
                </form>
              </div>
              
              {/* Dividends Form */}
              <div className="trading-form-container ">
                <h2>Record Dividends</h2>
                <form onSubmit={handleDividendSubmit} className="trading-form">
                  <div className="trading-form-row ">
                    <label htmlFor="dividendsMade">Dividends Amount:</label>
                    <input
                      type="number"
                      id="dividendsMade"
                      placeholder="Enter dividend amount (e.g. 25.00)"
                      value={dividendData.dividendsMade}
                      onChange={(e) => setDividendData({...dividendData, dividendsMade: e.target.value})}
                      required
                      min="0.01"  // Ensures positive value
                      step="0.01"
                    />
                  </div>
                  
                  <div className="trading-form-row StockSearch">
                    <label htmlFor="whichStock">Stock:</label>
                    <StockSearch
                      value={dividendData.whichStock}
                      onChange={(newValue) => setDividendData({...dividendData, whichStock: newValue})}
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="payDay">Pay Day:</label>
                    <input
                      type="date"
                      id="payDay"
                      value={dividendData.payDay}
                      onChange={(e) => setDividendData({...dividendData, payDay: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="trading-submit-button">Save Dividend</button>
                </form>
              </div>
              
              {/* Withdrawals Form */}
              <div className="trading-form-container">
                <h2>Record Withdrawals</h2>
                <form onSubmit={handleWithdrawSubmit} className="trading-form">
                  <div className="trading-form-row">
                    <label htmlFor="withdrawAmount">Withdraw Amount:</label>
                    <input
                      type="number"
                      id="withdrawAmount"
                      placeholder="Enter withdrawal amount"
                      value={withdrawData.withdrawAmount}
                      onChange={(e) => setWithdrawData({...withdrawData, withdrawAmount: e.target.value})}
                      required
                      min="0.01"  // Ensures positive value
                      step="0.01"
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="whenTaken">When Taken?</label>
                    <input
                      type="date"
                      id="whenTaken"
                      value={withdrawData.whenTaken}
                      onChange={(e) => setWithdrawData({...withdrawData, whenTaken: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="trading-submit-button">Save Withdrawal</button>
                </form>
              </div>
              
              {/* Deposits Form */}
              <div className="trading-form-container">
                <h2>Record Deposits</h2>
                <form onSubmit={handleDepositSubmit} className="trading-form">
                  {/* Update the deposit amount input */}
                  <div className="trading-form-row">
                    <label htmlFor="depositAmount">Deposit Amount:</label>
                    <input
                      type="number"
                      id="depositAmount"
                      placeholder="Enter deposit amount"
                      value={depositData.depositAmount}
                      onChange={(e) => setDepositData({...depositData, depositAmount: e.target.value})}
                      required
                      min="0.01"  // Ensures positive value
                      step="0.01"
                    />
                  </div>
                  
                  <div className="trading-form-row">
                    <label htmlFor="depositWhenTaken">When Taken?</label>
                    <input
                      type="date"
                      id="depositWhenTaken"
                      value={depositData.whenTaken}
                      onChange={(e) => setDepositData({...depositData, whenTaken: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="trading-submit-button">Save Deposit</button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Stats container - right side */}
          <div className="stats-container">

            <div className="Profits-Losses-summary-cards">
              <div className="Profits-Losses-summary-card">
                <h3>Profits/Losses</h3>
                <p className="profit-value" style={{ color: formatProfit(profitStats.today).color }}>
                  {formatProfit(profitStats.today).value}
                </p>
                <p className="time-period">Today</p>
              </div>
              
              <div className="Profits-Losses-summary-card">
                <h3>Profits/Losses</h3>
                <p className="profit-value" style={{ color: formatProfit(profitStats.thisWeek).color }}>
                  {formatProfit(profitStats.thisWeek).value}
                </p>
                <p className="time-period">This Week</p>
              </div>
              
              <div className="Profits-Losses-summary-card">
                <h3>Profits/Losses</h3>
                <p className="profit-value" style={{ color: formatProfit(profitStats.thisMonth).color }}>
                  {formatProfit(profitStats.thisMonth).value}
                </p>
                <p className="time-period">This Month ({getCurrentMonthName()})</p> {/* Dynamically show the current month */}
              </div>
              
              <div className="Profits-Losses-summary-card">
                <h3>Profits/Losses</h3>
                <p className="profit-value" style={{ color: formatProfit(profitStats.allTime).color }}>
                  {formatProfit(profitStats.allTime).value}
                </p>
                <p className="time-period">All Time</p>
              </div>
            </div>

            <div className="stats-summary-cards">
              <div className="stats-summary-card">
                <h3>Fees</h3>
                <p className="stat-value" style={{ color: statsData.fees > 0 ? "#DC143C" : "#80ff00" }}>
                  - ${statsData.fees.toFixed(2)}
                </p>
                <p className="stat-period">Taken In This Year</p>
              </div>
              <div className="stats-summary-card">
                <h3>Dividends</h3>
                <p className="stat-value" style={{ color: "#80ff00" }}>
                  + ${statsData.dividends.toFixed(2)}
                </p>
                <p className="stat-period">Made In This Year</p>
              </div>
              <div className="stats-summary-card">
                <h3>Total Traded Shares</h3>
                <p className="stat-value">{statsData.totalShares.toFixed(2)}</p>
                <p className="stat-period"></p>
              </div>
              <div className="stats-summary-card">
                <h3>Total Traded Assets</h3>
                <p className="stat-value">{statsData.totalAssets}</p>
                <p className="stat-period"></p>
              </div>
              <div className="stats-summary-card">
                <h3>Total Trades
                  <br />
                  <p></p>
                </h3>
                <p className="stat-value">{statsData.totalTrades}</p>
                <p className="stat-period"></p>
              </div>
            </div>
            <div className="stats-summary-cards-2">
              <div className="trading-summary-section">
                <h2>Most Traded Assets Today</h2>
                <div className="trading-summary-list">
                  {tradingSummary.mostTraded.length > 0 ? (
                    tradingSummary.mostTraded.map((item, index) => (
                      <div key={`traded-${index}`} className="trading-summary-item">
                        <span className="trading-summary-text">{item.symbol}</span>
                        <span className="trading-summary-value">{item.trades} Trades</span>
                      </div>
                    ))
                  ) : (
                    Array(2).fill(null).map((_, index) => (  // Changed from 3 to 2
                      <div key={`traded-empty-${index}`} className="trading-summary-item empty">
                        <span className="trading-summary-text">No data available</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="trading-summary-section">
                <h2>Most Profitable Trades Today</h2>
                <div className="trading-summary-list">
                  {tradingSummary.mostProfitable.map((trade, index) => (
                    <div key={`profit-${index}`} className="trading-summary-item">
                      <span className="trading-summary-text">{trade.stock}</span>
                      <span className="trading-summary-value profit">
                        +${trade.profit.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
                
              <div className="trading-summary-section">
                <h2>Most Loss Trades Today</h2>
                <div className="trading-summary-list">
                  {tradingSummary.mostLoss.map((trade, index) => (
                    <div key={`loss-${index}`} className="trading-summary-item">
                      <span className="trading-summary-text">{trade.stock}</span>
                      <span className="trading-summary-value loss">
                        -${Math.abs(trade.profit).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="deposits-section">
              <h2>Deposits Overview</h2>
              <div className="deposits-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={depositChartData}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: '#f7f7f7' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: '#f7f7f7' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      contentStyle={{
                        backgroundColor: '#191919',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#f7f7f7'
                      }}
                      formatter={(value, name, props) => {
                        // Get the count from the payload data
                        const count = props.payload.count;
                        const depositText = count === 1 ? 'deposit' : 'deposits';
                        return [`$${value.toFixed(2)} (${count} ${depositText})`, 'Total'];
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#48D0E5" 
                      radius={[16, 16, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="withdrawals-section">
              <h2>Withdrawals Overview</h2>
              <div className="withdrawals-chart">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={withdrawalChartData}>
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: '#f7f7f7' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      style={{ fill: '#f7f7f7' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                      contentStyle={{
                        backgroundColor: '#191919',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#f7f7f7'
                      }}
                      formatter={(value, name, props) => {
                        // Get the count from the payload data
                        const count = props.payload.count;
                        const withdrawalText = count === 1 ? 'withdrawal' : 'withdrawals';
                        return [`$${value.toFixed(2)} (${count} ${withdrawalText})`, 'Total'];
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="#DC143C" 
                      radius={[16, 16, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Weekly Profit/Loss Chart */}
<div className="profit-loss-section">
  <h2>Profits/Losses by Week</h2>
  <div className="profit-loss-chart">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={weeklyProfitLossData} 
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
        <XAxis 
          dataKey="week" 
          axisLine={false}
          tickLine={false}
          style={{ fill: '#f7f7f7' }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          style={{ fill: '#f7f7f7' }}
          tickFormatter={(value) => `$${Math.abs(value)}`}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{
            backgroundColor: '#191919',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#f7f7f7'
          }}
          formatter={(value, name) => {
            const absValue = Math.abs(value);
            const sign = name === 'profits' ? '+' : '-';
            return [`${sign}$${absValue.toFixed(2)}`, name === 'profits' ? 'Profit' : 'Loss'];
          }}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="profits" fill="#80ff00" radius={[16, 16, 0, 0]} />
        <Bar dataKey="losses" fill="#DC143C" radius={[16, 16, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}


export default Dashboard;