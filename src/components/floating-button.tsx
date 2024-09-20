'use client';

const FloatingButton = () => {
  const handleUpClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownClick = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed flex flex-col gap-4 top-1/2 right-8 -translate-y-1/2">
      <button
        aria-label="floatingUpButton"
        className="rounded-full bg-white p-2 border text-black"
        onClick={handleUpClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 15.75 7.5-7.5 7.5 7.5"
          />
        </svg>
      </button>
      <button
        aria-label="floatingDownButton"
        className="rounded-full bg-white p-2 border text-black"
        onClick={handleDownClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButton;
