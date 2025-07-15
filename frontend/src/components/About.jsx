function About(){
    return(
        <section id="about" className="md:pt-[30px]">
            <div className="w-full px-5 md:px-[120px]">
              <div className="flex flex-col gap-6 md:items-start items-center mt-5 md:mt-0 ">
                 <div className="flex items-center justify-center border border-green-500 rounded-[20px] w-fit px-4 h-[37px]">
                    <span className="text-white text-sm">About</span>
                   </div> 
                   <h2 className="text-4xl text-center md:text-center text-white font-bold">What is Ziver</h2>

                   <p className="text-white max-w-[700px]">Ziver is a Multi-chain Web3 platform that fuses social engagement with decentralized finance (DeFi).
                     This means whether you're a gamer, creator, freelancer, entrepreneur, or just curious about crypto, 
                     Ziver helps you earn, connect, and grow – all from your smartphone.
                    </p>

                    <h3 className="text-2xl text-center text-white font-semi-bold">Who is Ziver for?</h3>

                    <p className="text-white text-left"> Ziver is literally for everyone including:</p>
                    <ul  className="list-star text-white pl-4 space-y-2">
                         <li className="relative pl-6 text-white before:content-['★'] before:absolute before:left-0 before:text-green-400"> Web3 enthusiasts tired of complicated web3 platforms.</li>
                         <li className="relative pl-6 text-white before:content-['★'] before:absolute before:left-0 before:text-green-400"> Muslim users seeking Sharia-compliant crypto opportunities.</li>
                         <li className="relative pl-6 text-white before:content-['★'] before:absolute before:left-0 before:text-green-400"> Everyday users who want to turn time, tap, and task into tokens.</li>
                         <li className="relative pl-6 text-white before:content-['★'] before:absolute before:left-0 before:text-green-400"> Gamers, creators, freelancers, and investors who want to earn rewards and 
                            passive income through Decentralized finance (DeFi).</li>
                    </ul>
              </div>
            </div>
        </section>
    );
}

export default About;