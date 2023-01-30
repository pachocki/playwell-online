import React, { useState, useEffect , useContext } from "react";
//Context
import { UserContext } from "./context/context";
//Styles
import "./index.css";
import "./styles.css";

//React Router
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  useNavigate
} from "react-router-dom";

//Routes
import {
  PrivateRoutes,
  Layout,
  Fortnite,
  Scratch,
  AboutUs,
  ErrorPage,
  Minecraft,
  GamingClub,
  Login,
  Home,
  SignUp,
  DashboardClient,
  DashboardSubscription,
  DashboardCalendar,
  DashboardLayout,
  DashboardVod,
  DashboardAdmin,
  ForgotPassword,
  ResetPassword,
  DashboardUserList,
  Subscription,
  Basic,
  Premium,
  StripeSuccess,
} from "./router/Router";

//Routes Elements
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="/stripe/success" element={<StripeSuccess />} />
        <Route path="/minecraft" element={<Minecraft />} />
        <Route path="/roblox" element={<GamingClub />} />
        <Route path="/fortnite" element={<Fortnite />} />
        <Route path="/koding" element={<Scratch />} />
        <Route path="/omoss" element={<AboutUs />} />
        <Route
          path="/subscription"
          element={
            <PrivateRoutes>
              <Subscription />
            </PrivateRoutes>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/passwordreset/:resetToken" element={<ResetPassword />} />
        <Route
          path="/"
          element={<DashboardLayout />}
          errorElement={<ErrorPage />}
        >
          <Route path="/dashboard" element={<DashboardClient />} />
          <Route
            path="/dashboard-subscription"
            element={<DashboardSubscription />}
          />
          <Route path="/basic" element={<Basic />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
          <Route path="/dashboard-userlist" element={<DashboardUserList />} />
          <Route path="/dashboard-calendar" element={<DashboardCalendar />} />
          <Route path="/dashboard-vod" element={<DashboardVod />} />
        </Route>
      </Route>
    </Route>
  )
);
function App() {
  const [user, setUser] = useState();
    //Navigate
    const navigate = useNavigate();
    //Context
    const [state, setState] = useContext(UserContext);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("auth");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  const [originalTabName, setOriginalTabName] = useState(window.name);
  const [isTabClosed, setIsTabClosed] = useState(false);

  const logout = () => {
    setState({ user: {}, token: "" });
    localStorage.removeItem("auth");
    navigate("/");
    window.scrollTo(0, 0);
    window.location.reload();
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && originalTabName === window.name) {
        setIsTabClosed(true);
      } else {
        setIsTabClosed(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    setTimeout(logout, 5 * 60 * 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isTabClosed) {
      logout();
    }
  }, [isTabClosed]);

  return <RouterProvider router={router} />;
}

export default App;
