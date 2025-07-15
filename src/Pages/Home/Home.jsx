import React, { use } from "react";
import Banner from "../../Components/Banner/Banner";
import DonateNow from "../../Components/Banner/DonateNow";
import DonationPoccess from "../../Components/Banner/DonationPoccess";
import Appointment from "../../Components/Banner/Appointment";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Feature from "../Features/Feature";
import HomeBlogs from "../Blogs/HomeBlogs";


const Home = () => {

  return (
    <div>
        <Banner />
        <Feature></Feature>
        <DonateNow></DonateNow>
        <DonationPoccess></DonationPoccess>
        <HomeBlogs></HomeBlogs>
        <Appointment></Appointment>
    </div>
  );
};

export default Home;
