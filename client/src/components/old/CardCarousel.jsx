import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CardCarousel() {
  return (
    <div className="carousel-wrapper">
        <Carousel autoPlay="true" >
          <div>
            <img
              className="card-img-top"
              src="https://picsum.photos/500/300?img=1"
              alt="Card image cap"
            />
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Slide Card 1</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                </div>
            </div>
          </div>
          <div>
            <img
              className="card-img-top"
              src="https://picsum.photos/500/300?img=2"
              alt="Card image cap"
            />
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Slide Card 2</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                </div>
            </div>
          </div>
          <div>
            <img
              className="card-img-top"
              src="https://picsum.photos/500/300?img=3"
              alt="Card image cap"
            />
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Slide Card 3</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                </div>
            </div>
          </div>
        </Carousel>
      </div>
    );
  }