import React, { useState , useEffect } from "react";
import logo from "../assets/logo.svg";
import menu_icon from "../assets/menu_icon.svg";
import cross_icon from "../assets/cross_icon.svg";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if(searchTermFromUrl) {
        setSearchTerm(searchTermFromUrl);
    }

    }, [location.search]);
  
  return (
    <div className="absolute top-0 left-0 w-full z-10">
      <div
        className="container mx-auto flex justify-between items-center
        py-4 px-6 md:px-20 lg:px-32 bg-transparent sm:gap-1"
      >
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
        <ul className="hidden md:flex gap-7 text-white">
          <Link to="/">
            <li
              className="cursor-pointer
                hover-text-gray-400"
            >
              Home
            </li>
          </Link>
          <Link to="/about">
            <li
              className="cursor-pointer
                hover-text-gray-400"
            >
              About
            </li>
          </Link>
          <Link to="/projects">
            <li
              className="cursor-pointer
                hover-text-gray-400"
            >
              Projects
            </li>
          </Link>
          <Link to="/testimonials">
            <li
              className="cursor-pointer
                hover-text-gray-400"
            >
              Testimonals
            </li>
          </Link>
        </ul>
        <form onSubmit={handleSubmit}
          className=" flex items-center  bg-white px-8 py-2 
            rounded-full"
        >
          <input
            type="text"
            placeholder="Search..."
            className="focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="cursor-pointer" >

            <FaSearch className="text-slate-600 " />
          </button>
        </form>
        {currentUser ? (
          <Link to="/profile" className="flex items-center mx-2">
            <img
              src={currentUser.avatar}
              alt="profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </Link>
        ) : (
          <Link
            to="/sign-in"
            className=" flex items-center  bg-white px-8 py-2 mx-2
                    rounded-full hover:bg-gray-200"
          >
            Signin
          </Link>
        )}
        <img
          onClick={() => setIsOpen(true)}
          src={menu_icon}
          className="md:hidden w-7 cursor-pointer"
          alt=""
        />
        {/*------------mobile-menu-----*/}
        <div
          className={` md:hidden  ${
            isOpen ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0
            overflow-hidden bg-white transition-all`}
        >
          <div className="flex justify-end p-6 cursor-pointer">
            <img
              onClick={() => setIsOpen(false)}
              src={cross_icon}
              alt=""
              className="w-6"
            />
          </div>
          <ul
            className="flex flex-col items-center gap-2 mt-5 px-5 text-lg
                font-medium"
          >
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="px-4 py2 rounded-full inline-block "
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className="px-4 py2 rounded-full inline-block "
            >
              About
            </Link>
            <Link
              to="/projects"
              onClick={() => setIsOpen(false)}
              className="px-4 py2 rounded-full inline-block "
            >
              Projects
            </Link>
            <Link
              to="/testimonials"
              onClick={() => setIsOpen(false)}
              className="px-4 py2 rounded-full inline-block "
            >
              Testimonials
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
