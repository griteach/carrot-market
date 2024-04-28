import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default async function Modal({ params }: { params: { id: string } }) {
  return (
    <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60 left-0 top-0">
      <button className="absolute right-20 top-20 text-neutral-200">
        <XMarkIcon className="size-10" />
      </button>
      <div className="max-w-screen-sm h-1/2 flex justify-center w-full">
        <div className="aspect-square bg-neutral-700 rounded-md text-neutral-200 flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
