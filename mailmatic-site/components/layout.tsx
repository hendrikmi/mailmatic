import React from "react";
import Image from "next/image";
import logo from "../public/mailmatic-logo.png";
import Nav from "./nav";

const Layout = ({ children }: any) => {
  return (
    <div className="h-screen flex flex-col mx-0">
      <div className="max-w-md m-auto">
        <Nav />
      </div>
      <div className="flex flex-grow">
        <div className="max-w-md m-auto p-2">
          <div className="bg-slate-800 p-6 rounded-md text-white">
            <div className="text-center my-6">
              <Image
                className="mx-auto"
                src={logo}
                alt=""
                width={64}
                height={64}
              />
              <h1 className="gradient-text text-3xl font-medium">MailMatic</h1>
              <div className="gradient-text">
                Your AI email-writing assistant
              </div>
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Layout;
