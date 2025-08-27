import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen relative bg-gray-900 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      />
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Welcome to Our Platform
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Discover amazing experiences and transform your ideas into reality
        </p>
        <div className="space-x-4">
          <Link 
            href="/instructions"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 inline-block"
          >
            Get Started
          </Link>
           <Link
            href="/water-bottle"
             className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-8 rounded-lg text-lg transition duration-300">
          
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
