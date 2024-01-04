import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { getLang } from "../lang/langUtil";
import { scrollToTop, windowExists } from "../lib/util";

type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  useEffect(() => {
    if (windowExists()) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          setShowScrollToTopButton(true);
        } else {
          setShowScrollToTopButton(false);
        }
      });
    }
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
