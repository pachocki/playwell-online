import React, { useContext, useState, useEffect } from "react";
import SubscriptionPlan from "../../components/subscription-plan/SubscriptionPlan";
import { UserContext } from "../../context/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Subscription = () => {
  const [state, setState] = useContext(UserContext);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [prices, setPrices] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const navigate = navigate();

  useEffect(() => {
    fetchPrices();
  }, []);

  useEffect(() => {
    let result = [];
    const check = () =>
      state &&
      state.user &&
      state.user.subscriptions &&
      state.user.subscriptions.map((sub) => {
        result.push(sub.plan.id);
      });
    check();
    setUserSubscriptions(result);
  }, [state && state.user]);

  useEffect(() => {
    const isPaused = () => {
      state &&
        state.user &&
        state.user.subscriptions &&
        state.user.subscriptions.resumes_at &&
        navigate("/dashboard");
    };

    state && state.user && isPaused();
  }, [state && state.user]);

  const fetchPrices = async () => {
    const { data } = await axios.get(
      "https://pwo-mern-api.onrender.com/api/prices"
    );
    setPrices(data);
    setIsFetching(false);
  };

 
  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden relative  pt-[6.2rem] pb-10 ">
      <SubscriptionPlan />
    </div>
  );
};

export default Subscription;
