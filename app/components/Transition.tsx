// "use client";
import "../normalize.css";
import DistortedEffect from "./DistortedEffect/DistortedEffect";


const Transition = () => {

  return (
    <>
      <div className="main main--demo-5">
        <div className="content ">
          <div
            className="hamburger hamburger--demo-5 js-hover"

          >
            <div>
              <div className="hamburger__line hamburger__line--01">
                <div className="hamburger__line-in hamburger__line-in--01 hamburger__line-in--demo-5"></div>
              </div>
              <div className="hamburger__line hamburger__line--02">
                <div className="hamburger__line-in hamburger__line-in--02 hamburger__line-in--demo-5"></div>
              </div>
              <div className="hamburger__line hamburger__line--03">
                <div className="hamburger__line-in hamburger__line-in--03 hamburger__line-in--demo-5"></div>
              </div>
            </div>

            <div>
              <div className="hamburger__line hamburger__line--cross01">
                <div className="hamburger__line-in hamburger__line-in--cross01 hamburger__line-in--demo-5"></div>
              </div>
              <div className="hamburger__line hamburger__line--cross02">
                <div className="hamburger__line-in hamburger__line-in--cross02 hamburger__line-in--demo-5"></div>
              </div>
            </div>
          </div>

          <div
           className="global-menu"
          >
            <div className="global-menu__wrap">
              <DistortedEffect />
            </div>
          </div>

          <svg
            className="shape-overlays"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path className="shape-overlays__path"></path>
            <path className="shape-overlays__path"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Transition;


