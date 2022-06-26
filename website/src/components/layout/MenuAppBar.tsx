import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { Fragment } from "react";
import ThemeModeToggleButton from "../../styles/ThemeModeToggleButton";
import LeftMenu from "./LeftMenu";

// To add a little padding to the bottom nav bar when the user is all the way scrolled up.
const MenuAppBarBottomPadding = styled("div")(({ theme }) => ({
  height: theme.spacing(2),
}));

// Define a TypeScript Type for the MenuAppBar Props
declare type MenuAppBarProps = {
  title: string;
};

// Define a Common AppBar UI Component with a left and right menu and theme toggle.
const MenuAppBar: React.FunctionComponent<MenuAppBarProps> = ({ title }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <AppBar position="sticky">
        <Toolbar>
          {/* Left Hand Menu */}
          <LeftMenu />

          {/* Page/Site Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {/* Toggle Button for the Theme Mode */}
          <ThemeModeToggleButton />

          {/* User Icon and Menu */}
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <MenuAppBarBottomPadding />
    </Fragment>
  );
};

export default MenuAppBar;
