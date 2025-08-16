import React, { use } from "react";
import Banner from "../../Components/Banner/Banner";
import DonateNow from "../../Components/Banner/DonateNow";
import DonationPoccess from "../../Components/Banner/DonationPoccess";
import Appointment from "../../Components/Banner/Appointment";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import Feature from "../Features/Feature";
import HomeBlogs from "../Blogs/HomeBlogs";
import BloodDonationCampaign from "../Features/BloodDonationCampaign";
import Stats from "../Features/Stats";
import FeaturedCampaigns from "../Features/FeaturedCampaigns";
import Testimonials from "../Features/Testimonials";
import Newsletter from "../Features/Newsletter";


const Home = () => {

  return (
    <div>
  {/* 1. Hero */}
  <Banner />
  {/* 2. Stats */}
  <Stats />
  {/* 3. Features */}
  <Feature />
  {/* 4. Featured Campaigns (cards with images) */}
  <FeaturedCampaigns />
  {/* 5. Donate Now CTA */}
  <DonateNow />
  {/* 6. Donation Process */}
  <DonationPoccess />
  {/* 7. Recent Blogs */}
  <HomeBlogs />
  {/* 8. Testimonials */}
  <Testimonials />
  {/* 9. Newsletter */}
  <Newsletter />
  {/* 10. Contact/Appointment */}
  <Appointment />
    </div>
  );
};

export default Home;
