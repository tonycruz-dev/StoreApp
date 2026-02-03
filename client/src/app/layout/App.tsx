/* eslint-disable @typescript-eslint/no-explicit-any */

//import type { Product } from "../models/product";
import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
//import Catalog from "../../features/catalog/Catalog";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

// const products = [
//   { id: 1, name: 'Product 1', price: 10.0 },
//   { id: 2, name: 'Product 2', price: 20.0 },
//   { id: 3, name: 'Product 3', price: 30.0 },
// ];

function App() {
  //const [products, setProducts] = useState<Product[]>([]);
   const { darkMode } = useAppSelector((state) => state.ui);
  const palleteType = darkMode ? "dark" : "light";

    const theme = createTheme({
      palette: {
        mode: palleteType,
        background: {
          default: palleteType === "light" ? "#eaeaea" : "#121212",
        },
      },
    });

//  const toggleDarkMode = () => {
//    setDarkMode(!darkMode);
//  };


  // useEffect(() => {
  //   fetch("https://localhost:5001/api/Products")
  //     .then((response) => response.json())
  //     .then((data) => setProducts(data))
  //     .catch((error) => console.error("Error fetching products:", error));
  // }, []);


  // if (products.length === 0) {
  //   return <h1>Loading products...</h1>;
  // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "radial-gradient(circle, #1e3aBa, #111B27)"
            : "radial-gradient(circle, #baecf9, #f0f9ff)",
          py: 6,
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
