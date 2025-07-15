import { useState } from "react";
import { faqItems } from "../data/index.jsx";

function Faq(){
    const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };
    
    
    return(
        <section className="bg-black" id="faqs">
             <div className="mt-[50px] flex flex-col items-center px-4">
                <div className="flex items-center  justify-center border border-green-500 rounded-[24px] w-fit px-4 h-[37px]">
                    <span className="text-white text-sm">Faqs</span>
                   </div>

                   <div className="space-y-6 w-full flex flex-col items-center mt-[60px]">
                         {faqItems.map((faq, idx) => (
                            <div key={idx} className="bg-[#1e1e1e] p-1 border border-green-500 md:w-[900px] w-[400px]">
                                <button onClick={() => toggle(idx)} className="w-full text-left flex justify-between items-center p-5">
                                      <span className="font-semibold text-lg mb-2 text-white">{faq.question}</span>
                                      <span className="text-green-400 text-xl"> {openIndex == idx ? "-" : "+"}</span>
                                </button>
                                {openIndex === idx && (
                                    <div className="px-5 pb-5 text-gray-300 text-sm">{faq.answer}</div>
                                )}
                            </div>
                         ))}
                   </div>
             </div>
        </section>
    );
}

export default Faq;