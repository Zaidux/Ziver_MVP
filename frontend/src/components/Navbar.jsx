import logo from "../assets/images/logow.png";
import { navItems } from "../data";
import Button from "./Button";

const Navbar = () => {
    return (
        <div className="w-full flex items-center justify-between h-[80px] md:px-[120px] px-5 ">
            <div className="w-full">
                <img src={logo} alt="logo" className="cursor-pointer w-[120px]" />
            </div>
            <div className="hidden w-full lg:flex items-center justify-center gap-[40px]">
                  {navItems.map((item, index) => (
                    <a href={item.path} key={index} className=" text-gray hover:text-light font-medium">
                        {item.title}
                    </a>
                  ))}
            </div>
            <div className="w-full flex items-center justify-end md:gap-[40px] gap-5">
                <a href="#" className="text-white">Log in</a>
                <Button />
            </div>
        </div>
    )
}

export default Navbar;
    