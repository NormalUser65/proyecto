import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Importa los providers
import UserProvider from "@/Context/UserProvider";
import CartProvider from "@/Context/CartProvider"; // si ya lo tienes creado

export function Layout() {
  return (
    <UserProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 pt-16 pb-16">
            <Toaster position="bottom-right" />
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </UserProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};