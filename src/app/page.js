import React from 'react'
import { Suspense } from "react";

import Intro from '@/app/Intro/page'
const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Intro />
    </Suspense>
  )
}

export default page