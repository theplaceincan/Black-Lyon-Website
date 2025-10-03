export const dynamic = "force-dynamic";

import BiniyamInfo from "./BiniyamInfo";
import Featured from "./Featured";
import Hero from "./Hero";
import Services from "./Services";

export default function LandingPage() {
  return (
    <div>
      <Hero/>
      <Services/>
      <BiniyamInfo/>
      {/* <Featured/> */}
    </div>
  )
}