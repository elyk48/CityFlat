import React, { useEffect } from "react";
import "./standard.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";

function Standard() {

  const { ref, inView } = useInView();
  const animation = useAnimation();
  useEffect(() => {
    if (inView) {
      animation.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.7 },
      });
    } else {
      animation.start({ x: -100, opacity: 0 });
    }
  }, [animation, inView]);

  return (
    <div className="">
      <div className="standard__page">
        <div className="">
          <div className="title">
            <p className="title__standard">STANDARD</p>
          </div>
          <div className="line-in-middle"></div>
          <div className="standard__content">
            <div className="standard__description">
              <div className="side__line"></div>

              <motion.div className="description__content"
              ref={ref}
              initial={{ x: -100, opacity: 0 }}
              animate={animation}>
                <div className="description__title">
                  <p>OUR STANDARD COLLECTION</p>
                </div>

                <div className="description__text">
                  <p>
                    Our standard apartments feature modern appliances, tasteful
                    furnishings, and convenient access to local attractions and
                    entertainment. These apartments offer an exceptional level
                    of comfort and style, with a range of high-quality amenities
                    to elevate your stay.
                    <br />
                    <br />
                    Whether you're traveling for work or leisure, our standard
                    apartments offer an exceptional experience that is sure to
                    exceed your expectations.
                  </p>
                </div>
                <a href="/standard">
                  <button className="btn btn-outline-warning discover__button">
                    DISCOVER MORE
                  </button>
                </a>
              </motion.div>
            </div>

            <div className="description__image">
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                whileInView={{ opacity: [0, 1] }}
                transition={{ duration: 0.7 }}
                src="./bailey-alexander-pkIJXMezi_E-unsplash 1.png"
                alt="description"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Standard;
