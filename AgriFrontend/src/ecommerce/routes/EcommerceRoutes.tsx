import { Routes, Route, Navigate } from "react-router-dom";
import Shop from "../pages/Shop";
import Cart from "../pages/Cart";

export default function EcommerceRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/ecommerce" replace />} />
        </Routes>
    );
}
