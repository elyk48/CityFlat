import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import Rate from "../../Rate/Rate";
import { motion } from "framer-motion";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";
import "./luxuriouCollection.css";

function LuxuriousCollection() {

  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setApartments(result.data.map((apartment) => ({ ...apartment, liked: false })));
        
        // Log the data here
        console.log(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleLikeClick = (id) => {
    setApartments((prevApartments) =>
      prevApartments.map((apartment) =>
        apartment.id === id ? { ...apartment, liked: !apartment.liked } : apartment
      )
    );
  };



  return (
    <section className="luxury__collection__page">
      <motion.div
        whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="luxury_collection_items_title">
          <h2>{t("OUR LUXURIOUS COLLECTION")}</h2>
          <div className="line-in-middle"></div>
        </div>
        <div className="luxury_collection_items_content">
          <div className="luxury_collection_content">
            <div className="row">
              {apartments.map((data) => {
                if (data.type === "LUXURY") {
                  return (
                    <div className="col-sm-4" key={data.id}>
                      {" "}
                      <div className="card">
                        <div className="card_img">
                          <Link to={`/details/${data.id}`}>
                            <motion.img
                              whileHover={{ scale: 0.95 }}
                              whileTap={{ scale: 0.8 }}
                              whileInView={{ opacity: [0, 1] }}
                              transition={{ duration: 0.7 }}
                              src={data.img[0]}
                              height={250}
                              className="card-img-top"
                              alt="..."
                            />
                          </Link>
                        </div>
                        <div className="card_body">
                          <div className="like_button_luxury">
                          <button onClick={() => handleLikeClick(data.id)}>
                              <FontAwesomeIcon
                                icon={data.liked ? faHeart : faHeartEmpty}
                                className={`heart-icon ${data.liked ? "liked" : ""}`}
                              />
                            </button>
                          </div>
                          <div className="card_content_luxury">
                            <h3>{data.name}</h3>
                            <p>{data.description}</p>
                            <Rate
                              rating={data.rating}
                            />
                            <strong>{data.pricePerNight}€</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default LuxuriousCollection;
