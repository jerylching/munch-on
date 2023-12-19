import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import pantryData from "../../../pantryItems.json";

const PantryPage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const reduxState = useSelector((state) => state);
  console.log("Redux State:", reduxState);
  const username = useSelector((state) => state.user.username);
  const [pantryItems, setPantryItems] = useState(() => {
    const savedPantryItems = localStorage.getItem("pantryList");
    return savedPantryItems ? JSON.parse(savedPantryItems) : pantryData;
  });

  const [newItem, setNewItem] = useState({
    ingredientName: "",
    ingredientCode: "",
    image: "",
    quantity: 0,
    unitOfMeasurement: "",
    identity: username,
  });

  const [editingIndex, setEditingIndex] = useState(-1); // -1 means no edit mode
  const [editItem, setEditItem] = useState({
    quantity: 0,
    unitOfMeasurement: "",
  });

  // useEffect(() => {
  //   localStorage.setItem("pantryList", JSON.stringify(pantryItems));
  // }, [pantryItems]);

  // Use the useSelector hook to access the token from the Redux store

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Token:", token);
        // Use the token from the Redux store
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pantry`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await response.json();
        console.log(data);
        // Assuming setPantryItems is a state updater function
        setPantryItems(data.data);
      } catch (error) {
        console.error("Error fetching pantry items:", error);
      }
    };

    fetchData();
  }, [token, dispatch]);

  const handleChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  const handleEditChange = (event) => {
    setEditItem({ ...editItem, [event.target.name]: event.target.value });
  };

  // const handleAddPantryItem = () => {
  //   if (
  //     !newItem.ingredientName ||
  //     !newItem.quantity ||
  //     !newItem.unitOfMeasurement
  //   ) {
  //     alert("Please fill out all fields before adding to the list.");
  //     return;
  //   }
  //   const updatedPantryItems = [...pantryItems, { ...newItem, id: Date.now() }];
  //   setPantryItems(updatedPantryItems);
  //   setNewItem({
  //     ingredientName: "",
  //     ingredientCode: "",
  //     image: "",
  //     quantity: 0,
  //     unitOfMeasurement: "",
  //     identity: username,
  //   });
  // };

  const handleAddPantryItem = async () => {
    try {
      const authToken = token; // Assuming `token` is already defined

      const url = `${import.meta.env.VITE_API_URL}/pantry/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        alert("Successful Added Item");
        window.location.reload();
      } else {
        alert("Error Registering Item.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error Registering Item.");
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditItem({
      quantity: pantryItems[index].quantity,
      unitOfMeasurement: pantryItems[index].unitOfMeasurement,
    });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const authToken = token; // Replace with your actual token

      // Update quantity using fetch
      await fetch(`${import.meta.env.VITE_API_URL}/pantry/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify({
          quantity: parseInt(editItem.quantity),
          unitOfMeasurement: editItem.unitOfMeasurement,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeletePantryItem = async (itemId) => {
    try {
      const authToken = token;
      await fetch(`${import.meta.env.VITE_API_URL}/pantry/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${authToken}`,
        },
      });
      alert("Item deleted successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#E5D9D2", // Light beige background
        minHeight: "100vh",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          order: { xs: 2, sm: 1 },
          marginTop: { xs: "20px", sm: "100px" },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "20px", color: "#1F3528" }}
        >
          Pantry List
        </Typography>
        {pantryItems.map((item, index) => (
          <Paper
            key={item.id || index}
            elevation={4}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "10px",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={item.image}
                alt={item.ingredientName}
                style={{ width: "100px", height: "100px", marginRight: "10px" }}
              />
              <Typography variant="h6">{item.ingredientName}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {editingIndex === index ? (
                <>
                  <TextField
                    name="quantity"
                    type="number"
                    value={editItem.quantity}
                    onChange={handleEditChange}
                    size="small"
                  />
                  <TextField
                    name="unitOfMeasurement"
                    value={editItem.unitOfMeasurement}
                    onChange={handleEditChange}
                    size="small"
                  />
                  <Button
                    onClick={() => handleSaveEdit(item._id)}
                    color="primary"
                  >
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Typography sx={{ marginRight: "10px" }}>
                    Quantity: {item.quantity} {item.unitOfMeasurement}
                  </Typography>
                  <IconButton
                    onClick={() => handleDeletePantryItem(item._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Paper>
        ))}
      </Box>
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          order: { xs: 1, sm: 2 },
          marginTop: { xs: "100px", sm: "145px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          label="Ingredient Name"
          name="ingredientName"
          value={newItem.ingredientName}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL (optional)"
          name="image"
          value={newItem.image}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantity"
          name="quantity"
          type="number"
          value={newItem.quantity}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Unit of Measurement"
          name="unitOfMeasurement"
          value={newItem.unitOfMeasurement}
          onChange={handleChange}
          margin="normal"
        />
        <Button
          fullWidth
          onClick={handleAddPantryItem}
          sx={{
            backgroundColor: "#1F3528", // Dark green button
            color: "#AD8157", // Brownish hue text
            marginTop: "20px",
            "&:hover": {
              backgroundColor: "#AD8157", // Brownish hue button on hover
              color: "#E5D9D2", // Light beige text on hover
            },
          }}
        >
          Add to Pantry List
        </Button>
      </Box>
    </Box>
  );
};

export default PantryPage;
