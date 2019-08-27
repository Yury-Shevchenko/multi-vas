// slider styles variables
let sliderStyle = {
  trackHeight: '1px',
  thumbHeightActive: '30px',
  thumbWidthActive: '30px',
  thumbHeightVisible: '30px',
  thumbWidthVisible: '30px',
  thumbBackgroundColorVisible: 'white',
}

const template = document.createElement('template')
template.innerHTML = `
<style>

    :host {
      font-family: sans-serif;
      text-align: center;
    }

    input[type=range] {
      -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
       width: 100%; /* Specific width is required for Firefox. */
       background: transparent; /* Otherwise white in Chrome */
    }

    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: transparent;
      height: 1px;
      width: 1px;
      background: transparent;
    }

    /* All the same stuff for Firefox */
    input[type=range]::-moz-range-thumb {
      border: transparent;
      height: 1px;
      width: 1px;
      background: transparent;
    }

    /* All the same stuff for IE */
    input[type=range]::-ms-thumb {
      border: transparent;
      height: 1px;
      width: 1px;
      background: transparent;
    }

    input[type=range]:focus {
      outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    }

    input[type=range]::-ms-track {
      width: 100%;
      cursor: pointer;
      /* Hides the slider so custom styles can be added */
      background: transparent;
      border-color: transparent;
      color: transparent;
    }

    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: ${sliderStyle.trackHeight};
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: transparent;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }

    input[type=range]:focus::-webkit-slider-runnable-track {
      background: transparent;
    }

    input[type=range]::-moz-range-track {
      width: 100%;
      height: ${sliderStyle.trackHeight};
      cursor: pointer;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      background: transparent;
      border-radius: 1.3px;
      border: 0.2px solid #010101;
    }

    input[type=range]::-ms-track {
      width: 100%;
      height: ${sliderStyle.trackHeight};
      cursor: pointer;
      background: transparent;
      border-color: transparent;
      border-width: 16px 0;
      color: transparent;
    }

    input[type=range]::-ms-fill-lower {
      background: transparent;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }

    input[type=range]:focus::-ms-fill-lower {
      background: transparent;
    }

    input[type=range]::-ms-fill-upper {
      background: transparent;
      border: 0.2px solid #010101;
      border-radius: 2.6px;
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }

    input[type=range]:focus::-ms-fill-upper {
      background: transparent;
    }

    /* Special styling for WebKit/Blink */
    input.visible[type=range]::-webkit-slider-thumb {
      background: ${sliderStyle.thumbBackgroundColorVisible};
      -webkit-appearance: none;
      border: 1px solid #000000;
      height: ${sliderStyle.thumbHeightVisible};
      width: ${sliderStyle.thumbWidthVisible};
      border-radius: 3px;
      cursor: pointer;
      margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
    }

    /* All the same stuff for Firefox */
    input.visible[type=range]::-moz-range-thumb {
      background: ${sliderStyle.thumbBackgroundColorVisible};
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      border: 1px solid #000000;
      height: ${sliderStyle.thumbHeightVisible};
      width: ${sliderStyle.thumbWidthVisible};
      border-radius: 3px;
      cursor: pointer;
    }

    /* All the same stuff for IE */
    input.visible[type=range]::-ms-thumb {
      background: ${sliderStyle.thumbBackgroundColorVisible};
      box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
      border: 1px solid #000000;
      height: ${sliderStyle.thumbHeightVisible};
      width: ${sliderStyle.thumbWidthVisible};
      border-radius: 3px;
      cursor: pointer;
    }

    /* Special styling for WebKit/Blink */
    input.active[type=range]::-webkit-slider-thumb {
      height: ${sliderStyle.thumbHeightActive};
      width: ${sliderStyle.thumbWidthActive};
    }

    /* All the same stuff for Firefox */
    input.active[type=range]::-moz-range-thumb {
      height: ${sliderStyle.thumbHeightActive};
      width: ${sliderStyle.thumbWidthActive};
    }

    /* All the same stuff for IE */
    input.active[type=range]::-ms-thumb {
      height: ${sliderStyle.thumbHeightActive};
      width: ${sliderStyle.thumbWidthActive};
    }

    .container_row {
      height: 100px;
      margin: 0;
      position: relative;
    }

    .sliderLayer {
      position: absolute;
      z-index: 1;
      left: 0;
      top: 0;
      height: 100px;
    }

    .button {
      padding: 15px 25px;
      cursor: pointer;
      outline: none;
      border: none;
      border-radius: 15px;
      box-shadow: 0 9px #999;
    }

    .button:hover {opacity: 0.8}

    .button:active {
      opacity: 0.5;
      box-shadow: 0 5px #666;
      transform: translateY(4px);
    }

</style>

<div class="container_buttons"
  style="display:grid;
         grid-template-columns: max-content;
         grid-row-gap: 10px;
         grid-column-gap: 20px;
         justify-items: left;
">
</div>
<div class="container_row">
</div>
<slot></slot>

`;


