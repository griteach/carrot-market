import { getReviews, getReviewsInfo, getUserInfo, logOut } from "@/lib/db_user";
import { cls } from "@/lib/utils";
import { StarIcon } from "@heroicons/react/24/solid";
import { count } from "console";
import { revalidateTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";

interface ReviewsResponse {
  id: number;
  reviewMessage: string | null;
  rating: number;
  user: {
    username: string;
    avatar: string | null;
  };
  product: {
    title: string;
  };
  created_at: Date;
}

interface NumericDictionary {
  [key: number]: number;
}

export default async function Profile() {
  //user profile 가져오기
  const user = await getUserInfo();

  //review 가져오기
  const reviews = await getReviewsInfo();

  //rating 평균 계산하기
  function calculateAverageRating(reviews: ReviewsResponse[]): number {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    return averageRating;
  }

  //rating 갯수 구하기
  function getCountRatings(reviews: ReviewsResponse[]): {
    [key: number]: number;
  } {
    return reviews.reduce((acc: NumericDictionary, { rating }) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});
  }

  const averageRatings = calculateAverageRating(reviews).toFixed(1);
  //ratings max 갯수
  const countRatings = getCountRatings(reviews);

  //언제 revalidate 시켜야 하는지 더 고민해보자...
  revalidateTag("user-detail");
  revalidateTag("reviews-detail");

  return (
    <div className="p-6 h-screen flex flex-col gap-4 items-center">
      <div className="w-full mx-auto px-5 py-8 bg-white  rounded-lg shadow">
        <div className="w-16 h-16 mx-auto overflow-hidden rounded-full border-2 border-gray-300">
          {user?.avatar ? (
            <Image
              width={20}
              height={20}
              src={user?.avatar}
              alt="Arnoldy Chafe"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full object-cover bg-slate-400"></div>
          )}
        </div>
        <div className="w-full flex justify-center items-center mt-2">
          <h1 className="mt-2 text-3xl text-black">{`${user?.username}님,
          안녕하세요!`}</h1>
        </div>

        <div className="text-center mt-4">
          <h1 className="text-xl font-semibold text-black"></h1>
          <p className="text-gray-500">{user?.email} | Joined May 2024</p>
        </div>
        <div className="flex justify-center space-x-4 mt-8">
          <Link href={`/profile/${user?.id}/edit`}>
            <span className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Edit
            </span>
          </Link>
          <Link href={`/profile/${user?.id}/purchase`}>
            <span className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Purchase
            </span>
          </Link>
          <Link href={`/profile/${user?.id}/sale`}>
            <span className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Sales
            </span>
          </Link>
          <Link href={`/profile/${user?.id}/reservation`}>
            <span className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
              Reservation
            </span>
          </Link>
        </div>
      </div>
      <div className="w-full mx-auto px-5 py-8 bg-white  rounded-lg shadow text-black flex flex-col gap-2">
        <h1 className="text-xl font-bold">Reviews</h1>
        <hr />

        <div className="grid grid-cols-3 ">
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-6xl font-bold">{averageRatings}</div>
            <div className="flex items-center *:size-4 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`size-4 ${cls(
                    Number(averageRatings) >= star
                      ? "text-yellow-400"
                      : "text-gray-400"
                  )}`}
                />
              ))}
            </div>
            <div className="text-gray-400 text-sm">
              {reviews.length} reviews
            </div>
          </div>
          <div className="  col-span-2 flex flex-col  justify-center items-center ">
            <div className="flex items-center justify-evenly w-full">
              <span className="text-gray-600">5</span>
              <progress
                className="progress w-56"
                value={countRatings["5"] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
            <div className="flex items-center justify-evenly w-full">
              <span className="text-gray-600">4</span>
              <progress
                className="progress w-56"
                value={countRatings["4"] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
            <div className="flex items-center justify-evenly w-full">
              <span className="text-gray-600">3</span>
              <progress
                className="progress w-56"
                value={countRatings["3"] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
            <div className="flex items-center justify-evenly w-full">
              <span className="text-gray-600">2</span>
              <progress
                className="progress w-56"
                value={countRatings["2"] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
            <div className="flex items-center justify-evenly w-full">
              <span className="text-gray-600">1</span>
              <progress
                className="progress w-56 "
                value={countRatings["1"] ?? 0}
                max={Object.keys(countRatings).length}
              ></progress>
            </div>
          </div>
        </div>
      </div>
      {reviews.length ? (
        <div className="flex flex-col gap-4 w-full mx-auto px-5 py-8 bg-white  rounded-lg shadow text-black">
          {reviews.map((review) => (
            <div key={review.id} className="grid grid-cols-3 h-16">
              <div className="flex justify-start  items-center gap-4 ">
                <div className="flex  ">
                  {review.user.avatar ? (
                    <Image
                      src={review.user.avatar}
                      alt={review.user.username}
                      width={30}
                      height={30}
                    />
                  ) : (
                    <div className="rounded-full size-8 bg-gray-400 "></div>
                  )}
                </div>
                <div className="flex flex-col gap-1  justify-center items-start">
                  <div className="text-lg">{review.user.username}</div>
                  <div className="text-gray-700 text-xs bg-slate-200 rounded-2xl px-2 py-1">
                    BUYER
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-1 justify-center ">
                <div>
                  <div className="flex items-center ">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-4 ${cls(
                          review.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-400"
                        )}`}
                      />
                    ))}
                  </div>
                </div>
                <div>{review.reviewMessage}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <form action={logOut} className="w-full">
        <button className="w-full bg-red-500 p-3  rounded-xl font-bold hover:bg-red-700 transition-colors">
          Log Out
        </button>
      </form>
    </div>
  );
}
