import React, { memo, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { gsap } from 'gsap';

// Add the horizontalLoop function here
function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: 'none' },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  });
  let length = items.length;
  let startX = items[0].offsetLeft;
  let times = [];
  let widths = [];
  let xPercents = [];
  let curIndex = 0;
  let pixelsPerSecond = (config.speed || 1) * 100;
  let snap =
    config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1);
  let totalWidth;
  let curX;
  let distanceToStart;
  let distanceToLoop;
  let item;
  let i;

  gsap.set(items, {
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, 'width', 'px')));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, 'x', 'px')) / w) * 100 +
          gsap.getProperty(el, 'xPercent')
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], 'scaleX') +
    (parseFloat(config.paddingRight) || 0);

  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, 'scaleX');

    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond,
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          ),
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false,
        },
        distanceToLoop / pixelsPerSecond
      )
      .add('label' + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); // always go in the shortest direction
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      // if we're wrapping the timeline's playhead, make the proper adjustments
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }

  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }

  return tl;
}

const Home = () => {
  useEffect(() => {
    // Select the text elements
    const textItems = gsap.utils.toArray('.scrolling-text span');

    // Initialize the horizontal loop with the text elements
    const loop = horizontalLoop(textItems, {
      speed: 0.5, // Adjust the speed of movement (this is the number of pixels per second)
      repeat: -1, // The loop will repeat indefinitely
      paddingRight: 50, // Optionally adjust the padding
    });

    // Start the animation automatically
    loop.play(); // Automatically start the animation

    // Optional: You can adjust any other functionality like pausing or reversing as needed.
  }, []);

  return (
    <div
      className="min-h-screen bg-[#F5F1E3] overflow-hidden relative"
      id="Home"
    >
      {/* Full-screen scalable Spline model in front of the text */}
      <div className="md:flex absolute inset-0 w-full h-full items-center justify-center z-10">
        <Spline
          scene="https://prod.spline.design/BhCg4hiQ4mJIlT6H/scene.splinecode"
          className="w-full h-full max-w-none"
        />
      </div>

      {/* Text that scrolls behind the Spline model */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '0',
          fontSize: '3rem',
          whiteSpace: 'nowrap',
          color: '#1C1C1C',
          zIndex: 0, // The text is behind the model
          display: 'flex',
        }}
        className="scrolling-text font-[Great_Vibes] font-normal not-italic bg-[#dea193]"
      >
        {/* Duplicate the text to create a seamless scrolling effect */}
        <span>
          Vento Splendore Luce Prezioso Eleganza Brillante Aurora Incanto Magia
          Sogno Regalità Tesoro Inestimabile Perla Zaffiro Gemma Veneziano
          Morbido Luminosa Raffinatezza Fascino Armonia Vibrante Sofisticato
          Pregevole Risplendere Aurora Lux Fiamma
        </span>
        <span>
          Splendore Luce Prezioso Eleganza Brillante Aurora Incanto Magia Sogno
          Regalità Tesoro Inestimabile Perla Zaffiro Gemma Veneziano Morbido
          Luminosa Raffinatezza Fascino Armonia Vibrante Sofisticato Pregevole
          Risplendere Aurora Lux Fiamma Vento
        </span>
      </div>
    </div>
  );
};

export default memo(Home);
