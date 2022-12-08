import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useLang } from "../lang/langContext";
import { langs } from "../lang/languages";
import { scrollToTop } from "../lib/util";

type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {

  const {lang, setLang} = useLang()
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  // setLang(langs["en"])
  setLang(langs["zh_HANS"])

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
