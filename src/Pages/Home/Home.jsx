import React, { use } from "react";
import Banner from "../../Components/Banner/Banner";
import DonateNow from "../../Components/Banner/DonateNow";
import DonationPoccess from "../../Components/Banner/DonationPoccess";
import Appointment from "../../Components/Banner/Appointment";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";


const Home = () => {

  return (
    <div>
        <Banner />
        <DonateNow></DonateNow>
        <DonationPoccess></DonationPoccess>
        <Appointment></Appointment>
    </div>
  );
};

export default Home;
