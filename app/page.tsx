export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5 ">
      <div className="bg-white w-full p-6 shadow-lg rounded-3xl max-w-screen-sm ">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-600 font-semibold -mb-1">
              In transit
            </span>
            <span className="text-4xl font-semibold">Cool Blue</span>
          </div>
          <div className="size-12 rounded-full bg-orange-400" />
        </div>
        <div className="my-2 flex items-center gap-2">
          <span className="bg-green-400 text-white uppercase px-2.5 py-1.5 text-xs font-medium rounded-full hover:bg-green-500 hover:cursor-pointer hover:scale-125 transition">
            Today
          </span>
          <span>9:30-10:30</span>
        </div>
        <div className="relative">
          <div className="bg-gray-200 absolute rounded-full w-full h-2"></div>
          <div className="bg-green-500 absolute rounded-full h-2 w-2/3"></div>
        </div>

        <div className="flex justify-between items-center mt-5 text-gray-600">
          <span>Expected</span>
          <span>Sorting center</span>
          <span>In transit</span>
          <span className="text-gray-400">Delivered</span>
        </div>
      </div>
    </main>
  );
}
