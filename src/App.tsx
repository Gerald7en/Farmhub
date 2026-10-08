import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppLayout from "./layouts/AppLayout"
import CowDetails from "./pages/CowDetails/CowDetails"
import Home from "./pages/Home/Home"
import Dairy from "./pages/Dairy/Dairy"
import Farm from "./pages/Farm/Farm"
import More from "./pages/More/More"
import RecordMilk from "./pages/RecordMilk/RecordMilk"
import Cows from "./pages/Cows/Cows"
import AddCow from "./pages/AddCow/AddCow"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/dairy/cow/:name" element={<CowDetails />} />
          <Route path="/dairy/record-milk" element={<RecordMilk />} />
          <Route path="/dairy/cows" element={<Cows />} />
          <Route path="/dairy/cows/add" element={<AddCow />} />
          <Route path="/farm" element={<Farm />} />
          <Route path="/more" element={<More />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App