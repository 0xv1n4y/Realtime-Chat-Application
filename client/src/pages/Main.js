import React, { Suspense, useEffect, useRef, useState } from "react";
import { AppBar, Box, CssBaseline, Drawer, Toolbar } from "@mui/material";
import { resetUsers } from "../store/actions/user-actions";
import { useDispatch } from "react-redux";

const Chat = React.lazy(() => import("../pages/Chat"));
const Header = React.lazy(() => import("../pages/Header"));
const MenuDrawer = React.lazy(() => import("../pages/Components/MenuDrawer"));

const Main = () => {

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(resetUsers());
  };

  return (
    <Box>
      <AppBar position="fixed" className="app-bar" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <Header handleDrawerToggle={handleDrawerToggle} />
            </Toolbar>
      </AppBar>
      <Drawer className="drawer" variant="persistent" anchor="left" open={open}>
        <Toolbar />
        <Box className="drawer-content">
          <MenuDrawer setOpen={setOpen} />
        </Box>
      </Drawer>
      <Toolbar />
      <Chat />
    </Box>
  )
}

export default Main