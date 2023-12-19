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
import groceryData from "../../../groceryLists.json";

const GroceryPage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const reduxState = useSelector((state) => state);
  console.log("Redux State:", reduxState);
  const username = useSelector((state) => state.user.username);
  const [groceries, setGroceries] = useState(() => {
    const savedGroceries = localStorage.getItem("groceryList");
    return savedGroceries ? JSON.parse(savedGroceries) : groceryData;
  });

  const [newItem, setNewItem] = useState({
    ingredientName: "",
    ingredientCode: "",
    image: "",
    quantity: 0,
    unitOfMeasurement: "",
    identity: username,
  });

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editItem, setEditItem] = useState({
    quantity: 0,
    unitOfMeasurement: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the token from the Redux store
        const response = await fetch("http://localhost:8080/api/grocery", {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = await response.json();
        // Assuming setPantryItems is a state updater function
        setGroceries(data.data);
      } catch (error) {
        console.error("Error fetching pantry items:", error);
      }
    };

    fetchData();
  }, [token, dispatch]);

  const handleChange = (event) => {
    console.log(event.target.name, event.target.value);
    setNewItem((prevNewItem) => ({
      ...prevNewItem,
      [event.target.name]: event.target.value,
    }));
  };

  const handleEditChange = (event) => {
    setEditItem({ ...editItem, [event.target.name]: event.target.value });
  };

  const handleAddGrocery = async () => {
    try {
      const authToken = token; // Assuming `token` is already defined

      const url = "http://localhost:8080/api/grocery/";

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
        // Fetch the updated data without reloading the window
        const updateResponse = await fetch(
          "http://localhost:8080/api/grocery",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (updateResponse.ok) {
          // Update the local state with the new data
          const updatedData = await updateResponse.json();
          setGroceries(updatedData.data);
        } else {
          console.error("Error fetching updated data:", updateResponse.status);
          // Handle the error as needed
        }
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
      quantity: groceries[index].quantity,
      unitOfMeasurement: groceries[index].unitOfMeasurement,
    });
  };

  const handleSaveEdit = async (itemId) => {
    try {
      const authToken = token; // Replace with your actual token

      // Update quantity using fetch
      await fetch(`http://localhost:8080/api/grocery/${itemId}`, {
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
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteGrocery = async (itemId) => {
    try {
      const authToken = token;
      await fetch(`http://localhost:8080/api/grocery/${itemId}`, {
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

  const handleAddToPantry = async () => {
    try {
      const authToken = token; // Assuming `token` is already defined

      const url = "http://localhost:8080/api/pantry/";

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
        const updateResponse = await fetch(
          "http://localhost:8080/api/grocery",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (updateResponse.ok) {
          // Update the local state with the new data
          const updatedData = await updateResponse.json();
          setGroceries(updatedData.data);
        } else {
          console.error("Error fetching updated data:", updateResponse.status);
          // Handle the error as needed
        }
      } else {
        alert("Error Registering Item.");
        console.log(newItem);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error Registering Item.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#E5D9D2",
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
          Grocery List
        </Typography>
        {groceries.map((item, index) => (
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
                    onClick={() => handleDeleteGrocery(item._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <Button
                    onClick={handleAddToPantry}
                    color="secondary"
                    variant="contained"
                    size="small"
                    sx={{ marginLeft: "10px" }}
                  >
                    Add to Pantry
                  </Button>
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
          onClick={handleAddGrocery}
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
          Add to Grocery List
        </Button>
      </Box>
    </Box>
  );
};

export default GroceryPage;
