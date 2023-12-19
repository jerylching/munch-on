import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [hoveredRecipeId, setHoveredRecipeId] = useState(null);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`);
      if (response.ok) {
        const result = await response.json();
        console.log("Fetched recipes:", result); // Log to see what's being returned
        if (result && Array.isArray(result.data)) {
          setRecipes(result.data);
        } else {
          console.error("Received unexpected structure:", result);
          setRecipes([]); // Reset to empty array or handle as needed
        }
      } else {
        console.error("Failed to fetch recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = recipes.filter(
      (recipe) =>
        recipe.recipeName.toLowerCase().includes(lowercasedSearchTerm) ||
        (recipe.ingredients instanceof Array &&
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(lowercasedSearchTerm)
          )) ||
        recipe.cuisine.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredRecipes(filtered);
  }, [searchTerm, recipes]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const handleAddToMealPlanClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleAddToMealPlan = async (mealType) => {
    const dateString = selectedDate.format("YYYY-MM-DD");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/mealplans/create/${dateString}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mealType: mealType,
            recipeName: selectedRecipe.recipeName,
          }),
        }
      );

      if (response.ok) {
        // The meal plan was successfully added/updated in the database
        console.log("Meal plan updated successfully");
        // Fetch the updated meal plans to reflect on the calendar page
      } else {
        // Handle any errors, such as the meal plan not being found or the server returning an error
        console.error("Failed to update meal plan");
      }
    } catch (error) {
      console.error("Error adding to meal plan:", error);
    }

    setShowModal(false); // Close the modal after attempting to add the meal
  };

  const [newRecipe, setNewRecipe] = useState({
    recipeName: "",
    recipeCode: "",
    image: "",
    ingredients: [],
    totalCost: "",
    costPerServing: "",
    servingSize: "",
    totalTime: "",
    dishTypes: [],
    cuisine: "",
    source: "",
  });

  const handleNewRecipeChange = (event) => {
    const { name, value } = event.target;
    if (name === "ingredients") {
      // Assuming ingredients are entered as a comma-separated list
      const ingredientsArray = value
        .split(",")
        .map((ingredient) => ingredient.trim());
      setNewRecipe({ ...newRecipe, ingredients: ingredientsArray });
    } else {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const handleAddRecipe = async () => {
    try {
      // Make a POST request to the backend endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        // Fetch the updated list of recipes
        fetchRecipes();

        // Reset the form
        setNewRecipe({
          recipeName: "",
          recipeCode: "",
          image: "",
          ingredients: [],
          totalCost: "",
          costPerServing: "",
          servingSize: "",
          totalTime: "",
          dishTypes: [],
          cuisine: "",
          source: "",
        });

        // Close the modal form after submission
        setShowAddRecipeForm(false);
      } else {
        console.error("Failed to add new recipe");
      }
    } catch (error) {
      console.error("Error adding new recipe:", error);
    }
  };

  const [showAddRecipeForm, setShowAddRecipeForm] = useState(false);

  const handleDeleteRecipe = async (recipeName) => {
    try {
      // Make a DELETE request to the backend endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recipes/${recipeName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Fetch the updated list of recipes
        fetchRecipes();
      } else if (response.status === 404) {
        console.error("Recipe not found");
      } else {
        console.error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <Box p={3} minHeight="100%" bgcolor="#E5D9D2">
      <Typography
        variant="h4"
        textAlign="center"
        marginTop="150px"
        marginBottom="30px"
        color="#1F3528" // Dark green text
      >
        RECIPES
      </Typography>
      <Box mb={3}>
        <InputBase
          placeholder="Search Recipes..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            padding: "10px",
            border: "1px solid #000",
            borderRadius: "4px",
            width: "25%",
            marginLeft: "20px",
          }}
        />
      </Box>
      <Slider {...settings}>
        {(Array.isArray(searchTerm ? filteredRecipes : recipes)
          ? searchTerm
            ? filteredRecipes
            : recipes
          : []
        ).map((recipe, index) => (
          <Paper
            key={index}
            elevation={4}
            sx={{
              position: "relative",
              width: "100%",
              height: 300,
              m: 1,
              p: 1,
              "&:hover .recipe-overlay": { opacity: 1 },
            }}
          >
            <img
              src={recipe.image}
              alt={recipe.recipeName}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <Box
              className="recipe-overlay"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: "white",
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                padding: "8px",
                borderRadius: "4px",
                overflow: "hidden",
                "&:hover": {
                  overflowY: "auto",
                },
              }}
              onMouseEnter={() => setHoveredRecipeId(index)}
              onMouseLeave={() => setHoveredRecipeId(null)}
            >
              {hoveredRecipeId === index && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {recipe.recipeName}
                  </Typography>
                  <Box sx={{ maxHeight: "100px", overflowY: "auto" }}>
                    <Typography variant="body2" gutterBottom>
                      Ingredients: {recipe.ingredients.join(", ")}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom>
                    Total Cost: ₱{recipe.totalCost}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Cost per Serving: ₱{recipe.costPerServing}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Serving Size: {recipe["serving size"]}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Total Time: {recipe.totalTime}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Cuisine: {recipe.cuisine}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Source: {recipe.source}
                  </Typography>
                </>
              )}
            </Box>
            <Button
              variant="contained"
              onClick={() => handleAddToMealPlanClick(recipe)}
              sx={{
                position: "absolute",
                bottom: "8px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1,
                backgroundColor: "#1F3528", // Dark green button
                color: "#AD8157", // Brownish hue text
                "&:hover": {
                  backgroundColor: "#AD8157", // Brownish hue button on hover
                  color: "#E5D9D2", // Light beige text on hover
                },
              }}
            >
              Add to Meal Plan
            </Button>
            <IconButton
              onClick={() => handleDeleteRecipe(recipe.recipeName)}
              sx={{
                position: "absolute",
                top: "8px",
                right: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              <DeleteIcon color="error" />
            </IconButton>
          </Paper>
        ))}
      </Slider>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            marginLeft: "10px",
          }}
        >
          <Typography variant="h6" marginTop="80px">
            Select a Date and Meal Type
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            onClick={() => handleAddToMealPlan("breakfast")}
            sx={{
              backgroundColor: "#000", // Black button
              color: "#fff", // White text
              marginLeft: "5px",
              "&:hover": {
                backgroundColor: "grey.800", // Slightly lighter black on hover
              },
            }}
          >
            Breakfast
          </Button>
          <Button
            onClick={() => handleAddToMealPlan("lunch")}
            sx={{
              backgroundColor: "#000", // Black button
              color: "#fff", // White text
              marginLeft: "5px",
              "&:hover": {
                backgroundColor: "grey.800", // Slightly lighter black on hover
              },
            }}
          >
            Lunch
          </Button>
          <Button
            onClick={() => handleAddToMealPlan("dinner")}
            sx={{
              backgroundColor: "#000", // Black button
              color: "#fff", // White text
              marginLeft: "5px",
              "&:hover": {
                backgroundColor: "grey.800", // Slightly lighter black on hover
              },
            }}
          >
            Dinner
          </Button>
        </Box>
      </Modal>
      <Box
        sx={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Similar text fields for ingredients, totalCost, costPerServing, serving size, totalTime, and cuisine */}
        <Button
          variant="contained"
          onClick={() => setShowAddRecipeForm(true)}
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
          Add Recipe
        </Button>
        <Modal
          open={showAddRecipeForm}
          onClose={() => setShowAddRecipeForm(false)}
          aria-labelledby="add-recipe-modal-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: "white",
            }}
          >
            <div>
              <TextField
                fullWidth
                label="Recipe Name"
                name="recipeName"
                value={newRecipe.recipeName}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Recipe Code"
                name="recipeCode"
                value={newRecipe.recipeCode}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Image URL (optional)"
                name="image"
                value={newRecipe.image}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Ingredients (comma-separated)"
                name="ingredients"
                value={newRecipe.ingredients}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Total Cost"
                name="totalCost"
                value={newRecipe.totalCost}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Cost per Serving"
                name="costPerServing"
                value={newRecipe.costPerServing}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
            </div>
            <div>
              <TextField
                fullWidth
                label="Serving Size"
                name="servingSize"
                value={newRecipe.servingSize}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Total Time"
                name="totalTime"
                value={newRecipe.totalTime}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Dish Types"
                name="dishTypes"
                value={newRecipe.dishTypes}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Cuisine"
                name="cuisine"
                value={newRecipe.cuisine}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Source"
                name="source"
                value={newRecipe.source}
                onChange={handleNewRecipeChange}
                margin="normal"
              />
            </div>
            <div>
              <Button
                fullWidth
                onClick={handleAddRecipe}
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
                Submit Recipe
              </Button>
              <Button
                fullWidth
                onClick={() => setShowAddRecipeForm(false)}
                sx={{
                  marginTop: "10px",
                  backgroundColor: "#AD8157", // Brownish hue button
                  color: "#1F3528", // Dark green text
                  "&:hover": {
                    backgroundColor: "#E5D9D2", // Light beige on hover
                    color: "#1F3528", // Dark green text on hover
                  },
                }}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default RecipesPage;
