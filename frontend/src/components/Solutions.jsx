import {SoluItems} from "../data";
import {useState, useEffect} from "react";

function Solutions(){
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const nextSlide = () =>{
       setCurrentSlide ((prev) => (prev + 1) % SoluItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
        prev === 0? SoluItems.length - 1 : prev - 1
    );
   };

  
   useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % SoluItems.length);
  }, 4000); // one slide every 5 seconds

  return () => clearInterval(interval); // ✅ Cleanup to prevent multiple intervals
}, []); 
    
    return(
        <section id="solutions" className="bg-black text-white py-10 mt-8 h-[500px] md:h-[900px] " >

            <div className="w-full px-5 md:px-[120px]">
               <div className="flex flex-col items-center md:items-start text-center gap-4">
                <div className="flex items-center justify-center border border-green-500  rounded-[24px] w-fit px-4 h-[37px] mb-6">
                   <span className="text-white text-sm ">Our Solutions</span>
             </div>               
                <h3 className="text-2xl">What problems does Ziver solve?</h3>
               </div>
               
                {/*For small screen-slider */}
                <div className="block md:hidden mt-6">
                      <div className="relative bg-dark rounded-xl p-6 max-w-[400px] mx-auto border border-green-500 mt-6">
                    <h2 className="text-green-400 text-xl mb-2 text-center">{currentSlide + 1}</h2>
                    <h4 className="text-[15px] font-semi-bold mb-2 underline text-center">{SoluItems[currentSlide].title}</h4>
                    <p className="text-sm whitespace-pre-line">{SoluItems[currentSlide].description}</p>

                    {/*For da dots */}
                    <div className="flex justify-center mt-6 gap-2">
                        {SoluItems.map((_, idx) => (
                            <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-3 h-3 rounded-full ${
                                currentSlide === idx ? "bg-green-400" : "bg-gray-600"
                             }`}
                           />
                        ))}
                    </div>
                </div>
                </div>
              
              {/*For large screen show */}
            <div className="hidden md:flex justify-between gap-6 mt-10 flex-wrap">
                {SoluItems.map((item, idx) => (
                    <div key={idx} className="bg-dark border border-green-500 rounded-xl px-6 w-full max-w-[400px]">
                        <h2 className="text-green-400 text-xl mb-2 text-center">{idx + 1}</h2>
                        <h4 className="text-[15px] font-semibold mb-2 underline">
                            {item.title}
                        </h4>
                        <p className="text-sm whitespace-pre-line">{item.description}</p>
                    </div>   
                ))}
               </div>
            </div>
        </section>
    );
}

export default Solutions;
