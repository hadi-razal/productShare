"use client"

import { AppProgressBar } from 'next-nprogress-bar';

const ProgressBar = () => {
    return (
        <div>
            <AppProgressBar height="3px"
                color="#003399"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </div>
    )
}

export default ProgressBar