import { UsersItems } from "../data/index.jsx";

function You(){
   
    return(
        <section id="users">
           <div className="w-full px-5 md:px-[120px] ">
            <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                 <h2 className="text-white text-2xl semibold mt-[60px]">What Can You Do On Ziver?</h2>
                 <div className="grid md:grid-cols-3 gap-6 mt-10 items-center">
                    {UsersItems.map((item, idx) => (
                        <div key={idx} className="bg-dark p-6 rounded-xl border border-green-500">
                            {/*Add icons later*/}
                            <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                            <p className="text-sm">{item.description}</p>
                        </div>
                    ))}
                 </div>
                 <div className="mt-[60px] text-white space-y-4 max-w2xl">
                    <h4 className="text-white font-semibold">What makes $Ziv special</h4>
                    <p>$ZIV is your passport to rewards.</p>
                    <p className="text-white">It’s the “Token” behind everything on Ziver – and holding it gives you access to airdrops, staking, marketplace deals, and exclusive community perks. You can use it to unlock jobs, Crowdfund causes, or swap across chains.</p>
                    <a href="#" className="pt-60px text-green-400 text-xl text-center">YES! COUNT ME IN!</a>
                    <p>No wallet? No problem. All you need is your phone and your voice.</p>
                    <small className="block text-sm text-gray-400 mt-2">Powered by TON — Secured by Innovation: Ziver is built on the Telegram Open Network (TON), which means it’s fast, safe, and fully connected to your favorite Telegram channels and bots.</small>
                </div>
                
            </div>
           </div>
        </section>
    );
}

export default You;

