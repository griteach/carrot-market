export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-red-200 3xl:bg-black h-screen flex items-center justify-center p-5 ">
      <div className="bg-white w-full p-6 shadow-lg rounded-3xl max-w-screen-sm flex flex-col md:flex-row gap-2">
        <input
          className="w-full rounded-full h-12 py-2 bg-gray-200 pl-5 outline-none ring ring-transparent focus:ring-orange-500 focus:ring-offset-2 transition-shadow placeholder:drop-shadow"
          type="text"
          placeholder="Search here..."
        />
        <button className="bg-black text-white py-2 rounded-full active:scale-95 transition-transform font-medium md:px-10">
          Search
        </button>
      </div>
    </main>
  );
}
