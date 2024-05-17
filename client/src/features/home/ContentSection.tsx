/* eslint-disable no-var */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


export default function ContentSection() {

    function SampleNextArrow(props: any) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "none" }}
            onClick={onClick}
          />
        );
      }
      
      function SamplePrevArrow(props: any) {
        const { className, style, onClick } = props;
        return (
          <div
            className={className}
            style={{ ...style, display: "none"}}
            onClick={onClick}
          />
        );
      }


  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 900,
    autoplaySpeed: 3000,
    cssEase: "linear",
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    swipeToSlide: true,
    // afterChange: function(index: any) {
    //   console.log(
    //     `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
    //   );
    // }
  };

  return (
    <Slider {...settings}>
        <div className="img-slider">
            <img src="/images/homepage/img-home-1.jpg" />
        </div>
        <div className="img-slider">
            <img src="/images/homepage/img-home-2.jpg" />
            
        </div>
        <div className="img-slider">
            <img src="/images/homepage/img-home-3.jpg" />
            
        </div>
        <div className="img-slider">
            <img src="/images/homepage/img-home-4.jpg" />
        </div>
        <div className="img-slider">
            <img src="/images/homepage/img-home-5.jpg" />
        </div>
        <div className="img-slider">
            <img src="/images/homepage/img-home-6.jpg" />
        </div>
    </Slider>
  );
}