// create class
class MultiVas extends HTMLElement {

  constructor() {
    super()
    this._shadowRoot = this.attachShadow({ 'mode': 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback(){
    let notClicked = true
    let finishChanging = true

    this.items.map(( { name, url, background, id, value }, index ) => {

      const slider = document.createElement('input')
      slider.type = 'range'
      slider.classList.add('sliderLayer')
      slider.id = id
      slider.min = this.getAttribute('min')
      slider.max = this.getAttribute('max')
      slider.step = this.getAttribute('step')

      this._shadowRoot.querySelector('.container_row').appendChild(slider)

      const hidden_input = document.createElement('input')
      hidden_input.type = 'hidden'
      hidden_input.name  = name
      hidden_input.classList.add('hidden_input')
      hidden_input.id  = 'hidden_' + id
      document.querySelector('multi-vas').appendChild(hidden_input)

      // Add a custom style of thumbs to CSS
      this._shadowRoot.querySelector('style').innerHTML +=
        `
          input.${name}[type=range]::-webkit-slider-thumb {
            background: ${background};
            background-position: center center;
            background-repeat: no-repeat;
          }
          input.${name}[type=range]::-moz-range-thumb {
            background: ${background};
            background-position: center center;
            background-repeat: no-repeat;
          }
          input.${name}[type=range]::-ms-thumb {
            background: ${background};
            background-position: center center;
            background-repeat: no-repeat;
          }
        `

      slider.addEventListener('mouseup', (e) => {
        finishChanging = true
      })

      slider.addEventListener('input', (e) => {

        notClicked = true
        let activeSliderId = window.activeSliderId || slider.id
        let activeSlider = window.activeSlider || slider
        let isOverlap = this.items.filter(v => v.value == e.target.value && v.id != activeSliderId).length

        if (isOverlap){
          let difference = e.target.value - this.items.filter(v => v.id == activeSlider.id)[0].value
          let isBig = Math.abs(difference) > 3
          if(isBig || finishChanging){
            const prevValue = e.target.value
            this._shadowRoot.querySelector(`#${activeSlider.id}`).value = this.items.filter(v => v.id == activeSlider.id)[0].value
            this._shadowRoot.querySelectorAll('.sliderLayer').forEach(slider => {
              slider.style.zIndex = 1
              slider.classList.remove('active')
            })
            activeSliderId = this.items.filter(v => v.value == prevValue)[0].id
            activeSlider = this._shadowRoot.querySelector(`#${activeSliderId}`)
            activeSlider.style.zIndex = 2
            window.activeSliderId = activeSliderId
            window.activeSlider = activeSlider
            finishChanging = false
          }
        } else {
          this.items.filter(v => v.id == activeSlider.id)[0].value = e.target.value
          finishChanging = false
        }

        activeSlider.classList.add('active')
        activeSlider.classList.add('visible')
        activeSlider.classList.add(this.items.filter(v => v.id == activeSlider.id)[0].name)

        let current_hidden_input = document.querySelector(`#hidden_${activeSlider.id}`)
        current_hidden_input.value = this.items.filter(v => v.id == activeSlider.id)[0].value

        Array.from(this._shadowRoot.querySelectorAll('.sliderLayer')).map(i => {
          i.value = this.items.filter(v => v.id == i.id)[0].value
        })

        const currentButton = this._shadowRoot.querySelector(`#${'btn_' + activeSliderId}`)
        this._shadowRoot.querySelectorAll('.sliderLayer').forEach(otherslider => {
          this._shadowRoot.querySelector(`#${'name_' + otherslider.id}`).style.border = "0px"
          this._shadowRoot.querySelector(`#${'instruction_' + otherslider.id}`).innerHTML = ""
        })
        this._shadowRoot.querySelector(`#${'name_' + activeSliderId}`).style['border-bottom'] = "2px solid #000000"

        if(Array.from(this._shadowRoot.querySelectorAll('.sliderLayer')).filter(slider => !slider.classList.contains('visible')).length){
          const nextBtnId = Array.from(this._shadowRoot.querySelectorAll('.sliderLayer')).filter(slider => !slider.classList.contains('visible'))[0].id
          const nextButton = this._shadowRoot.querySelector(`#${'btn_' + nextBtnId}`)
          nextButton.disabled = false
          this._shadowRoot.querySelector(`#${'instruction_' + nextBtnId}`).innerHTML = '&#x2190; Click here to choose the next item'
        }
      })

      // Create buttons
      let btnDiv = document.createElement('div')
      btnDiv.style.display = 'grid'
      btnDiv.style['grid-template-columns'] = 'minmax(100px, 1fr) 50px 300px'
      btnDiv.style['grid-column-gap'] = '20px'
      btnDiv.style['align-items'] = 'center'
      btnDiv.style['justify-items'] = 'left'
      let btn = document.createElement('button')
      btn.classList.add('button')
      btn.disabled = true
      btn.style.width = '30px'
      btn.style.height = '30px'
      btn.style['box-shadow'] = '0 3px rgb(219, 213, 213)'
      btn.style['border-radius'] = '10px'
      btn.classList.add = 'sliderSelector'
      btn.id = 'btn_' + slider.id

      btn.style['background-image'] = background
      btn.style['background-position'] = 'center center'
      btn.style['background-repeat'] = 'no-repeat'
      btn.style['background-color'] = background

      let optionName = document.createElement('span')
      optionName.id = 'name_' + slider.id
      optionName.innerHTML = `<h2>${name}</h2>`
      let instruction = document.createElement('span')
      instruction.id = 'instruction_' + slider.id

      btn.addEventListener('click', (e) => {
        if(notClicked && true){
          notClicked = false
          window.activeSliderId = slider.id
          window.activeSlider = slider
          this._selectedSlider = slider.id

          this._shadowRoot.querySelectorAll('.sliderLayer').forEach(slider => {
            slider.style.zIndex = 1
            slider.classList.remove('active')
            this._shadowRoot.querySelector(`#${'name_' + slider.id}`).style.border = "0px"
            this._shadowRoot.querySelector(`#${'instruction_' + slider.id}`).innerHTML = ""
          })

          this._shadowRoot.querySelector(`#${'name_' + slider.id}`).style['border-bottom'] = "2px solid #000000"
          slider.style.zIndex = 2
          slider.classList.add('active')
          this._shadowRoot.querySelector(`#${'instruction_' + slider.id}`).innerHTML = 'Click on the slider'
          notClicked = true
        }
      })
      btnDiv.appendChild(optionName)
      btnDiv.appendChild(btn)
      btnDiv.appendChild(instruction)
      this._shadowRoot.querySelector('.container_buttons').appendChild(btnDiv)

      if(typeof(value) != 'undefined'){
        slider.value = value
        hidden_input.value = value
        slider.classList.add('visible')
        slider.classList.add(name)
        this._shadowRoot.querySelector(`#btn_${slider.id}`).disabled = false
      }

    })

    const firstSliderId = this.items.filter(i => typeof(i.value) == 'undefined' ).map(i => i.id)[0]
    this._shadowRoot.querySelector(`#btn_${firstSliderId}`).disabled = false
    this._shadowRoot.querySelector(`#instruction_${firstSliderId}`).innerHTML = 'Click on the slider'
    this._shadowRoot.querySelector(`#${firstSliderId}`).style.zIndex = 2
    this._shadowRoot.querySelector(`#${firstSliderId}`).classList.add('active')
    this._shadowRoot.querySelector(`#name_${firstSliderId}`).style['border-bottom'] = "2px solid #000000"

  }
}

// register in a browser
window.customElements.define('multi-vas', MultiVas)
