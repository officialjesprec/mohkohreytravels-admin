/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { TourManagement } from "./pages/TourManagement";
import { BlogManager } from "./pages/BlogManager";
import { Gallery } from "./pages/Gallery";
import { Bookings } from "./pages/Bookings";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tours" element={<TourManagement />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
