import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { FadeUp } from "../Hero/Hero";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="bg-[#f4f4f4] mt-5">
      <h1 className="text-3xl text-center pt-3 md:text-4xl font-bold !leading-snug">
        Contact Us
      </h1>
      <div
        className="container w-full py-14 flex flex-col md:flex-row gap-5 px-10"
      >
        {/* Contact text */}
        <div className="flex items-center cursor-pointer w-full md:w-1/2">
          <div className="flex flex-col gap-6 w-full md:px-15">
            <motion.div
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              //viewport={{once:true}}
              className="flex items-center gap-4 p-6 bg-[#fff] rounded-2xl *:
                hover:bg-[#f4f4f4] duration-300 hover:shadow-2xl
                "
            >
              <FaLocationDot />
              <p>No.220 Jos road rudun wada lga,kano state</p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              //viewport={{once:true}}
              className="flex items-center gap-4 p-6 bg-[#fff] rounded-2xl *:
                hover:bg-[#f4f4f4] duration-300 hover:shadow-2xl
                "
            >
              <FaPhone />
              <p>99896638</p>
            </motion.div>
            <motion.div
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              //viewport={{once:true}}
              className="flex items-center gap-4 p-6 bg-[#fff] rounded-2xl *:
                hover:bg-[#f4f4f4] duration-300 hover:shadow-2xl
                "
            >
              <MdOutlineEmail />
              <p>HAKIMI@info.com</p>
            </motion.div>
          </div>
        </div>
        {/* Contaact Input */}
        <div className="flex items-center justify-center w-full md:w-1/2 ">
          <div className="flex flex-col gap-6 w-full">
            <motion.input
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              // viewport={{once:true}}
              className="border-solid rounded-md border-2 border-[#f4f4f]  py-3 px-2 w-full"
              type="text"
              placeholder="Name"
            />
            <motion.input
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              // viewport={{once:true}}
              className="border-solid border-2 rounded-md border-[#f4f4f] py-3 px-2  w-full"
              type="email"
              placeholder="Email"
            />
            <motion.textarea
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              //viewport={{once:true}}
              className="border-solid border-2 rounded-md border-[#f4f4f]  py-3 px-2 w-full"
              placeholder="Message"
              name=""
              id=""
            ></motion.textarea>
            <motion.button
              variants={FadeUp(0.2)}
              initial="initial"
              whileInView={"animate"}
              //viewport={{once:true}}
              className="primary-btn ease-in-out duration-500 transition"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
