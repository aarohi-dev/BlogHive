import Navbar from "./Navbar";
import Footer from "./Footer";
//import { Children } from "react";

export default function Layout({children}){
    return(
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}