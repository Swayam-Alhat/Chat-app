import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="min-h-screen m-0 p-0 bg-black">
      <Outlet />
    </div>
  );
}

export default App;
