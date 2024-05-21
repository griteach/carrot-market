export default function HomeLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900 text-white max-w-screen-md mx-auto h-screen">
      {children}
      {modal}
    </div>
  );
}
