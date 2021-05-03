import React, { useEffect, useRef, useState } from 'react'
import hexToRgba from '../../hooks/hexToRgba'
import { useStaticQuery, graphql } from 'gatsby'
import './scrollBackdrop.scss'
const Svg = require('../../svgs/backdrop.svg') as string;

const ScrollBackdrop = () => {
  const data = useStaticQuery(graphql`
    {
      allWp {
        nodes {
          contactInfo {
            backdrop_palette {
              backdropPalettes {
                palette {
                  selector
                  spectrum {
                    alpha
                    color
                  }
                }
              }
            }
          }
        }
      }
    }
  `)
  const buildSpectrums = () => {
    let output = []
    const input =
      data.allWp.nodes[0].contactInfo.backdrop_palette.backdropPalettes[0]
        .palette
    input.map(section => {
      let spectrum = []
      section.spectrum.map(color => {
        interface Row {
          color: {
            r: number,
            g: number,
            b: number
          }
          alpha: number
        }

        let row = {} as Row
        row.color = hexToRgba(color.color, color.alpha)
        row.alpha = color.alpha
        spectrum.push(row)
      })
      output.push({ [section.selector]: spectrum })
    })
    return output
  }
  const spectrums = buildSpectrums()

  const [fills, setFills] = useState([{ 'path': 'rgb(0,0,0)' }])
  const refContainer = useRef(null)

  const handleFill = () => {
    const scroll =
      window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)
    let newFills = []
    spectrums.forEach((obj, k) => {
      const operators = {
        '+': function (a, b) {
          return a + b
        },
        '-': function (a, b) {
          return a - b
        },
      }

      const key = Object.keys(obj)[0]
      const spectrum = obj[key]
      const current = { 'r': 0, 'g': 0, 'b': 0, 'a': 1 }
      const position = scroll * spectrum.length
      const floor =
        Math.floor(position) < spectrum.length
          ? Math.floor(position)
          : spectrum.length - 1
      const ceiling =
        position % 1 === 0 ? floor + 1 : Math.ceil(position)
      const ratio = (scroll * spectrum.length - floor) / (ceiling - floor)
      Object.keys(spectrum[floor].color).map((key, j) => {
        const floorVal = spectrum[floor].color[key]
        const ceilingVal = spectrum[ceiling]
          ? spectrum[ceiling].color[key]
          : floorVal

        const op = floorVal >= ceilingVal ? '-' : '+'
        const diff = operators[op](floorVal, ceilingVal)
        const prog = diff * ratio
        current[key] = parseFloat(operators[op](floorVal, prog))
      })
      let newFill = {}
      newFill[
        key
      ] = `rgba(${current['r']},${current['g']},${current['b']},${current['a']})`
      newFills.push(newFill)
    })
    setFills(newFills)
  }
  useEffect(() => {
    handleFill()
  }, [])
  useEffect(() => {
    refContainer.current.focus()
    fills.map(fill => {
      Object.keys(fill).map(id => {
        const paths = [...refContainer.current.children[0].querySelectorAll(id)]
        paths.map(path => {
          path.style.fill = fill[id]
        })
      })
    })
    window.addEventListener('scroll', handleFill, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleFill)
    }
  }, [fills])

  return (
    <>
      <div ref={refContainer} className='scroll-backdrop'>
        <Svg />
      </div>
    </>
  )
}

export default ScrollBackdrop
