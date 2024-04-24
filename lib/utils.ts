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

  const formatter = new Intl.RelativeTimeFormat("ko");
  return formatter.format(diff, "day");
}
