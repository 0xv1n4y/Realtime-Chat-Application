import React, { Suspense, useEffect, useRef } from "react";
import { Box, CssBaseline } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";  // Import Router, Routes, and Route
import "./sass/_main.scss";
import { fetchTokenDetails } from "./store/actions/auth-actions";

// Lazy-loaded components
const Auth = React.lazy(() => import("./auth/Auth"));
const Main = React.lazy(() => import("./pages/Main"));

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const fetchOnce = useRef(false);

  const isLoginAuthenticated = useSelector(state => state.authUserDataReducer.isAuthenticated);
  const isSignupAuthenticated = useSelector(state => state.addNewUserReducer.isAuthenticated);
  const tokenDetails = useSelector(state => state.fetchTokenDetailsReducer.isAuthenticated);
 

  // Fetch token details if not already fetched
  useEffect(() => {
    if (!fetchOnce.current) {
      dispatch(fetchTokenDetails());
      fetchOnce.current = true;
    }
  }, [dispatch]);

  // Redirect user to main if already authenticated
  useEffect(() => {
    if (isLoginAuthenticated || isSignupAuthenticated || tokenDetails) {
      navigate('/'); // Redirect to the main page when authenticated
    } else if(!isLoginAuthenticated && !isSignupAuthenticated && !tokenDetails) {
      navigate("/auth"); // Redirect to the auth page if not authenticated
    }
  }, [isLoginAuthenticated, isSignupAuthenticated, tokenDetails, navigate]);


  return (
    <Box className="app-main-header">
      <CssBaseline />
      <Suspense fallback={<div>Loading.......</div>}>
        <Routes>
          {/* Conditional routing for authenticated or unauthenticated state */}
          {(isLoginAuthenticated || isSignupAuthenticated || tokenDetails) ? (
            <Route path="/" element={<Main />} />
          ) : (
            <Route path="/auth" element={<Auth />} />
          )}
        </Routes>
      </Suspense>
    </Box>
  );
}

export default App;
