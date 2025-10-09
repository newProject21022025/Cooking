const Icon_right = () => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      
    >
      <g filter="url(#filter0_d_282_2290)">
        <rect
          x="6"
          y="48"
          width="44"
          height="44"
          rx="22"
          transform="rotate(-90 6 48)"
          fill="white"
          fillOpacity="0.6"
          shapeRendering="crispEdges"
        />
        <path
          d="M24.3334 37L35.3334 26L24.3334 15"
          stroke="#D87B09"
          strokeWidth="2"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_282_2290"
          x="0"
          y="0"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="4" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_282_2290"
          />
          <feBlend
            mode="normal"
            in="BackgroundImageFix"
            in2="effect1_dropShadow_282_2290"
            result="BackgroundImageFix"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Icon_right;
