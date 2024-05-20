export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}

//지난 시간 구하기
export function formatToTimeAgo(date: string): string {
  //하루에 몇 초?
  const dayInMs = 1000 * 60 * 60 * 24;

  //계산할 시각
  const time = new Date(date).getTime();

  //현재 시각
  const now = new Date().getTime();

  //계산할 시각에서 현재시각을 뺀 후 하루의 초로 나눈다. 그러면 며칠이 지났는지 알 수 있지.
  const diff = Math.round((time - now) / dayInMs);
  console.log(diff);

  if (!Number.isFinite(diff)) {
    throw new Error("채팅방 데이터 뭔가 오류다");
  }

  const formatter = new Intl.RelativeTimeFormat("ko", {
    numeric: "auto",
  });
  const formatterTime = new Intl.RelativeTimeFormat("ko");

  return formatter.format(diff, "day");
}
export const calculateLeftDday = (eventDate: string) => {
  const today = new Date();
  const locale = today.toDateString();
  const calLocale = new Date(locale);
  const targetDate = new Date(eventDate);
  const daysToAdd = 7;

  targetDate.setDate(targetDate.getDate() + daysToAdd);
  const localeTarget = targetDate.toDateString();

  const calLocaleTarget = new Date(localeTarget);

  const result =
    (calLocaleTarget.getTime() - calLocale.getTime()) / (24 * 60 * 60 * 1000);
  console.log("구매확정 마감일 : ", localeTarget);
  console.log("오늘 날짜 : ", locale);
  console.log("D-day", result);
  return Number(result);
};

//클래스 이름 추가하기
export function cls(...classname: string[]) {
  return classname.join(" ");
}
