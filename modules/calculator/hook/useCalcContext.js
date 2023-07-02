import React, { useState, createContext, useContext, useMemo } from 'react'

export const Context = createContext(null)

const useCalcContext = () => useContext(Context)

export default useCalcContext
