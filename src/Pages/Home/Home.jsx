import React from "react";
import Banner from "../../Components/Banner/Banner";
import DonateNow from "../../Components/Banner/DonateNow";
import DonationPoccess from "../../Components/Banner/DonationPoccess";

const Home = () => {
  return (
    <div>
        <Banner />
        <DonateNow></DonateNow>
        <DonationPoccess></DonationPoccess>
    </div>
  );
};

export default Home;
