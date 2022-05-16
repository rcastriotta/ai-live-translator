import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Host from './pages/Host';
import Join from './pages/Join';
import './App.css';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        {/*<Header />*/}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join" element={<Join />} />
        </Routes>
        {/*<Footer />*/}
      </Router>
    </ChakraProvider>
  );
}

export default App;
