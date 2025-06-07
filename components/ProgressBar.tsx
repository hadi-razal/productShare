"use client";

import { AppProgressBar } from "next-nprogress-bar";

const ProgressBar = () => {
  return (
    <div>
      <AppProgressBar
        height="3px"
        color="#6c64cb"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
};

export default ProgressBar;
