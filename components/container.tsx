import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { scrollToTop } from "../lib/util";

type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScrollToTopButton(true);
      } else {
        setShowScrollToTopButton(false);
      }
    });
  }, []);

  return (
    <section>
      {showScrollToTopButton && (
        <button onClick={scrollToTop} className="back-to-top">
          &#8679;
        </button>
      )}
      <div><Toaster position="bottom-center" toastOptions={{
              style: {
                border: '1px solid #713200'
              }
            }} /></div>

      <div className="container mx-auto px-5">{children}</div>
    </section>
    
  )
}

export default Container
