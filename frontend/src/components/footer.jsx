
function Footer(){
    return(
        <footer className="text-white py-10 px-5 md:px-[120px]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">

               
                   {/* Navigation (optional) */}
                  <ul className="flex flex-wrap gap-6 text-sm text-gray-300">
                      <li><a href="#">Home</a></li>
                      <li><a href="#">About</a></li>
                     <li><a href="#">You</a></li>
                     <li><a href="#">Community</a></li>
                 </ul>


            <div className="flex gap-4">
              <a href="#"><img src="/assets/icons/twitter.svg" alt="twitter" className="w-5 h-5" /></a>
              <a href="#"><img src="/assets/icons/telegram.svg" alt="Telegram" className="w-5 h-5" /></a>
         </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Ziver. All rights reserved.
      </div>
        </footer>
    );
}

export default Footer;