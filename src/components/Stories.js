import React, { useEffect, useState } from "react";
import "./Stories.css";

const Stories = ({ data }) => {
  const [activeStory, setActiveStory] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5000);

  const openStory = (story) => {
    setActiveStory(story);
    setActiveSlideIndex(0);
    setIsPaused(false);
    setRemainingTime(5000);
  };

  const closeStory = () => {
    setActiveStory(null);
    setIsPaused(false);
  };

  const nextSlide = () => {
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
      setRemainingTime(5000);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
      setRemainingTime(5000);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    let timer;
    if (activeStory && !isPaused) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 100) {
            nextSlide();
            return 5000;
          }
          return prevTime - 100;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [activeStory, activeSlideIndex, isPaused]);

  return (
    <div className="stories-container">
      {/* Story Groups */}
      {data.map((story) => (
        <div key={story.id}>
          <div
            className="story-group"
            onClick={() => openStory(story)}
            style={{ borderColor: story.ringColor }}
          >
            <img
              src={story.thumbnail}
              alt={story.name}
              className="story-thumbnail"
            />
          </div>
          <span
            className="story-name"
            style={{ color: story.nameColor || "#000" }}
          >
            {story.name || "Untitled"}
          </span>
        </div>
      ))}

      {/* Story Modal */}
      {activeStory && (
        <div className="story-modal">
          <div className="story-slides">
            <button onClick={prevSlide} disabled={activeSlideIndex === 0}>
              {"<"}
            </button>

            <div className="slide-content">
              <div className="modal-top">
                <div className="modal-top-left">
                  <div className="modal-thumbnail-div">
                    <img src={activeStory.thumbnail} alt="" className="modal-thumbnail"></img>
                  </div>
                  <p>{activeStory.name}</p>
                </div>
                <div className="modal-top-right" onClick={togglePause}>
                  {isPaused ? "▶" : "||"}
                </div>
              </div>
              <div className="modal-middle">
                {activeStory.slides[activeSlideIndex].video ? (
                  <video
                    src={activeStory.slides[activeSlideIndex].video}
                    controls
                    autoPlay
                    className="story-video"
                  />
                ) : (
                  <img
                    src={activeStory.slides[activeSlideIndex].image}
                    alt={`Slide ${activeSlideIndex + 1}`}
                    className="story-image"
                  />
                )}
                <div className="progress-bars">
                  {activeStory.slides.map((_, index) => (
                    <div
                      key={index}
                      className="progress-bar"
                      style={{
                        width: `${100 / activeStory.slides.length}%`
                      }}
                    >
                      <div
                        style={{
                          width: index < activeSlideIndex ? "100%" : 
                                index === activeSlideIndex ? 
                                `${100 - (remainingTime / 5000 * 100)}%` : "0%",
                          height: "100%",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          transition: isPaused ? "none" : "width 0.1s linear"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {activeStory.slides[activeSlideIndex].link && (
                <a
                  href={activeStory.slides[activeSlideIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-button"
                >
                  {activeStory.slides[activeSlideIndex].button_text}
                </a>
              )}
            </div>
            <button
              onClick={nextSlide}
              disabled={activeSlideIndex === activeStory.slides.length - 1}
            >
              {">"}
            </button>
          </div>
          <button className="close-modal" onClick={closeStory}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Stories;