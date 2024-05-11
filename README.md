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
    - 예약자 표시
  - 판매완료 (sold)
    - buyer, seller 표시
