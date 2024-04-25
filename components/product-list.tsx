"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProducts from "./list-products";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);

  //추적하기 위한 트리거 생성
  //useRef를 사용하면 어떤 엘리멘트를 참조할지 정해줄 수 있음
  //getElementById를 해서 해당 element를 찾아오는 것과 같은 의미
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    //옵저버를 생성하기 intersectionObserver
    //추적하고자 하는 엘리멘트가 보이면 뭔가를 실행
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[], //여러개의 엘리멘트를 추적할수도 있으니까 기본적으로 배열 형태
        observer: IntersectionObserver
      ) => {
        const element = entries[0]; //그 중 첫번째 녀석 가져오기
        if (element.isIntersecting && trigger.current) {
          //추적하는 element가 isIntersecting되었다면 일단 관찰을 중단한다.
          //사용자에게 보여지고 있으니까 추적하지 않는다.
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setPage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
            setIsLoading(false);
          } else {
            setIsLastPage(true);
          }
        }
      },
      { threshold: 1.0 }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }

    //이 페이지가 종료될 때 observer를 완전히 kill 해줘야 한다.
    //사라진 컴포넌트를 계속 추적하게 하지 말아야 한다.
    //자원을 관리해야 한다는 의미.
    return () => {
      observer.disconnect();
    };
  }, [page]);

  const onLoadMoreClick = async () => {};
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProducts key={product.id} {...product} />
      ))}

      {!isLastPage ? (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      ) : null}
    </div>
  );
}
