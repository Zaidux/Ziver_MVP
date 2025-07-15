import Button from "./Button";
import Zivercoind from "../assets/images/Zivercoind.png";



function Hero(){
    return(
        <section id ="home" className="bg-black md:pt-[60px]">
             <div className="w-full flex flex-col items-center md:flex-row justify-between md:px-[120px] px-5 relative md:pb-0 pb-20 ">
                 
                 
                 {/* Left side: Text content */}
                <div className="flex flex-col gap-6 items-center md:items-start mt-5 md:mt-0">
                   <div className="flex items-center justify-center border border-green-500 rounded-[24px] w-fit px-4 h-[37px]">
                    <span className="text-white text-sm">Decentralised</span>
                   </div> 
                   <h1 className="text-white font-bold md:text-[84px] text-[40px] max-w-[600px] md:leading-[80px]">
                        Welcome to Ziver – Where <span className="underline">Time</span> Means Value. 
                   </h1>
                   <p className="text-white text-[20px] max-w-[600px] text-center md:text-left">
                      We're building a digital platform, where your engagement unlocks financial opportunities, jobs, gaming,
                       crowdfunding, and more (even with zero technical know-how).
                   </p>                   
                </div>

                <div className="flex flex-col items-center md:items-end md:mt-0 gap-4">
                 
                 {/* Show only on small screens */}
                 <div className="flex flex-col gap-4 mt-[30px] items-center md:hidden">
                     <Button />
                     <small className="text-white text-[15px] max-w-[400px] text-center">And be the first to earn $ZIV token, test features, and shape the future of decentralized opportunity.</small>
                     <small className="text-white text-[10px] text-center">already have an account?  <a  className="text-center" href="#">Login</a></small>
                     <img src={Zivercoind} alt="$Ziv coin" className="md:mt-4 w-[250px]" />
                 </div>

                 <div className="hidden md:flex flex-col gap-4 items-end">
                      {/* 👇 Show ONLY on large screens (below the image) */}
                     <img src={Zivercoind} alt="$Ziv coin" className="mt-15 md:mt-0 w-[400px]" />
                     <div className="flex flex-col gap-4 items-center md:items-center">
                      <Button />
                      <small className="text-white text-[15px] max-w-[400px] text-center md:text-right">And be the first to earn $ZIV token, test features, and shape the future of decentralized opportunity.</small>
                      <small className="text-white text-[10px] text-center md:text-right">already have an account?  <a  className="text-center" href="#">Login</a></small>
                     </div>
                  
                   </div>
                </div> 
            </div>

        </section>
    ); 
}

export default Hero;