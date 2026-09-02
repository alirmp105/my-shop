const Loading = () => {
  return (
    <div className="flex min-h-dvh items-center justify-center gap-2 bg-white">
      <span className="size-3 animate-bounce rounded-full  bg-zinc-800  [animation-delay:-0.3s]"></span>
      <span className="size-3 animate-bounce rounded-full  bg-zinc-800 [animation-delay:-0.15s]"></span>
      <span className="size-3 animate-bounce rounded-full bg-zinc-800 "></span>
    </div>
  );
};

export default Loading;
