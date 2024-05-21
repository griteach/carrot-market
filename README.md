# Carrot Market Reloaded

> New Version of Carrot Market

# Tailwind

# Authentication UI

# Server Action

# Prisma

# Validation

# Product Upload

# MODAL

# Caching

# Optimistic Response

# Optimistic Challage

# Live Chat

# Challange ChatPage

# Extras NextJS 14

# Vercel deploy

# Challange Profile

## Add Profile page

> Edit, Purchase, Sales History, Reservation Button
> Review Info
>
> > Ratings, etc
> > Review list

- 고민해볼 것 : revalidateTag 시점을 언제로 할 것인가. 이걸 실행하지않으면 뭔놈의 다른 사람의 profile이 등장함.

## Chat Page

> input focus, 최신 메세지로 자동 이동, 페이지 렌더링 시 맨 밑으로 자동 이동

## Edit page

- 사용자 이름 변경하기
- 사용자 비밀번호 변경하기
- 사용자 아바타 변경하기
- username password phone avatar
- layout 적용, 뒤로가기 버튼

- 비밀번호가 없을 때.... 조치 요망

## Purchase, Sales History, Reservation Page

- 일단, model Product에 물품의 상태를 표시해 줘야 함.
  - 판매중 (forsale)
    - 이 때만, 예약을 할 수 있음
  - 예약중 (reservation)
    - 예약자 표시, 누가 예약했는지 userId 필요
  - 판매완료 (sold)
    - buyer, seller 표시

## 작업내용

- purchase 추적 완료
- sales 추적 완료
- 두 화면 모두 구성 완료
- reservation 구현 중
  - 채팅방 상단 메뉴 구현 완료
  - 예약하기 버튼 구현 완료
- forsale일때만 채팅하기 버튼 활성화(판매완료,예약중에는 비활성화)
- 예약하기 & 예약취소 구현
- 구매확정 구현

> 작업 필요

- 구매확정 관련 시간 보여주기(동적으로 변경 필요)
- 리뷰작성하기 메뉴
- 예약하기 메뉴에서 물품 이름, 채팅중인 사람, 관심갯수 보여주기
- 구매확정 후 홈에서 해당 물품 리스트 제거하기
- 관련 캐시 정리해야함.

유저기능 구축하기
유저 리뷰

- 구매가 완료되면 유저 리뷰 작성하기
  - 채팅창에서 아니면, 구매한 물품에서?
  - 둘 다 만들어두기
  - 채팅창에서 올리기 완료.

# Deploy

> 배포에 필요한 내용 준비
> package.json 에서 build 시 prisma generate 함께 진행하도록 변경
