export default function Home() {
  return (
    <main className="bg-gray-100 sm:bg-red-100 md:bg-green-100 lg:bg-cyan-100 xl:bg-orange-100 2xl:bg-red-200 3xl:bg-black h-screen flex items-center justify-center p-5 ">
      <div className="bg-white w-full p-6 shadow-lg rounded-3xl max-w-screen-sm flex flex-col gap-3 ">
        {["nico", "Me", "you", "Yourself"].map((person, index) => (
          <div key={index} className="flex items-center gap-5  rounded-xl ">
            <div className="size-10 bg-blue-400 rounded-full"></div>
            <span className="text-lg font-medium">{person}</span>
            <div className="size-5 animate- bg-red-500 text-white flex items-center justify-center rounded-full">
              <span>{index}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
