
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import Auth from "./pages/Auth/Auth"
import AppLayout from "./layouts/AppLayout"
import SetupFarm from "./pages/SetupFarm/SetupFarm"
import Home from "./pages/Home/Home"
import Dairy from "./pages/Dairy/Dairy"
import Farm from "./pages/Farm/Farm"
import More from "./pages/More/More"
import RecordMilk from "./pages/RecordMilk/RecordMilk"
import Cows from "./pages/Cows/Cows"
import AddCow from "./pages/AddCow/AddCow"
import CowDetails from "./pages/CowDetails/CowDetails"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/setup-farm" element={<SetupFarm />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/more" element={<More />} />
          <Route path="/dairy/record-milk" element={<RecordMilk />} />
          <Route path="/dairy/cow/:name" element={<CowDetails />} />
          <Route path="/dairy/cows" element={<Cows />} />
          <Route path="/dairy/cows/add" element={<AddCow />} />
        </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
