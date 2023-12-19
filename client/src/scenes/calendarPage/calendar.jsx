import { useState, useEffect } from "react";
import axios from "axios";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import {
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";

const Calendar = () => {
  const [date, setDate] = useState(dayjs());
  const [mealPlans, setMealPlans] = useState({});
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [showPlanner, setShowPlanner] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const reduxState = useSelector((state) => state);
  console.log("Redux State:", reduxState);

  const handleDateChange = (newValue) => {
    setDate(newValue);
    setShowPlanner(true);
    fetchMealPlanForDate(newValue);
  };

  const getAuthToken = token;

  const fetchMealPlanForDate = async (selectedDate) => {
    try {
      const authToken = getAuthToken;
      const dateString = date.format("YYYY-MM-DD");
      const response = await fetch(
        `http://localhost:8080/api/mealplans/${dateString}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        const responsedata = await response.json();
        setMealPlans(responsedata.data || {});
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      console.log(responsedata);
    }
  };

  useEffect(() => {
    fetchMealPlanForDate(date);
  }, [date]);

  const searchRecipes = async () => {
    if (!query) {
      setRecipes([]);
      return;
    }

    setSearchAttempted(true);
    console.log("Searching for query:", query); // Log the query to the console

    try {
      const response = await axios.get(
        `http://localhost:8080/api/recipes/search?query=${query}`
      );
      setRecipes(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]);
    }
  };

  const addMeal = async (mealType, recipe) => {
    const authToken = getAuthToken;
    const dateString = date.format("YYYY-MM-DD");
    try {
      const response = await axios.post(
        `http://localhost:8080/api/mealplans/create/${dateString}`,
        {
          mealType: mealType,
          recipeName: recipe.recipeName,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        // Assume the response includes the updated meal plan for the day
        setMealPlans((prevMealPlans) => ({
          ...prevMealPlans,
          [dateString]: {
            ...prevMealPlans[dateString],
            [mealType]: [
              ...(prevMealPlans[dateString]?.[mealType] || []),
              recipe.recipeName,
            ],
          },
        }));
      }
    } catch (error) {
      console.error("Error adding meal to meal plan:", error);
    }
  };

  const removeMeal = async (mealType, recipeName) => {
    const authToken = getAuthToken;
    const dateString = date.format("YYYY-MM-DD");
    try {
      // Send delete request to backend with the authorization header
      const response = await axios.delete(
        `http://localhost:8080/api/mealplans/delete/${dateString}/${mealType}/${recipeName}`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the state to reflect the change
        setMealPlans((prevMealPlans) => {
          const updatedMeals =
            prevMealPlans[dateString]?.[mealType]?.filter(
              (meal) => meal !== recipeName
            ) || [];

          return {
            ...prevMealPlans,
            [dateString]: {
              ...prevMealPlans[dateString],
              [mealType]: updatedMeals,
            },
          };
        });
      }
    } catch (error) {
      console.error("Error removing meal from meal plan:", error);
      // Handle error here, possibly updating the UI to reflect that the operation failed
    }
  };

  const renderMealPlan = (mealType) => {
    const dateString = date.format("YYYY-MM-DD");
    const meals = mealPlans[dateString]?.[mealType] || [];
    return (
      <List dense>
        {meals.map((meal, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <Button onClick={() => removeMeal(mealType, meal)}>Remove</Button>
            }
          >
            <ListItemText primary={meal} />
          </ListItem>
        ))}
      </List>
    );
  };

  useEffect(() => {
    // Check for stored date and meal plans in localStorage when the component mounts
    const storedDate = localStorage.getItem("selectedDate");
    const storedMealPlans = localStorage.getItem("mealPlans");

    if (storedDate) {
      setDate(dayjs(storedDate));
    }
    if (storedMealPlans) {
      setMealPlans(JSON.parse(storedMealPlans));
    }

    fetchMealPlanForDate(storedDate ? dayjs(storedDate) : date);
  }, []);

  useEffect(() => {
    // Store date and meal plans in localStorage whenever they change
    localStorage.setItem("selectedDate", date.format("YYYY-MM-DD"));
    localStorage.setItem("mealPlans", JSON.stringify(mealPlans));
  }, [date, mealPlans]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "start",
        minHeight: "50vh",
        minwidth: "100%",
        gap: { md: 4 },
        backgroundColor: "#E5D9D2", // Light beige background
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: { xs: "100%", md: showPlanner ? "auto" : "100%" },
          ".MuiStaticDatePicker-root": {
            maxWidth: { md: "none" },
            margin: "auto",
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            openTo="day"
            value={date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </Box>

      {showPlanner && (
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: "600px",
            width: "100%",
            mt: { xs: 2, md: 0 },
            boxSizing: "border-box",
            p: 2,
          }}
        >
          <Button onClick={() => setShowPlanner(false)} sx={{ mb: 2 }}>
            Close Planner
          </Button>
          <Typography variant="h6">
            Meal Planner for {date.format("dddd, MMMM D")}
          </Typography>
          <Box>
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for recipes"
              sx={{ width: "100%", mb: 1 }}
            />
            <Button onClick={searchRecipes} variant="contained" sx={{ mb: 2 }}>
              Search
            </Button>
            <CloseIcon
              onClick={() => {
                setRecipes([]); // Clears the search results
                setQuery(""); // Clears the search field
              }}
              sx={{
                cursor: "pointer",
                marginLeft: "290px",
              }}
            />
          </Box>
          <Box sx={{ overflow: "auto", maxHeight: "400px" }}>
            {recipes.length > 0
              ? recipes.map((recipe) => (
                  <Box
                    key={recipe.recipeCode}
                    sx={{ mb: 1, borderBottom: "1px solid #ccc", pb: 1 }}
                  >
                    <Typography sx={{ fontWeight: "bold" }}>
                      {recipe.recipeName}
                    </Typography>
                    <Button onClick={() => addMeal("breakfast", recipe)}>
                      Add to Breakfast
                    </Button>
                    <Button onClick={() => addMeal("lunch", recipe)}>
                      Add to Lunch
                    </Button>
                    <Button onClick={() => addMeal("dinner", recipe)}>
                      Add to Dinner
                    </Button>
                  </Box>
                ))
              : searchAttempted && (
                  // Only show "No recipes found" if a search has been attempted
                  <Typography sx={{ textAlign: "center", marginTop: "20px" }}>
                    No recipes found.
                  </Typography>
                )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Breakfast</Typography>
          {renderMealPlan("breakfast")}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Lunch</Typography>
          {renderMealPlan("lunch")}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Dinner</Typography>
          {renderMealPlan("dinner")}
        </Box>
      )}
    </Box>
  );
};

export default Calendar;
