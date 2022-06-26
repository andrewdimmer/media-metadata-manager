import { Home as HomeIcon, Menu as MenuIcon } from "@mui/icons-material";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";

// Define a TypeScript Type for each Menu Item List Item
declare type MenuItemListItem = {
  displayName: string;
  icon?: React.ReactNode;
  route: string;
};

// Define a list of the content to include in the menu
const menuItemsList: MenuItemListItem[] = [
  { displayName: "Home", route: "/", icon: <HomeIcon /> },
];

// Define a Left Menu Component
const LeftMenu: React.FunctionComponent = () => {
  // Get the React Router useNavigate Hook to be able to change pages on the menu click
  const navigate = useNavigate();

  // Define a state to keep track of whether or not the menu is open
  const [isOpen, setIsOpen] = React.useState(false);

  // Define a standard function to generate the list of menu items from the menuItemsList
  const list = () => (
    <List>
      {menuItemsList.map(({ displayName, icon, route }) => (
        <ListItem
          key={`LeftMenuItem_${displayName}`}
          disablePadding
          onClick={() => navigate(route)}
        >
          <ListItemButton>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={displayName} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Fragment>
      {/* Menu toggle button */}
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MenuIcon />
      </IconButton>

      {/* The Left Menu */}
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setIsOpen(false)}
          onKeyDown={() => setIsOpen(false)}
        >
          {list()}
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default LeftMenu;
