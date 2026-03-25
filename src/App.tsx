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
import { VisaManagement } from "./pages/VisaManagement";
import { PassportService } from "./pages/PassportService";
import { StudyAbroadManager } from "./pages/StudyAbroadManager";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tours" element={<TourManagement />} />
          <Route path="visas" element={<VisaManagement />} />
          <Route path="passports" element={<PassportService />} />
          <Route path="study" element={<StudyAbroadManager />} />
          <Route path="blog" element={<BlogManager />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
