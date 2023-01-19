import React, { useEffect, useState, useContext } from "react";
import PricingCard from "../pricing-card/PricingCard";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/context";
import axios from "axios";
import Header from "../header/Header";
import Spiner from "../../components/spiner/Spiner";

const SubscriptionPlan = () => {
  const navigate = useNavigate();
  const [state, setState] = useContext(UserContext);
  const [prices, setPrices] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const getSubscriptions = async () => {
      const { data } = await axios.get(
        "https://pwo-mern-api.onrender.com/api/subscriptions"
      );
      console.log(data);
      setSubscriptions(data.data);
      setIsFetching(false);
    };

    if (state && state.token) getSubscriptions();
  }, [state && state.token]);

  useEffect(() => {
    fetchPrices();
  }, []);

  const updateUserSubscriptions = (state) => {
    let result = [];
    if(state && state.user && state.user.subscriptions) {
        result = state.user.subscriptions.map((sub) => sub.plan.id);
    }
    setUserSubscriptions(result);
}

useEffect(() => {
    updateUserSubscriptions(state);
}, [state]);

  useEffect(() => {
    const isPaused = async () => {
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
  const handleClick = async (e, price) => {
    e.preventDefault();
    if (userSubscriptions && userSubscriptions.includes(price.id)) {
      navigate(`/${price.nickname.toLowerCase()}`);
      return;
    }
    // console.log("plan clicked", price.id);
    if (state && state.token) {
      const { data } = await axios.post(
        "https://pwo-mern-api.onrender.com/api/create-subscription",
        {
          priceId: price.id,
        }
      );
      window.open(data);
    } else {
      navigate("/login");
    }
  };
  if (isFetching) {
    return <Spiner />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center  overflow-hidden relative">
      <div className="overflow-hidden pb-10 tablet:pb-10 mobile:py-8  ">
        <Header header="Bli med nå" />
      </div>
      <div className="flex justify-center gap-10 items-center  py-20 relative screen:pb-10 screen:gap-2  tablet:py-0 tablet:pt-16 tablet:gap-1 mobile:gap-1 ">
        <div className="absolute from-blue-500/20  to-purple-500/20 bg-gradient-to-b w-[50%] h-[60%] top-[25%] right-[25%] rounded-full blur-2xl backdrop-xl screen:w-full screen:right-0 "></div>
        {prices && subscriptions? (
          prices.map((price) => (
            <PricingCard
              key={price.id}
              price={price}
              handleSubscription={handleClick}
              userSubscriptions={userSubscriptions}
            />
          ))
        ) : (
          <Spiner />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
